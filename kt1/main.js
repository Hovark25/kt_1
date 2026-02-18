import fs from "fs/promises";
import { performance } from "perf_hooks";
import { Trie } from "./src/trie.js";
import { PQueue } from "./src/pqueue.js";
import { Manager } from "./src/manager.js";

async function readJson(path) {
  const s = await fs.readFile(path, "utf8");
  return JSON.parse(s);
}

async function buildTrie(dictPath) {
  const trie = new Trie();
  const data = await readJson(dictPath);

  if (Array.isArray(data)) {
    for (const w of data) trie.add(String(w), 1);
    return trie;
  }

  for (const [w, f] of Object.entries(data)) {
    trie.add(w, f);
  }

  return trie;
}

function runExample(trie, reqs) {
  const mgr = new Manager(trie, new PQueue());
  for (const r of reqs) {
    if (typeof r?.prefix === "string") {
      mgr.addRequest({ type: "autocomplete", prefix: r.prefix }, r.priority);
    } else if (typeof r?.delete === "string") {
      mgr.addRequest({ type: "delete", word: r.delete }, r.priority);
    }
  }
  mgr.run();
}

function bench(trie, n = 10000) {
  const mgr = new Manager(trie, new PQueue());
  const pref = ["a", "ap", "app", "b", "ba", "be", "bin", "bo"];

  for (let i = 0; i < n; i++) {
    const p = pref[i % pref.length];
    const pr = (i % 5 === 0) ? 1 : 0;
    mgr.addRequest({ type: "autocomplete", prefix: p }, pr);
  }

  const t0 = performance.now();
  mgr.run({ silent: true });
  const t1 = performance.now();

  console.log(`bench ${n}: ${(t1 - t0).toFixed(2)} ms`);
}

async function main() {
  const trie = await buildTrie("./data/dict.json");
  const reqs = await readJson("./data/requests.json");

  runExample(trie, reqs);

  if (process.argv.includes("--bench")) {
    bench(trie, 10000);
  }
}

main().catch(e => {
  console.error(e?.message || e);
  process.exit(1);
});
