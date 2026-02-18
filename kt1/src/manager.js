export class Manager {
  constructor(trie, queue) {
    this.trie = trie;
    this.q = queue;
  }

  addRequest(req, priority) {
    this.q.push(req, priority);
  }

  run({ silent = false } = {}) {
    while (this.q.size() > 0) {
      const req = this.q.pop();
      if (!req) continue;

      if (req.type === "delete") {
        const ok = this.trie.remove(req.word);
        if (!silent) console.log(`delete "${req.word}": ${ok ? "ok" : "not found"}`);
        continue;
      }

      const res = this.trie.suggest(req.prefix ?? "", 5);
      if (!silent) {
        console.log(`prefix "${req.prefix}": [${res.map(s => `"${s}"`).join(", ")}]`);
      }
    }
  }
}
