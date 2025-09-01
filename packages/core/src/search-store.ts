import { Nav } from "./nav";

export class SearchStore {
  constructor(private readonly nav: Nav) {}

  private readonly listeners = new Set<() => void>();

  subscribe(l: () => void) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  setSearch(s: string, replace: boolean) {
    if (s === this.getSearch()) return; // idempotência

    this.nav.setSearch(s, replace);
    for (const l of this.listeners) l(); // disparar mudança para os listeners
  }

  getSearch(): string {
    return this.nav.getSearch();
  }
}
