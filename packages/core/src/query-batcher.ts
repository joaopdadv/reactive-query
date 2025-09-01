import { Nav } from "./nav";

export class QueryBatcher {
  constructor(private readonly nav: Nav) {}

  private timer: ReturnType<typeof setTimeout> | null = null;
  private queue = new Map<
    string,
    { key: string; value: string | null | undefined }
  >();
  private replaceOnly = true;
  private delay = 20;

  setDelay(ms: number) {
    this.delay = ms;
  }

  enqueue(key: string, value: string | null | undefined, replace: boolean) {
    this.queue.set(key, { key, value });
    this.replaceOnly = this.replaceOnly && replace;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), this.delay);
  }

  flush() {
    if (this.queue.size === 0) return;
    const params = new URLSearchParams(this.nav.getSearch());
    for (const { key, value } of this.queue.values()) {
      if (value == null) params.delete(key);
      else params.set(key, value);
    }
    this.queue.clear();
    const search = params.toString();
    const replace = this.replaceOnly;
    this.replaceOnly = true;
    this.timer && clearTimeout(this.timer);
    this.timer = null;
    this.nav.setSearch(search, replace);
  }
}
