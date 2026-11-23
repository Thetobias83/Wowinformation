const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const calc=vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../calculators.js'),'utf8')+';({goldResult,statResult,hitResult,auctionResult})');
test('supplier example covers purchase ceiling and downside at a fixed COD price',()=>{
 const batch={quantity:100,buy:0.35,sell:0.45,fee:5,losses:0,other:0.75,goal:5};
 let r=calc.auctionResult(batch);assert.equal(r.net,7);assert.equal(r.maxBuy,0.37);
 r=calc.auctionResult({...batch,sell:0.40});assert.equal(r.maxBuy,0.3225);
 r=calc.auctionResult({...batch,sell:0.36});assert(Math.abs(r.net+1.55)<1e-9);
});
test('gold accounts for sales, vendor loot, failed deposits and full run time',()=>{
 const r=calc.goldResult({sales:35,vendor:5,materials:8,fees:2,deposits:1,expenses:4,minutes:30});assert.equal(r.net,25);assert.equal(r.perHour,50);
 const loss=calc.goldResult({sales:0,vendor:1,materials:0,fees:0,deposits:2,expenses:3,minutes:60});assert.equal(loss.net,-4);assert.equal(loss.perHour,-4);
});
test('money calculations reject invalid values and zero or vanishing time',()=>{
 const input={sales:0,vendor:0,materials:0,fees:0,deposits:0,expenses:0,minutes:30};
 for(const minutes of [0,-1,NaN,Infinity,1e-300])assert(calc.goldResult({...input,minutes}).error);
 assert(calc.goldResult({...input,sales:-5}).error);assert(calc.goldResult({...input,fees:Infinity}).error);assert.equal(calc.goldResult(input).net,0);
});
test('weighted comparison uses only entered weights and preserves ties',()=>{
 const r=calc.statResult([{a:10,b:7,weight:2},{a:1,b:3,weight:4},{a:999,b:0,weight:0}]);assert.equal(r.a,24);assert.equal(r.b,26);assert.equal(r.delta,2);
 assert.equal(calc.statResult([{a:10,b:20,weight:0.5},{a:10,b:0,weight:0.5}]).delta,0);
 assert(calc.statResult([{a:2,b:3,weight:0}]).error);assert(calc.statResult([{a:2,b:3,weight:NaN}]).error);assert(calc.statResult([{a:-2,b:3,weight:1}]).error);
});
test('hit helper separates bonus deficit and surplus without supplying a game cap',()=>{
 let r=calc.hitResult({gear:3,talents:2,buffs:1,target:8});assert.equal(r.total,6);assert.equal(r.missing,2);assert.equal(r.surplus,0);
 r=calc.hitResult({gear:9,talents:0,buffs:1,target:8});assert.equal(r.missing,0);assert.equal(r.surplus,2);
 assert(calc.hitResult({gear:3,talents:2,buffs:1,target:NaN}).error);assert(calc.hitResult({gear:300,talents:0,buffs:0,target:8}).error);
});

test('auction batch calculates net, conservative copper limits and price-fall losses',()=>{const input={quantity:20,buy:0.4,sell:0.5,fee:5,losses:0,other:0.5,goal:1};let r=calc.auctionResult(input);assert.equal(r.net,1);assert.equal(r.breakEven,0.4474);assert.equal(r.maxBuy,0.4);r=calc.auctionResult({...input,sell:0.42});assert(Math.abs(r.net+0.52)<1e-9);assert(calc.auctionResult({...input,goal:100}).maxBuy<0);for(const patch of [{quantity:0},{quantity:1.5},{fee:100},{fee:Infinity},{buy:-1}])assert(calc.auctionResult({...input,...patch}).error);assert.equal(calc.auctionResult({...input,buy:0,sell:0,other:0,goal:0}).net,0);});
