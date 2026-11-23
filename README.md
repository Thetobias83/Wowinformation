# WoW Forever · Äventyrsguiden

Svensk, mobilanpassad fanguide för World of Warcraft: Forever. Byggd med vanlig HTML, CSS och JavaScript utan byggsteg eller produktionsberoenden.

## Starta lokalt

Kör `python -m http.server 4173 --bind 127.0.0.1` från den här mappen och öppna `http://127.0.0.1:4173`.

## Områdessidor och flikar

Varje område, dungeon och raid har en egen sida med ett miljöanpassat tema och en egen stiliserad SVG-scen. Färger, vegetation, byggnader och landskap följer områdets miljö: exempelvis snö, djungel, pestmarker, kust, öken eller arkanmagi.

Flikarna har delbara adresser: `#guide/duskwood/lore`, `#guide/deadmines/bosses` och `#guide/mining/leveling`. De tidigare adresserna `#guide/deadmines` fungerar fortfarande. Guide-ID:n och befintliga localStorage-nycklar har behållits.

## Innehåll och funktioner

- 44 utomhusområden: klassiska levelingzoner, rese-/klassnav och de fyra nya Forever-regionerna. Egna loretexter, viktiga personer, tips och relaterade guider.
- Samtliga 35 aktuella dungeonvingar, inklusive nio nya Forever-dungeons. Korta boss-, rare- och questmötesnotiser för tank, healer och DPS. Vingarna i Scarlet Monastery, Dire Maul, Stratholme och Blackrock Spire är separata sidor.
- Tre raidöversikter: Onyxia med förberedande Classic-taktik, samt Barrow Deeps och Hyjal Summit med allmänna förberedelser. Raidöppning anges som 9 december 2026. Fullständiga Forever-bossguider återstår efter verifiering vid öppningen.
- Alla 12 yrken med material, yrkeskombinationer, fyra progressionsetapper mot 300, lägerfunktioner och ekonomiråd. Etapperna är planeringsstöd; exakta recept och materialantal finns i länkade guider.
- 4 ekonomiguider och 12 upptäcktsguider, inklusive de tidigare sleeping bag-, fackel- och Miner Johnson-sidorna samt Tome of Dalaran, Scarlet Banner, biblioteksböcker, Malignant Root Alcaz-förklädnaden och Ta’shkal.
- Sökning över allt innehåll inklusive lore och NPC:er, fraktions- och nivåfilter, sortering, sparade guider, checklistor, egna områdes- och bossanteckningar samt delbara fliklänkar.
- Favoriter och anteckningar lagras i localStorage, per webbläsare. Ingen server eller inloggning krävs.

`data.js` behåller ursprungligt innehåll och ID:n. `world.js`, `professions.js`, `dungeons.js` och `details.js` utökar katalogen. `research.js` lägger till områdesspecifik utforskning, extra miljölore och fem källbaserade hemligheter. Alla 44 områden, 35 dungeonvingar och tre raidöversikter har fliken Utforska. Sekvensbilderna visar pusselordning, inte geografiska kartor. `scenes.js` ritar områdesmiljöer, `app.js` sköter navigation och `areas.css` lägger till sidornas teman. Google Fonts laddas externt med lokala typsnittsreserver.

## Innehållspolicy

Senaste redaktionella kontroll: 2026-11-22. Skilj på Forever, Classic Era, Season of Discovery och Retail. Raidmekaniker som inte är verifierade ska märkas tydligt. Tider är planeringsråd, inte garantier. Guldråd utlovar ingen fast avkastning. Miner Johnson beskrivs som valfritt rare-möte enligt länkade guider; framtida spawnändringar måste kontrolleras. Sleeping bag-guiden är en resöversikt med länk till alla mellansteg, inte en fullständig waypointlista.

## Kontrollera

Kör `node --test tests/content.test.cjs tests/render.test.cjs`. Testerna kontrollerar hela dungeonlistan, alla yrken, lore/NPC/tema för områdena, datalänkar, rollnotiser och rendering av samtliga flikar. Browserkontroller behövs dessutom för visuell layout och lagring. Kontrollera JavaScript-filer med `node --check`.

