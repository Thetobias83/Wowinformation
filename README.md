# WoW Forever · Äventyrsguiden

Svensk, mobilanpassad fanguide för World of Warcraft: Forever. Byggd med vanlig HTML, CSS och JavaScript utan byggsteg eller produktionsberoenden.

## Starta lokalt

Kör `python -m http.server 4173 --bind 127.0.0.1` från den här mappen och öppna `http://127.0.0.1:4173`.

## Innehåll och funktioner

- 12 zonöversikter med praktiska råd och fraktionsfilter.
- Deadmines, Wailing Caverns och Shadowfang Keep: bossgenomgångar, rare-möten och rollnotiser för tank, healer och DPS.
- Tre raidöversikter: Onyxia med förberedande Classic-taktik, samt Barrow Deeps och Hyjal Summit med allmänna förberedelser. Raidöppning anges som 9 december 2026. Fullständiga Forever-bossguider återstår efter verifiering vid öppningen.
- 12 yrkesintroduktioner, 4 ekonomiguider och 3 upptäcktsguider.
- Sökning över allt innehåll, fraktions- och nivåfilter, sparade guider, stegchecklistor, egna anteckningar och delbara guidelänkar.
- Favoriter och anteckningar lagras i localStorage, per webbläsare. Ingen server eller inloggning krävs.

`data.js` innehåller redaktionellt material och källor. `app.js` sköter navigation och interaktion. `style.css` innehåller mobil- och skrivbordslayout. Illustrationerna är egna SVG-filer eller SVG-former i koden. Google Fonts laddas externt med lokala typsnittsreserver.

## Innehållspolicy

Senaste redaktionella kontroll: 2026-11-22. Skilj på Forever, Classic Era, Season of Discovery och Retail. Raidmekaniker som inte är verifierade ska märkas tydligt. Tider är planeringsråd, inte garantier. Guldråd utlovar ingen fast avkastning. Miner Johnson beskrivs som valfritt rare-möte enligt länkade guider; framtida spawnändringar måste kontrolleras. Sleeping bag-guiden är en resöversikt med länk till alla mellansteg, inte en fullständig waypointlista.

## Kontrollera

Kör `node --test tests/content.test.cjs` för innehålls- och strukturella kontroller. Syntaxkontroll: `node --check app.js` och `node --check data.js`.

GitHub Actions publicerar den statiska sidan via GitHub Pages. I repots Settings → Pages, välj **GitHub Actions** som källa om Pages inte redan har aktiverats. Arbetsflödet måste lyckas innan sidan kan betraktas som publicerad.

World of Warcraft tillhör Blizzard Entertainment. Detta projekt är en oberoende fansida.
