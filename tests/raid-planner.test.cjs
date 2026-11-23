const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function env(raw=null,fail=false){let saved;const context=vm.createContext({CATEGORIES:[['raids','Raider','']],read:()=>raw,write:(k,v)=>{saved=JSON.parse(JSON.stringify(v));return !fail},console});vm.runInContext(fs.readFileSync(path.join(__dirname,'../raid-planner.js'),'utf8'),context);return {run:s=>vm.runInContext(s,context),saved:()=>saved};}
test('raid composition counts only confirmed players and reports group and role conflicts',()=>{
 const {run}=env();run(`var p=rpNew();p.targets.healer=2;p.players=Array.from({length:7},(_,i)=>({id:'x'+i,name:'Spelare'+i,className:'Warrior',role:'tank',status:i===6?'reserve':'confirmed',group:1,job:''}));`);
 assert.equal(run('rpSummary(p).active.length'),6);assert.equal(run('rpSummary(p).counts.tank'),6);assert(run('rpSummary(p).warnings.some(w=>w.includes("Saknar 2"))'));assert(run('rpSummary(p).warnings.some(w=>w.includes("Grupp 1"))'));
 run('p.players[0].group=8');assert(run('rpSummary(p).warnings.some(w=>w.includes("utanför"))'));run('p.players[0].group=0');assert(run('rpSummary(p).warnings.some(w=>w.includes("utan grupp"))'));
});
test('backup import validates data and creates independent plans and player IDs',()=>{
 const {run}=env();run(`var p=rpNew();p.players=[{id:'one',name:'Alva',className:'Priest',role:'healer',status:'confirmed',group:1,job:'Tankhealing'}];var r=rpImport(JSON.stringify({version:1,plan:p}));`);
 assert.equal(run('r.error'),undefined);assert.notEqual(run('r.plan.id'),run('p.id'));assert.notEqual(run('r.plan.players[0].id'),'one');run('r.plan.targets.healer=3');assert.equal(run('p.targets.healer'),0);
 assert(run('rpImport("not json").error'));assert(run('rpImport(JSON.stringify({version:2,plan:p})).error'));run('p.players.push({...p.players[0],id:"two",name:" alva "})');assert(run('rpValidate(p)'));
});
test('invalid dates, roles, groups and oversized backups cannot enter storage',()=>{
 const {run}=env();run('var p=rpNew()');assert.equal(run('rpValidate(p)'),'');
 for(const mutation of ['p.date="2026-02-30"','p.time="25:00"','p.targets.tank=-1','p.notes="x".repeat(4001)','p.size=12']){run('p=rpNew();'+mutation);assert(run('rpValidate(p)'),mutation);}
 run(`p=rpNew();p.players=[{id:'x',name:'X',className:'Mage',role:'invalid',status:'confirmed',group:1,job:''}]`);assert(run('rpValidate(p)'));
 run('p.players[0].role="ranged";p.players[0].group=9');assert(run('rpValidate(p)'));
});
test('storage failures are visible and plain text includes status, tasks and time zone',()=>{
 const e=env(null,true);e.run('rpLoad();rpSave()');assert.match(e.run('rpNotice'),/Kunde inte spara/);assert(e.saved());
 e.run(`var p=rpNew();p.date='2026-12-09';p.time='19:30';p.players=[{id:'one',name:'Alva',className:'Priest',role:'healer',status:'reserve',group:1,job:'Reservhealer'}]`);const text=e.run('rpText(p)');assert.match(text,/Europe\/Stockholm/);assert.match(text,/Reservhealer/);assert.match(text,/Bekräftade: 0\/10/);assert.match(text,/Reserv/);
});
test('actions preserve saved plans and a copied evening resets attendance without overwriting',()=>{
 const handlers={},elements=new Map();const element=id=>{if(!elements.has(id))elements.set(id,{value:'',innerHTML:'',textContent:''});return elements.get(id);};
 const context=vm.createContext({CATEGORIES:[['raids']],read:()=>null,write:()=>true,esc:s=>String(s??''),title:()=>'',document:{addEventListener:(name,fn)=>handlers[name]=fn,querySelector:element}});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../raid-planner.js'),'utf8'),context);
 vm.runInContext(`rpInit();var p=rpCurrent();p.title='Guildkväll';p.date='2026-12-09';p.checks[0]=true;p.players=[{id:'one',name:'Alva',className:'Priest',role:'healer',status:'confirmed',group:1,job:'Tankhealing'}]`,context);
 const action=name=>handlers.click({target:{closest:selector=>selector==='[data-rp-action]'?{dataset:{rpAction:name}}:null}});
 action('duplicate');assert.equal(vm.runInContext('rpLoad().plans.length',context),2);assert.equal(vm.runInContext('rpCurrent().players[0].status',context),'tentative');assert.equal(vm.runInContext('rpCurrent().date',context),'');assert.equal(vm.runInContext('rpCurrent().checks[0]',context),false);assert.equal(vm.runInContext('rpLoad().plans[0].players[0].status',context),'confirmed');
 action('export');const backup=element('#rp-output').value;assert.equal(JSON.parse(backup).plan.title,'Guildkväll · ny kväll');element('#rp-import').value=backup;action('import');assert.equal(vm.runInContext('rpLoad().plans.length',context),3);
 vm.runInContext('rpDirty=true',context);action('new');assert.equal(vm.runInContext('rpLoad().plans.length',context),3);assert.match(element('#rp-status').textContent,/Spara ändringarna/);
});
