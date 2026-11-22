const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const data=vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8')+';({GUIDES,SOURCES,CATEGORIES})');
test('every guide has a unique routable ID and a valid category',()=>{
 const ids=new Set();for(const g of data.GUIDES){assert.match(g.id,/^[a-z0-9-]+$/);assert(!ids.has(g.id),g.id);ids.add(g.id);assert(data.CATEGORIES.some(c=>c[0]===g.category));assert(g.title&&g.intro&&g.subtitle);}
});
test('every published dungeon boss has mechanics and all three role notes',()=>{
 for(const g of data.GUIDES.filter(g=>g.category==='dungeons')){assert(g.bosses.length>=8);assert(g.min<=g.max);assert(g.sources.length);for(const b of g.bosses){for(const key of ['name','mechanic','tank','healer','dps'])assert(b[key]?.trim(),g.id+': '+key);}}
});
test('guide source references resolve to HTTPS sources',()=>{for(const g of data.GUIDES)for(const ref of g.sources||[])assert.match(data.SOURCES[ref]?.url||'',/^https:\/\//);});
test('unreleased raids disclose their limits and do not fabricate boss fights',()=>{
 for(const id of ['barrow-deeps','hyjal-summit']){const g=data.GUIDES.find(g=>g.id===id);assert(!g.bosses);assert.match(g.status,/inväntar/);assert(g.caution);}
 assert.match(data.GUIDES.find(g=>g.id==='onyxia').caution,/inte verifierad/);
});
test('static entry references real local assets and Swedish language',()=>{const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(html,/<html lang="sv">/);for(const file of ['app.js','data.js','style.css','compass.svg','landscape.svg'])assert(fs.existsSync(path.join(root,file)),file);});
