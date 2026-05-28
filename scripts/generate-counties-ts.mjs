import fs from 'fs';
const { W, H, counties } = JSON.parse(fs.readFileSync('/tmp/counties-out.json','utf8'));

// Existing neighborhoods (must match listings.tsx NEIGHBORHOODS_BY_COUNTY)
const NB = {
  Fulton: ["Buckhead","Midtown","Sandy Springs","Alpharetta","Roswell","Atlanta","East Point"],
  DeKalb: ["Dunwoody","Brookhaven","Chamblee","Tucker","Decatur","Stone Mountain"],
  Cobb: ["Acworth","Kennesaw","Marietta","Smyrna","Powder Springs"],
  Gwinnett: ["Buford","Suwanee","Lawrenceville","Duluth","Peachtree Corners","Norcross"],
  Cherokee: ["Canton","Woodstock","Holly Springs"],
  Forsyth: ["Cumming","Vickery"],
  Hall: ["Gainesville","Flowery Branch"],
  Henry: ["Stockbridge","McDonough","Hampton"],
  Clayton: ["College Park","Forest Park","Riverdale","Jonesboro"],
  Fayette: ["Tyrone","Fayetteville","Peachtree City"],
  Douglas: ["Douglasville","Lithia Springs"],
  Paulding: ["Dallas","Hiram"],
  Rockdale: ["Conyers"],
  Walton: ["Monroe","Loganville"],
  Bartow: ["Cartersville","Adairsville"],
  Pickens: ["Jasper"],
  Gilmer: ["Ellijay"],
  Dawson: ["Dawsonville"],
  Coweta: ["Newnan"],
};


// distribute neighborhoods around county centroid
function neighborhoodCoords(n, cx, cy) {
  if (n.length === 1) return [{x:cx, y:cy}];
  const r = 28; // pixel radius spread
  return n.map((_, i) => {
    const a = (i / n.length) * Math.PI * 2 - Math.PI/2;
    return { x: cx + Math.cos(a)*r, y: cy + Math.sin(a)*r };
  });
}

const order = ["Gilmer","Pickens","Bartow","Cherokee","Forsyth","Hall","Paulding","Cobb","Fulton","Gwinnett","Walton","DeKalb","Rockdale","Douglas","Clayton","Henry","Fayette"];

let ts = `// AUTO-GENERATED from scripts/extract-counties.mjs + generate-counties-ts.mjs
// Real Atlanta metro county boundaries (US Census 2020) projected to a
// ${W}x${H} SVG viewBox via d3-geo Mercator fitSize.

export const MAP_W = ${W};
export const MAP_H = ${H};

export type CountyShape = {
  name: string;
  d: string;
  label: [number, number];
  neighborhoods: Array<{ name: string; x: number; y: number }>;
};

export const COUNTY_SHAPES: CountyShape[] = [
`;

for (const name of order) {
  const c = counties[name];
  if (!c) continue;
  const ns = NB[name] || [];
  const coords = neighborhoodCoords(ns, c.cx, c.cy);
  const nbStr = ns.map((n,i) => `    { name: ${JSON.stringify(n)}, x: ${coords[i].x.toFixed(1)}, y: ${coords[i].y.toFixed(1)} }`).join(',\n');
  ts += `  {
    name: ${JSON.stringify(name)},
    d: ${JSON.stringify(c.d)},
    label: [${c.cx.toFixed(1)}, ${c.cy.toFixed(1)}],
    neighborhoods: [
${nbStr}
    ],
  },
`;
}
ts += '];\n';

fs.writeFileSync('src/data/atlanta-counties.ts', ts);
console.log('wrote src/data/atlanta-counties.ts');
