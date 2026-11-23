const patchBoss=(id,name,values)=>{const g=GUIDES.find(g=>g.id===id),b=g?.bosses?.find(b=>b.name===name);if(b)Object.assign(b,values);};
patchBoss('city-of-dalaran','Mana Devourer',{mechanic:'Dränerar mana; rensa rummet före pull.',healer:'Spara mana.',dps:'Prioritera skada innan gruppens mana tar slut.'});
patchBoss('city-of-dalaran','Shade of the Archmage',{mechanic:'Återvändande manasfär och Arcane Explosion.',tank:'Flytta från sfären.',healer:'Håll avstånd.',dps:'Undvik explosionens radie.'});
patchBoss('drowned-city','Min’loth the Serpent',{mechanic:'Trollfas övergår till giftig orm.',tank:'Säkra fasbytet.',healer:'Spara mana; rensa gift.',dps:'Hjälp gift-dispel.'});
const RAID_LORE={
 onyxia:{biome:'lava',lore:'Onyxia utövar sin makt både från en grotta i Dustwallow och genom politiska intriger i Stormwind. Hon är dotter till Deathwing. Attunementkedjan handlar därför om mer än en nyckel: den förbinder drakarnas krig med kungarikets maktspel.',npcs:[{name:'Onyxia / Lady Katrana Prestor',description:'Samma drake och den identitet hon använder i Stormwinds politik.'},{name:'Marshal Windsor / Rexxar',description:'Fraktionernas attunementspår leder genom olika personer och prövningar.'}]},
 'barrow-deeps':{biome:'haunted',lore:'Djupen under Hyjal förknippas med nattalvernas långa fångenskapshistoria och Illidans gamla fängelse. Forevers raid tar gruppen ned i en annan del av bergets efterkrigstid än den öppna toppen.',npcs:[{name:'Illidan Stormrage',description:'Historisk koppling till platsens fängelse; inte ett påstående om att han är raidboss.'},{name:'Sonya Darkhallow',description:'Namn i den publicerade förhandsöversikten. Fullständig fightguide saknas före öppning.'}]},
 'hyjal-summit':{biome:'enchanted',lore:'Toppen kring Nordrassil bär spåren av kampen mot Archimonde. Forever utspelar sig efter den striden. Raiden ska därför inte blandas ihop med Burning Crusades återblick på slaget.',npcs:[{name:'Nordrassil',description:'Världsträdet och platsens centrum, inte en NPC.'},{name:'The Wild King',description:'Namn i den publicerade förhandsöversikten. Verifierade mekaniker inväntar raidöppning.'}]}
};
SOURCES.raidPreview={name:'Method · Forever-raider, förhandsöversikt',url:'https://www.method.gg/wow-forever/wow-forever-raids-a-look-at-barrow-deeps-hyjal-summit-and-onyxias-lair'};
for(const [id,v] of Object.entries(RAID_LORE)){const g=GUIDES.find(g=>g.id===id);Object.assign(g,v,{lore:[v.lore],loreScope:'Forever-kontext med Classic-bakgrund',entrance:id==='onyxia'?'Onyxias grotta i Dustwallow Marsh':'Mount Hyjal · se raidens åtkomstinformation',gold:'Förbered raiden med en budget för reparationer och förbrukningsvaror. Sälj material och tillverkade varor i små mängder i stället för att spekulera med hela reskassan.'});g.sources.push('raidPreview');}
const RAID_PREVIEW={
 'barrow-deeps':['Deepscar Matriarch','Khalith the Dreadspinner','Amethrax','Ravus and Darlissa','Elder Tangleclaw','Well of Sorrow','Del’lynar Songwood','Sonya Darkhallow'],
 'hyjal-summit':['Bandalar','Ancient of Decay','Time-Lost Battalion','Sylvestris Dusksong','Old Gloomlurker','Gharalis the Abyssal','Kathris the Haunted','Anara Chillwind','Elder Minderel','Tracker Stillwind','Council of Thorns','Nythus the Dreambound','The Wild King']
};
for(const [id,names] of Object.entries(RAID_PREVIEW))GUIDES.find(g=>g.id===id).previewBosses=names;
const addEncounter=(id,row)=>GUIDES.find(g=>g.id===id).bosses.push(boss(...row));
const lbrs=GUIDES.find(g=>g.id==='lower-blackrock-spire');
lbrs.bosses=lbrs.bosses.filter(b=>!b.name.includes(' / '));
for(const row of [
 ['Spirestone Butcher · rare','Närstrid bland ogres.','Rensa pull.','Bevaka tank.','Fokusera.'],
 ['Spirestone Battle Lord · rare','Ogre med fysisk skada.','Isolera.','Bevaka tank.','Undvik extragrupper.'],
 ['Spirestone Lord Magus · rare','Ogre-magiker.','Säkra pull.','Håll sikt.','Avbryt magi.'],
 ['Bannok Grimaxe · rare','Valfri orcstrid.','Rensa yta.','Bevaka tank.','Fokusera.'],
 ['Ghok Bashguud · rare','Valfri närstrid.','Isolera.','Bevaka tank.','Följ markering.'],
 ['Crystal Fang · rare','Spindelförstärkning.','Samla adds.','Håll avstånd.','Ta småspindlar.'],
 ['Burning Felguard · rare','Demon i gruvområdet.','Isolera.','Bevaka tank.','Undvik extragrupper.']])addEncounter('lower-blackrock-spire',row);
