import fs from 'fs';
import { geoMercator, geoPath, geoCentroid, geoBounds } from 'd3-geo';

const all = JSON.parse(fs.readFileSync('/tmp/us-counties.json','utf8'));
// Atlanta metro counties + GA state FIPS = 13
const want = {
  Gilmer:'13123', Pickens:'13227', Bartow:'13015', Cherokee:'13057',
  Forsyth:'13117', Hall:'13139', Paulding:'13223', Cobb:'13067',
  Fulton:'13121', DeKalb:'13089', Gwinnett:'13135', Walton:'13297',
  Douglas:'13097', Clayton:'13063', Fayette:'13113', Henry:'13151',
  Rockdale:'13247'
};
const byFips = {};
for (const f of all.features) byFips[f.properties.GEO_ID?.slice(-5) ?? f.id] = f;
// plotly file uses `id` as 5-digit fips
const feats = {};
for (const [name,fips] of Object.entries(want)) {
  const f = all.features.find(x => x.id === fips);
  if (!f) { console.error('missing',name,fips); continue; }
  feats[name] = f;
}
const fc = { type:'FeatureCollection', features: Object.values(feats) };
const W=1000, H=1000;
const proj = geoMercator().fitSize([W,H], fc);
const path = geoPath(proj);
const out = {};
for (const [name,f] of Object.entries(feats)) {
  const d = path(f);
  const [cx,cy] = path.centroid(f);
  out[name] = { d, cx, cy };
}
// Need bounds too for normalizing? fitSize handled it.
fs.writeFileSync('/tmp/counties-out.json', JSON.stringify({W,H,counties:out}, null, 2));
console.log('wrote', Object.keys(out).length, 'counties');
