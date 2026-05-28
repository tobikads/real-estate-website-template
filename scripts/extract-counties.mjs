import fs from 'fs';
import { geoMercator, geoPath } from 'd3-geo';

const data = JSON.parse(fs.readFileSync('/tmp/ga-counties.json','utf8'));
const want = {
  Gilmer:'13123', Pickens:'13227', Bartow:'13015', Cherokee:'13057',
  Forsyth:'13117', Hall:'13139', Paulding:'13223', Cobb:'13067',
  Fulton:'13121', DeKalb:'13089', Gwinnett:'13135', Walton:'13297',
  Douglas:'13097', Clayton:'13063', Fayette:'13113', Henry:'13151',
  Rockdale:'13247', Dawson:'13085', Coweta:'13077',
};
const feats = {};
for (const [name,fips] of Object.entries(want)) {
  const f = data.features.find(x => x.properties.GEOID === fips);
  if (!f) { console.error('missing',name,fips); continue; }
  feats[name] = f;
}
const fc = { type:'FeatureCollection', features: Object.values(feats) };
const W=1000, H=1000;
const proj = geoMercator().fitSize([W,H], fc);
const path = geoPath(proj).digits(2);
const out = {};
for (const [name,f] of Object.entries(feats)) {
  out[name] = { d: path(f), cx: +path.centroid(f)[0].toFixed(1), cy: +path.centroid(f)[1].toFixed(1) };
}
fs.writeFileSync('/tmp/counties-out.json', JSON.stringify({W,H,counties:out}));
console.log('wrote', Object.keys(out).length);
