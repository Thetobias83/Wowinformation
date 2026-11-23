const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const files=['data.js','world.js','professions.js','dungeons.js','details.js','research.js','lore.js','lore-more.js','dungeon-runs.js','player-guides.js','calculators.js','player-ui.js','auction-house.js','raid-planner.js','cities.js','scenes.js'];
const data=vm.runInNewContext(files.map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n')+';({GUIDES,SOURCES,CATEGORIES,ZONE_BOOK,PROFESSION_BOOK,LORE_CHAPTERS,scene})');
test('every guide has a unique routable ID and a valid category',()=>{
 const ids=new Set();for(const g of data.GUIDES){assert.match(g.id,/^[a-z0-9-]+$/);assert(!ids.has(g.id),g.id);ids.add(g.id);assert(data.CATEGORIES.some(c=>c[0]===g.category));assert(g.title&&g.intro&&g.subtitle);}
});
test('every published dungeon boss has mechanics and all three role notes',()=>{
 for(const g of data.GUIDES.filter(g=>g.category==='dungeons')){assert(g.bosses.length>=1);assert(g.min<=g.max);assert(g.sources.length);for(const b of g.bosses){for(const key of ['name','mechanic','tank','healer','dps'])assert(b[key]?.trim(),g.id+': '+key);}}
});
test('guide source references resolve to HTTPS sources',()=>{for(const g of data.GUIDES)for(const ref of g.sources||[])assert.match(data.SOURCES[ref]?.url||'',/^https:\/\//);});
test('unreleased raids disclose their limits and do not fabricate boss fights',()=>{
 for(const id of ['barrow-deeps','hyjal-summit']){const g=data.GUIDES.find(g=>g.id===id);assert(!g.bosses);assert.match(g.status,/inväntar/);assert(g.caution);}
 assert.match(data.GUIDES.find(g=>g.id==='onyxia').caution,/inte verifierad/);
});
test('static entry loads every content file before the UI',()=>{const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(html,/<html lang="sv">/);for(const file of [...files,'app.js','style.css','areas.css','compass.svg']){assert(fs.existsSync(path.join(root,file)),file);assert(html.includes('./'+file),file);}assert(html.indexOf('./details.js')<html.indexOf('./app.js'));});
test('all 35 current Forever dungeon wings are present',()=>{
 const expected=['ragefire-chasm','hall-of-thanes','ruins-of-lordaeron','deadmines','wailing-caverns','shadowfang-keep','blackfathom-deeps','stockade','excavation-site','city-of-dalaran','gnomeregan','razorfen-kraul','sm-graveyard','sm-library','sm-armory','sm-cathedral','razorfen-downs','drowned-city','kroldok','uldaman','zulfarrak','maraudon','alcaz-prison','sunken-temple','blackrock-depths','dire-maul-east','dire-maul-west','dire-maul-north','lower-blackrock-spire','upper-blackrock-spire','blackmaw-hold','shapers-terrace','stratholme-live','stratholme-undead','scholomance'];
 const ids=data.GUIDES.filter(g=>g.category==='dungeons').map(g=>g.id);assert.equal(ids.length,35);for(const id of expected)assert(ids.includes(id),id);
});
test('all area pages have a theme, lore and important people',()=>{
 for(const g of data.GUIDES.filter(g=>['zones','dungeons','raids'].includes(g.category))){assert(g.biome,g.id);assert(g.lore?.length,g.id);assert(g.npcs?.length,g.id);assert(g.sources?.length,g.id);assert.match(data.scene(g),/<svg/);}
 assert.equal(data.GUIDES.filter(g=>g.category==='zones').length,50);
});
test('every profession has four skill stages, camping, materials and gold advice',()=>{
 const list=data.GUIDES.filter(g=>g.category==='professions');assert.equal(list.length,12);for(const g of list){assert.equal(g.profession.stages.length,4,g.id);assert.equal(g.profession.camp.length,3,g.id);assert(g.profession.tools&&g.profession.pair&&g.gold,g.id);}
});
test('related guide links resolve and earlier user data keys remain valid',()=>{
 const ids=new Set(data.GUIDES.map(g=>g.id));for(const g of data.GUIDES)for(const id of g.related||[])assert(ids.has(id),id);for(const id of ['deadmines','duskwood-torch','sleeping-bag','miner-johnson','elwynn','barrens'])assert(ids.has(id));
});


test('all areas have substantial exploration and every new secret is connected',()=>{
 for(const g of data.GUIDES.filter(g=>['zones','dungeons','raids'].includes(g.category))){assert(g.exploration.length>=2,g.id);for(const x of g.exploration)assert(x.title&&x.text.length>60&&x.kind,g.id);if(g.category!=='raids')assert(g.lore.length>=2,g.id);}
 for(const id of ['scarlet-banner','library-books','malignant-root','alcaz-disguise','tashkal']){const g=data.GUIDES.find(g=>g.id===id);assert(g.steps.length>=4,id);assert(g.sources.length,id);assert(g.related.length,id);}
 assert.equal(data.GUIDES.filter(g=>g.category==='secrets').length,12);
});

test('wiki chapters preserve sources and valid cross-area connections',()=>{
 assert.equal(data.LORE_CHAPTERS.length,24);
 const ids=new Set();for(const c of data.LORE_CHAPTERS){assert(!ids.has(c.id),c.id);ids.add(c.id);assert.equal(c.paragraphs.length,3);assert(c.people.length>=2);assert.match(data.SOURCES['lore-'+c.id].url,/^https:\/\/warcraft\.wiki\.gg\/wiki\//);for(const id of c.guides){const g=data.GUIDES.find(g=>g.id===id);assert(g.loreChapters.includes(c.id));}}
});

test('Classic discovery starts disclose limits and connect to sourced lore',()=>{
 for(const id of ['cortellos-riddle','linken-adventure','pamela-darrowshire']){const g=data.GUIDES.find(g=>g.id===id);assert.match(g.status,/Forever-detaljer inte verifierade/);assert.match(g.caution,/Ingen fullständig/);assert(g.steps.length>=4);assert(g.loreChapters.length);assert(g.sources.some(k=>k.startsWith('lore-')));assert(g.npcs.length>=2);}
 for(const id of ['blackfathom-deeps','razorfen-kraul','razorfen-downs','maraudon','duskwood','teldrassil','zulfarrak','durotar','mulgore'])assert(data.GUIDES.find(g=>g.id===id).loreChapters?.length,id);
});

test('expanded dungeon plans have actionable tips and preserve saved boss-note order',()=>{
 const earlier=vm.runInNewContext(files.filter(f=>f!=='dungeon-runs.js').map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n')+';GUIDES');
 const expanded=data.GUIDES.filter(g=>g.runPlan);assert.equal(expanded.length,8);
 for(const g of expanded){assert.equal(g.runPlan.route.length,3);assert.equal(g.runPlan.tips.length,3);assert(g.runPlan.connection.length>100);assert(data.GUIDES.some(x=>x.id===g.runPlan.zone&&x.category==='zones'));for(const tip of g.runPlan.tips)assert(tip.length===4&&tip[0].trim()&&tip.slice(1).every(x=>x.length>10));assert.equal(JSON.stringify(g.bosses.map(b=>b.name)),JSON.stringify(earlier.find(x=>x.id===g.id).bosses.map(b=>b.name)),g.id);}
 assert.equal(expanded.flatMap(g=>g.bosses).filter(b=>b.smartTip).length,12);
});

test('all nine classes map to conventional Forever roles and explain build-specific stats',()=>{
 const list=data.GUIDES.filter(g=>g.classInfo);assert.equal(list.length,9);assert.equal(data.GUIDES.filter(g=>g.roleKey).length,4);
 for(const g of list){assert(g.sources.length>=2,g.id);assert(g.classInfo.profiles.length,g.id);for(const row of g.classInfo.profiles)assert.equal(row.length,3);for(const r of g.classInfo.roles){const role=data.GUIDES.find(x=>x.id==='role-'+r);assert(role.related.includes(g.id));}}
 for(const id of ['mage','warlock','rogue','hunter'])assert(!list.find(g=>g.id==='class-'+id).classInfo.roles.includes('healer'));
 assert(!list.find(g=>g.id==='class-shaman').classInfo.roles.includes('tank'));
});
test('practical gold guides include a method, selling plan and stop criteria',()=>{
 const list=data.GUIDES.filter(g=>g.farmPlan);assert.equal(list.length,7);assert.equal(data.GUIDES.filter(g=>g.category==='gold').length,11);
 for(const g of list){assert(g.farmPlan.needs&&g.farmPlan.targets.length&&g.farmPlan.sell&&g.farmPlan.stop);assert.equal(g.steps.length,4);}
 const workflow=fs.readFileSync(path.join(root,'.github/workflows/pages.yml'),'utf8');for(const f of ['player-guides.js','calculators.js','player-ui.js'])assert(workflow.includes(f),f);
});