GitHub Actions publicerar den statiska sidan via GitHub Pages. I repots Settings → Pages, välj **GitHub Actions** som källa om Pages inte redan har aktiverats. Arbetsflödet måste lyckas innan sidan kan betraktas som publicerad.

World of Warcraft tillhör Blizzard Entertainment. Detta projekt är en oberoende fansida.

## Wiki-fördjupningar och attribution

`lore.js` och `lore-more.js` innehåller tillsammans 24 svenska kapitel med bakgrund, centrala personer och kopplingar mellan områden. Kapitlen är sammanfattningar och bearbetningar av namngivna Warcraft Wiki-artiklar och delas under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Varje kapitel i lorefliken anger källartikel, bidragsgivare via revisionshistorik och hur texten ändrats. Licensangivelsen omfattar kapiteltexterna och är ingen generell omlicensiering av repots kod, tidigare texter eller Blizzard-material.

Bakgrunden är historisk. Wiki-artiklarnas Retail-nivåer, senare bossuppsättningar och expansionshändelser importeras inte som Forever-fakta. Fördjupningarna ligger i expanderbara avsnitt med spoilermarkering. Bilder från wikin har inte kopierats; deras respektive fillicenser måste kontrolleras separat.


Den andra loreutbyggnaden lägger till Blackfathom, båda Razorfen-instanserna, Maraudon, Duskwoods lie, världsträden, Zul’Farrak, Durotars grundande och Mulgore. Tre nya upptäcktssidor ger startöversikter för Cortellos gåta, Linkens äventyr och Pamela i Darrowshire. De är uttryckligen Classic-underlag där Forevers aktuella detaljer inte verifierats; de är inte fullständiga genomgångar av alla senare queststeg.


## Dungeons: rutt, smarta val och områdeskoppling

`dungeon-runs.js` bygger ut åtta tidiga instanser: Ragefire Chasm, Hall of Thanes, Ruins of Lordaeron, Deadmines, Wailing Caverns, Shadowfang Keep, Blackfathom Deeps och Stockade. Varje guide har en plan i tre delar och tre konkreta tips med situation, åtgärd och förklaring. Översikten förklarar kopplingen till zonens berättelse och länkar till mer lore. Stockade ligger uttryckligen i Stormwind; Elwynn-länken ger omgivningens sammanhang. Tolv namngivna bossmöten har dessutom fått tydligare tips eller rollnotiser.

Ruttfaserna är orientering, inte geometriska kartor eller en garanti för exakt bossordning. Praktiska gruppråd hålls åtskilda från källornas mekaniker. Bossarnas ordning och anteckningsnycklar bevaras.


## Guld, roller, klasser och räknehjälp (23 november 2026)

`player-guides.js` lägger till sju praktiska guldguider (totalt elva), fyra rollguider och nio klassguider. Guldguiderna har förutsättningar, konkreta startalternativ, arbetssteg, säljstrategi och kriterier för när man byter metod. Stats beskrivs per roll/build som orientering, inte en universell rangordning. Källornas exakta hit-tal skiljer sig; inga osäkra cap-värden eller universella statsvikter förinställs.

`calculators.js` innehåller tre lokala räknehjälper: rundans netto och guld/timme, viktad jämförelse A/B med egna vikter samt skillnad till ett eget träffbonusmål. Formler, enheter och begränsningar står vid verktygen. Prisdata, karaktärer och simulatorresultat hämtas inte live. Osålt lager räknas inte som intäkt. Viktningspoäng är inte DPS/HPS och saknar exempelvis procs och cap-logik. `player-ui.js` visar guiderna. Egna beräkningar sparas inte permanent.

Kalkyltester omfattar negativa och ogiltiga värden, nolltid, netto efter kostnader, egen statsviktning samt målunderskott/överskott. Samtliga nya flikar ingår också i renderingskontrollen.
