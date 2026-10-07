import fs from "node:fs";
import assert from "node:assert/strict";
const d = JSON.parse(
  fs.readFileSync(new URL("../projects.json", import.meta.url), "utf8"),
);
assert.equal(d.schemaVersion, 1);
assert.ok(Array.isArray(d.projects) && d.projects.length <= 30);
const urls = new Set();
for (const p of d.projects) {
  const u = new URL(p.repoUrl);
  assert.ok(
    u.protocol === "https:" &&
      u.hostname === "github.com" &&
      !u.username &&
      !u.password &&
      !u.search &&
      !u.hash &&
      /^\/[\w.-]+\/[\w.-]+\/?$/.test(u.pathname),
  );
  const key = u.href.toLowerCase().replace(/\/$/, "");
  assert.ok(!urls.has(key));
  urls.add(key);
  if (p.commit !== undefined) assert.match(p.commit, /^[a-f0-9]{40}$/);
}
const t = JSON.parse(
  fs.readFileSync(
    new URL("../template/matas-project.json", import.meta.url),
    "utf8",
  ),
);
assert.equal(t.schemaVersion, 2);
assert.equal(t.materialsCostUah, undefined);
assert.ok(Array.isArray(t.electronics) && t.electronics.length <= 100);
assert.equal(
  new Set(t.electronics.map((r) => r.itemId)).size,
  t.electronics.length,
);
for (const row of t.electronics) {
  assert.ok(typeof row.itemId === "string" && row.itemId.trim());
  assert.ok(Number.isSafeInteger(row.quantity) && row.quantity > 0);
}
assert.ok(Array.isArray(t.skills) && Array.isArray(t.instructions));
assert.equal(typeof t.team, "boolean");
assert.match(t.photo, /^[\w./-]+\.(png|jpe?g|webp|svg)$/i);
assert.ok(!t.photo.split("/").includes(".."));
assert.ok(fs.existsSync(new URL("../template/" + t.photo, import.meta.url)));
console.log(
  `PASS: ${d.projects.length} repository links; template image present`,
);
