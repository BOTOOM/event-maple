const en = require("./messages/en.json");
const es = require("./messages/es.json");
const fr = require("./messages/fr.json");
const pt = require("./messages/pt.json");

function getKeys(obj, prefix) {
  prefix = prefix || "";
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? prefix + "." + key : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = new Set(getKeys(en));
const esKeys = new Set(getKeys(es));
const frKeys = new Set(getKeys(fr));
const ptKeys = new Set(getKeys(pt));

console.log("=== Missing in ES ===");
Array.from(enKeys).filter(k => !esKeys.has(k)).forEach(k => console.log(k));

console.log("\n=== Missing in FR ===");
Array.from(enKeys).filter(k => !frKeys.has(k)).forEach(k => console.log(k));

console.log("\n=== Missing in PT ===");
Array.from(enKeys).filter(k => !ptKeys.has(k)).forEach(k => console.log(k));

console.log("\n=== Summary ===");
console.log("EN keys:", enKeys.size);
console.log("ES keys:", esKeys.size, "- Missing:", Array.from(enKeys).filter(k => !esKeys.has(k)).length);
console.log("FR keys:", frKeys.size, "- Missing:", Array.from(enKeys).filter(k => !frKeys.has(k)).length);
console.log("PT keys:", ptKeys.size, "- Missing:", Array.from(enKeys).filter(k => !ptKeys.has(k)).length);
