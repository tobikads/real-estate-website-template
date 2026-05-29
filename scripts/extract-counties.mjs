import fs from 'fs';
import { geoMercator, geoPath, geoCentroid } from 'd3-geo';

const data = JSON.parse(fs.readFileSync('/tmp/ga-metro.json', 'utf8'));
const W = 1000, H = 1000;
const proj = geoMercator().fitSize([W, H], data);
const pathStr = geoPath(proj);

const counties = {};
for (const f of data.features) {
  const name = f.properties.NAME_KEY;
  const d = pathStr(f);
  // compute projected centroid for label
  const [cx, cy] = proj(geoCentroid(f));
  counties[name] = {
    d,
    cx: +cx.toFixed(1),
    cy: +cy.toFixed(1),
  };
}

fs.writeFileSync('/tmp/counties-out.json', JSON.stringify({ W, H, counties }));
console.log('wrote', Object.keys(counties).length, 'counties');
