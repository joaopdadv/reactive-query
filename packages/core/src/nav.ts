export interface Nav {
  getSearch(): string;
  setSearch(search: string, replace: boolean): void;
}

export class MemoryNav implements Nav {
  private history: string[] = [];
  private currentIndex: number = -1;
  private search: string = "";

  getSearch() {
    return this.search;
  }
  setSearch(s: string, replace: boolean) {
    s = this.canon(s);
    if (s === this.search) return;
    if (replace) {
      this.replace(s);
    } else {
      this.push(s);
    }
  }

  private replace(s: string) {
    if (this.currentIndex >= 0) {
      this.history[this.currentIndex] = s;
    } else {
      this.history.push(s);
      this.currentIndex++;
    }
    this.search = s;
  }

  private push(s: string) {
    this.history.push(s);
    this.currentIndex++;
    this.search = s;
  }

  private canon(s: string) {
    return s.startsWith("?") ? s.slice(1) : s;
  }
}
