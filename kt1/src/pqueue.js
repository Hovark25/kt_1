import { Heap } from "./heap.js";


export class PQueue {
  constructor() {
    this.seq = 0;

    this.h = new Heap((a, b) => {
      if (a.p !== b.p) return b.p - a.p;
      return a.s - b.s;
    });
  }

  push(item, priority = 0) {
    this.h.push({ item, p: Number(priority) || 0, s: this.seq++ });
  }

  pop() {
    const x = this.h.pop();
    return x ? x.item : null;
  }

  size() {
    return this.h.size();
  }
}
