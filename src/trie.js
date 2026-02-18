import { Heap } from "./heap.js";

export class Node {
  constructor() {
    this.next = new Map();
    this.end = false;
    this.freq = 0;
  }
}

export class Trie {
  constructor() {
    this.root = new Node();
  }

  add(word, freq = 1) {
    if (typeof word !== "string" || !word) return;
    let n = this.root;
    for (const ch of word) {
      if (!n.next.has(ch)) n.next.set(ch, new Node());
      n = n.next.get(ch);
    }
    n.end = true;
    n.freq += Number(freq) || 0;
  }

  has(word) {
    if (typeof word !== "string" || !word) return false;
    let n = this.root;
    for (const ch of word) {
      n = n.next.get(ch);
      if (!n) return false;
    }
    return n.end === true;
  }

  suggest(prefix, k = 5) {
    if (typeof prefix !== "string") return [];
    let n = this.root;

    for (const ch of prefix) {
      n = n.next.get(ch);
      if (!n) return [];
    }

    const worseFirst = (a, b) => {
      if (a.f !== b.f) return a.f - b.f;
      return b.w.localeCompare(a.w);
    };

    const top = new Heap(worseFirst);

    const take = (w, f) => {
      const item = { w, f };

      if (top.size() < k) {
        top.push(item);
        return;
      }

      const worst = top.peek();
      const better = f > worst.f || (f === worst.f && w.localeCompare(worst.w) < 0);

      if (better) {
        top.pop();
        top.push(item);
      }
    };

    const stack = [{ node: n, w: prefix }];

    while (stack.length) {
      const cur = stack.pop();

      if (cur.node.end) take(cur.w, cur.node.freq);

      for (const [ch, child] of cur.node.next) {
        stack.push({ node: child, w: cur.w + ch });
      }
    }

    const out = [];
    while (top.size()) out.push(top.pop());

    out.sort((a, b) => (b.f - a.f) || a.w.localeCompare(b.w));
    return out.map(x => x.w);
  }

  remove(word) {
    if (typeof word !== "string" || !word) return false;

    const path = [];
    let n = this.root;

    for (const ch of word) {
      const nx = n.next.get(ch);
      if (!nx) return false;
      path.push([n, ch]);
      n = nx;
    }

    if (!n.end) return false;

    n.end = false;
    n.freq = 0;

    for (let i = path.length - 1; i >= 0; i--) {
      const [p, ch] = path[i];
      const child = p.next.get(ch);
      if (child.end || child.next.size) break;
      p.next.delete(ch);
    }

    return true;
  }
}

