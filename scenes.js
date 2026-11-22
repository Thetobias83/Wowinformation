function themeFor(g){return THEME_PALETTES[g.biome]||THEME_PALETTES.forest;}
function scene(g){
 const [light,mid,dark]=themeFor(g);const seed=[...g.id].reduce((n,c)=>n*31+c.charCodeAt(0),7)>>>0;
 const rand=n=>((seed+n*7919)%997)/997;const biome=g.biome||'forest';let shapes='';
 const pine=(x,y,h)=>`<path d="M${x-3} ${y}v-${h*.85}h6V${y}zm${-h*.3} ${-h*.24} ${h*.3}-${h*.76} ${h*.3} ${h*.76}h-${h*.15}l${h*.2} ${h*.24}h-${h*.7}l${h*.2}-${h*.24}z"/>`;
 const tree=(x,y,h)=>`<path d="M${x-4} ${y}v-${h*.6}h8V${y}z"/><ellipse cx="${x}" cy="${y-h*.68}" rx="${h*.31}" ry="${h*.4}"/>`;
 const tower=(x,y,h)=>`<path d="M${x-h*.2} ${y}v-${h*.8}l${h*.2}-${h*.2} ${h*.2} ${h*.2}v${h*.8}h-${h*.13}v-${h*.25}h-${h*.14}V${y}z"/>`;
 if(['forest','snow','enchanted','plague','haunted','marsh','jungle'].includes(biome)){
  for(let i=0;i<11;i++){let x=370+i*69+rand(i)*24,y=330+rand(i+18)*80,h=75+rand(i+33)*170;shapes+=(['jungle','marsh'].includes(biome)?tree(x,y,h):pine(x,y,h));}
 }
 if(['haunted','plague'].includes(biome))shapes+=tower(745,356,133)+tower(815,356,195)+'<path d="M700 356v-58h165v58z"/>';
 if(biome==='desert')for(let i=0;i<7;i++){const x=410+i*90,h=60+rand(i)*160;shapes+=`<path d="m${x} 380 10-${h} 46-8 20 ${h+8}z"/>`;}
 if(biome==='plains'){shapes+=tower(820,365,135)+'<path d="m670 370 35-55 35 55zm14-8v-37h27v37z"/>';for(let i=0;i<4;i++)shapes+=tree(420+i*145,385,50+rand(i)*70);}
 if(biome==='coast'){shapes+='<path d="M580 308h340v12H580zm90-4 40-74 37 74zm80 0 47-95 52 95z" opacity=".5"/>';shapes+=tower(900,360,170)+'<path d="m850 375 70-53 78 53z"/>';}
 if(biome==='lava')shapes+='<path d="M490 420 660 121 800 420zm115-207 55-92 44 83-26-10-19 28-27-17z"/><path d="M730 420V245h35v-35h24v35h40v175zm110 0V178h26v-32h24v32h40v242z"/>';
 if(['sky','arcane'].includes(biome)){shapes+='<path d="m480 300 110-27 180 23-60 27-54 71-31-54-64-13z"/>';shapes+=tower(575,290,160)+tower(665,295,225)+tower(735,295,115);}
 if(g.category==='dungeons')shapes+='<path d="M925 420V255q60-118 120 0v165h-30V270q-31-62-60 0v150z"/>';
 if(g.category==='raids')shapes+='<path d="m795 190 50-33 51 22 37-30 26 3-14 17-27 5-16 26-28 2-24 23-10-6 13-24-28-1-29 20zm62-9-55-72 45 20 35 40 66-53-16 54-48 20z"/>';
 return `<svg class="scene scene-${biome}" viewBox="0 0 1100 430" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sky-${g.id}" x2="0" y2="1"><stop stop-color="${mid}"/><stop offset="1" stop-color="${light}"/></linearGradient></defs><path fill="url(#sky-${g.id})" d="M0 0h1100v430H0z"/><circle cx="${740+rand(2)*180}" cy="${65+rand(8)*50}" r="${35+rand(4)*30}" fill="${light}" opacity=".65"/><path d="m0 325 120-84 100 34 133-111 120 100 140-137 151 147 99-105 137 109v152H0z" fill="${mid}" opacity=".65"/><path d="m0 365 160-56 143 40 150-85 170 76 139-98 137 83 201-52v157H0z" fill="${dark}" opacity=".38"/><g fill="${dark}">${shapes}</g><path d="M0 395q240-40 430 1t670-19v53H0" fill="${dark}"/><path d="m450 430 110-48 110-11 74-30-52 34-116 20-65 35" fill="${light}" opacity=".32"/>${biome==='snow'?'<path d="m470 264 143-137 32 32-31-9-33 34-8-3z" fill="#dae5ec" opacity=".7"/>':''}${biome==='lava'?'<path d="m580 430 88-157 12 68-21-15-28 104" fill="#eea15d" opacity=".65"/>':''}</svg>`;
}
