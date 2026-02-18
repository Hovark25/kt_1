export class Heap {
  constructor(cmp) {
    if (typeof cmp !== "function") throw new TypeError("cmp must be a function");
    this.a = [];
    this.cmp = cmp;
  }

  size() {
    return this.a.length;
  }

  peek() {
    return this.a[0] ?? null;
  }

  push(x) {
    this.a.push(x);
    this.#up(this.a.length - 1);
  }

  pop() {
    if (!this.a.length) return null;
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      this.#down(0);
    }
    return top;
  }

  #up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmp(this.a[i], this.a[p]) < 0) {
        [this.a[i], this.a[p]] = [this.a[p], this.a[i]];
        i = p;
      } else break;
    }
  }

  #down(i) {
    for (;;) {
      const l = i * 2 + 1;
      const r = l + 1;
      let best = i;

      if (l < this.a.length && this.cmp(this.a[l], this.a[best]) < 0) best = l;
      if (r < this.a.length && this.cmp(this.a[r], this.a[best]) < 0) best = r;

      if (best !== i) {
        [this.a[i], this.a[best]] = [this.a[best], this.a[i]];
        i = best;
      } else break;
    }
  }
}
