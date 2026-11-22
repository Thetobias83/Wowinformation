const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
function environment(){
 const elements=new Map();const element=key=>{if(!elements.has(key))elements.set(key,{innerHTML:'',value:'',textContent:'',classList:{remove(){},toggle(){return false}},setAttribute(){},addEventListener(){},focus(){},scrollIntoView(){}});return elements.get(key);};
 const context=vm.createContext({document:{querySelector:element,querySelectorAll:()=>[],addEventListener(){},activeElement:{tagName:'BODY'}},window:{addEventListener(){},scrollTo(){}},location:{hash:'#home',href:'http://localhost/'},localStorage:{getItem(){return null},setItem(){}},navigator:{},console});
 vm.runInContext(['data.js','world.js','professions.js','dungeons.js','details.js','research.js','lore.js','scenes.js','app.js'].map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n'),context);
 return {context,element};
}
test('every guide and every available tab renders without exceptions',()=>{
 const {context,element}=environment();const routes=vm.runInContext('GUIDES.flatMap(g=>tabs(g).map(t=>({id:g.id,tab:t[0],title:g.title})))',context);
 assert(routes.length>500);
 for(const r of routes){context.location.hash='#guide/'+r.id+'/'+r.tab;vm.runInContext('render()',context);const html=element('#main').innerHTML;assert(html.includes('area-panel'),r.id+'/'+r.tab);assert(!html.includes('undefined'),r.id+'/'+r.tab);assert(html.includes('aria-current="page"'),r.id+'/'+r.tab);}
});
test('invalid guide and tab URLs have safe fallbacks',()=>{
 const {context,element}=environment();context.location.hash='#guide/does-not-exist';vm.runInContext('render()',context);assert(element('#main').innerHTML.includes('hittades inte'));context.location.hash='#guide/duskwood/invalid';vm.runInContext('render()',context);assert(element('#main').innerHTML.includes('DIN SNABBGUIDE'));
});
test('all category routes and the source page render',()=>{
 const {context,element}=environment();for(const route of ['home','zones','dungeons','raids','professions','gold','secrets','saved','sources']){context.location.hash='#'+route;vm.runInContext('render()',context);assert(element('#main').innerHTML.length>100,route);}
});

test('wiki adaptations display attribution and are included in full-text search',()=>{
 const {context,element}=environment();context.location.hash='#guide/deadmines/lore';vm.runInContext('render()',context);const html=element('#main').innerHTML;assert(html.includes('Från stenhuggare till Defias'));assert(html.includes('?action=history'));assert(html.includes('https://creativecommons.org/licenses/by-sa/4.0/'));assert(html.includes('Texten har kortats, översatts'));
 assert(vm.runInContext("searchText(GUIDES.find(g=>g.id==='deadmines')).includes('stonemasons')",context));
});