const brd=GUIDES.find(g=>g.id==='blackrock-depths');brd.bosses=brd.bosses.filter(b=>!b.name.startsWith('Ring of Law'));
for(const row of [
 ['Gorosh the Dervish · arena','Whirlwind.','Säker position.','Håll avstånd.','Lämna virvel.'],
 ['Grizzle · arena','Fysisk burst.','Spara defensivt.','Tankläkning.','Håll threat.'],
 ['Hedrum the Creeper · arena','Nät och gift.','Håll position.','Rensa gift.','Bevaka kontroll.'],
 ['Eviscerator · arena','Hård närstrid.','Vänd bort.','Bevaka tank.','Säker flank.'],
 ['Ok’thor the Breaker · arena','Arkanmagi.','Håll kontroll.','Grupphälsa.','Avbryt.'],
 ['Anub’shiah · arena','Förbannelser och magi.','Säkra position.','Ta bort curse.','Avbryt.'],
 ['Theldren · questarena','Koordinerad motståndargrupp.','Skydda laget.','Bevaka flera mål.','CC och fokus.']])addEncounter('blackrock-depths',row);
const st=GUIDES.find(g=>g.id==='sunken-temple');st.bosses=st.bosses.filter(b=>b.name!=='Sex trollväktare');
for(const name of ['Gasher','Hukku','Loro','Mijan','Zolo','Zul’Lor'])addEncounter('sunken-temple',[name+' · trollväktare','En del av templets väktarevent.','Säkra en pull.','Mana mellan möten.','Stoppa läkande kast när de finns.']);
addEncounter('sunken-temple',['Spawn of Hakkar · valfri','Patrullerande drakliknande möte.','Isolera.','Håll räckvidd.','Undvik sidopull.']);
for(const g of GUIDES.filter(g=>g.category==='dungeons')){g.label=g.bosses.length+' möten · '+g.level;g.subtitle=g.subtitle.replace(/\.{2,}$/g,'.');}
// Additional discoveries keep the original three URLs intact.
SOURCES.lyn={name:'Method · Tome of Dalaran och Lyn',url:'https://www.method.gg/wow-forever/dungeons/city-of-dalaran'};
GUIDES.push({id:'lyn-secret',category:'secrets',title:'Boken som ingen såg',subtitle:'En bok i Arugals rum öppnar ett extra möte i Dalaran.',place:'Shadowfang Keep / Dalaran',faction:'Alla',biome:'arcane',label:'Dold boss · Lyn the Ignored',status:'Forever · källbaserad upptäckt',sources:['lyn'],intro:'Lyn är ett extra möte i City of Dalaran. Tome of Dalaran behövs för att kalla fram honom.',steps:['Undersök bordet i Arugals rum efter en avslutad Shadowfang Keep-runda och leta efter Black Tome.','Res till Ambermill i Silverpine och använd boken vid ley line-strukturen i rådhuset enligt questledtråden.','Ta Tome of Dalaran till instansen. Samordna med gruppen innan ni kallar Lyn.'],lore:['Dalarans hemlighet börjar i ett annat slott. Boken binder samman Arugals rum, magin i Ambermill och det extra mötet inne i staden.'],npcs:[{name:'Lyn the Ignored',description:'Den dolda boss som boken används för att kalla fram.'}],gold:'Se det som ett extra gruppmöte, inte en garanterad guldfarm.'});
const SECRET_EXTRA={
 'sleeping-bag':['plains','En upptäcktskedja låter dig följa en annan resenärs spår över världen. Belöningen gör vilan till en del av själva resandet.','Burned-Out Remains|Queststarten är ett föremål i världen, inte en vanlig questgivare.'],
 'duskwood-torch':['haunted','Night Watch skyddar Darkshire men lyckas inte rädda alla. En fallen vakt lämnar efter sig ett litet ljus som blir användbart långt bortom skogen.','Night Watch Guard|Den fallna vakt vars kropp erbjuder An Unfortunate End.'],
 'miner-johnson':['desert','Gruvarbetaren finns vid sidan av den stora berättelsen om Defias skepp. Han är ett valfritt möte, inte en egen dold questkedja.','Miner Johnson|Valfri rare enligt länkade dungeon-guider.']
};
for(const [id,[biome,lore,person]] of Object.entries(SECRET_EXTRA)){const g=GUIDES.find(g=>g.id===id);const [name,description]=person.split('|');Object.assign(g,{biome,lore:[lore],npcs:[{name,description}],gold:'Belöningen är framför allt nytta och upptäckarglädje. Räkna inte med garanterad försäljningsbar loot.'});}
for(const g of GUIDES){g.biome??=g.category==='gold'?'plains':'forest';g.gold??='Planera en kort runda och jämför materialvärde, avgifter och restid.';g.lore??=[g.intro];g.npcs??=[];g.related=GUIDES.filter(o=>o.id!==g.id&&(o.place===g.title||g.place===o.title||o.place===g.place&&['dungeons','secrets'].includes(o.category))).map(o=>o.id);}
