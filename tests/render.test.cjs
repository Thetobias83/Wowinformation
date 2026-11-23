const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
function environment(){
 const elements=new Map();const element=key=>{if(!elements.has(key))elements.set(key,{innerHTML:'',value:'',textContent:'',classList:{remove(){},toggle(){return false}},setAttribute(){},addEventListener(){},focus(){},scrollIntoView(){}});return elements.get(key);};
 const context=vm.createContext({document:{querySelector:element,querySelectorAll:()=>[],addEventListener(){},activeElement:{tagName:'BODY'}},window:{addEventListener(){},scrollTo(){}},location:{hash:'#home',href:'http://localhost/'},localStorage:{getItem(){return null},setItem(){}},navigator:{},console});
 vm.runInContext(['data.js','world.js','professions.js','dungeons.js','details.js','research.js','lore.js','lore-more.js','dungeon-runs.js','player-guides.js','calculators.js','player-ui.js','auction-house.js','raid-planner.js','camping.js','cities.js','scenes.js','app.js'].map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n'),context);
 return {context,element};
}
test('every guide and every available tab renders without exceptions',()=>{
 const {context,element}=environment();const routes=vm.runInContext('GUIDES.flatMap(g=>tabs(g).map(t=>({id:g.id,tab:t[0],title:g.title})))',context);
 assert(routes.length>500);
 for(const r of routes){context.location.hash='#guide/'+r.id+'/'+r.tab;vm.runInContext('render()',context);const html=element('#main').innerHTML;assert(html.includes('area-panel'),r.id+'/'+r.tab);assert(!html.includes('undefined'),r.id+'/'+r.tab);assert(html.includes('aria-current="page"'),r.id+'/'+r.tab);}
});
test('invalid guide and tab URLs have safe fallbacks',()=>{
 const {context,element}=environment();context.location.hash='#guide/does-not-exist';vm.runInContext('render()',context);assert(element('#main').innerHTML.includes('hittades inte'));context.location.hash='#guide/duskwood/invalid';vm.runInContext('render()',context);assert(element('#main').innerHTML.includes('PRAKTISK ÖVERSIKT'));
});
test('all category routes and the source page render',()=>{
 const {context,element}=environment();for(const route of ['home','zones','dungeons','raids','professions','gold','secrets','saved','sources']){context.location.hash='#'+route;vm.runInContext('render()',context);assert(element('#main').innerHTML.length>100,route);}
});

test('wiki adaptations display attribution and are included in full-text search',()=>{
 const {context,element}=environment();context.location.hash='#guide/deadmines/lore';vm.runInContext('render()',context);const html=element('#main').innerHTML;assert(html.includes('Från stenhuggare till Defias'));assert(html.includes('?action=history'));assert(html.includes('https://creativecommons.org/licenses/by-sa/4.0/'));assert(html.includes('Texten har kortats, översatts'));
 assert(vm.runInContext("searchText(GUIDES.find(g=>g.id==='deadmines')).includes('stonemasons')",context));
});

test('run plans link the zone story and explain the reason behind each tip',()=>{
 const {context,element}=environment();context.location.hash='#guide/deadmines/run';vm.runInContext('render()',context);let html=element('#main').innerHTML;assert(html.includes('Rutt &amp; tips'));assert(html.includes('Förbered övergången från Shredder till Sneed'));assert(html.includes('Varför?'));assert(html.includes('#guide/westfall/lore'));
 context.location.hash='#guide/deadmines/guide';vm.runInContext('render()',context);assert(element('#main').innerHTML.includes('Dungeonens koppling till området'));
 context.location.hash='#guide/deadmines/bosses';vm.runInContext('render()',context);html=element('#main').innerHTML;assert(html.includes('Taktiskt råd'));assert(html.includes('boss-note-2'));
});

test('new sections expose usable stats, class-role links and calculators',()=>{
 const {context,element}=environment();
 for(const [route,checks] of [
 ['#guide/role-tank/guide',['class-warrior','class-paladin','class-druid']],
 ['#guide/class-druid/stats',['björn','katt','Balance','Restoration']],
 ['#guide/class-hunter/tools',['data-stat-weight','Ditt verifierade bonusmål','inte DPS']],
 ['#guide/gold-cloth/guide',['Northfold','När metoden','Räkna rundans']],
 ['#guide/gold-cloth/tools',['Förlorade depositioner','data-calculator="gold"','Total tid']]
 ]){context.location.hash=route;vm.runInContext('render()',context);for(const text of checks)assert(element('#main').innerHTML.includes(text),route+': '+text);}
});

test('auction hub exposes strategies, worked examples and independent batch and actual calculators',()=>{const {context,element}=environment();for(const [tab,expected] of [['strategies','Åtta sätt'],['examples','Bara halva lagret'],['tools','ah-quantity'],['guide','En enkel handelsjournal']]){context.location.hash='#guide/auction-house/'+tab;vm.runInContext('render()',context);assert(element('#main').innerHTML.includes(expected),tab);}const html=element('#main').innerHTML;assert(html.includes('Egna anteckningar'));context.location.hash='#guide/auction-house/tools';vm.runInContext('render()',context);assert(element('#main').innerHTML.includes('calc-sales'));assert.equal(vm.runInContext('AUCTION_STRATEGIES.length',context),8);});

test('raid planner renders its own route, escapes imported names and links from raids',()=>{const {context,element}=environment();context.location.hash='#planner';vm.runInContext('render()',context);let html=element('#main').innerHTML;for(const expected of ['rp-settings','rp-add','rp-group-board','rp-output','Europe/Stockholm','liveanmälan'])assert(html.includes(expected),expected);vm.runInContext('rpCurrent().players.push({id:"x",name:"<img src=x onerror=alert(1)>",className:"Priest",role:"healer",status:"confirmed",group:1,job:"<script>bad</script>"});render()',context);html=element('#main').innerHTML;assert(!html.includes('<img src=x'));assert(html.includes('&lt;img'));context.location.hash='#raids';vm.runInContext('render()',context);assert(element('#main').innerHTML.includes('href="#planner"'));});

test('fight execution is first, with phases, class-role assignments and preserved support tools',()=>{const {context,element}=environment();context.location.hash='#planner';vm.runInContext('render()',context);let html=element('#main').innerHTML;assert(html.indexOf('id="rp-fight"')<html.indexOf('id="rp-settings"'));for(const text of ['Fas 1','Ansvarig spelare','Reserv / avlösare','Uppgift under fasen','Visa klass','Visa roll'])assert(html.includes(text),text);vm.runInContext('rpCurrent().raid="onyxia";rpCurrent().fights=[rpFightFromGuide(rpCurrent())];render()',context);html=element('#main').innerHTML;assert(html.includes('förberedande Classic-plan'));assert(html.includes('Deep Breath'));assert(html.includes('Hämta bossunderlag'));assert(html.includes('Priest'));});
