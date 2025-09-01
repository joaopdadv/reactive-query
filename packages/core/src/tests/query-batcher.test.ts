import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryBatcher } from "../query-batcher";
import { Nav } from "../nav";

class SpyNav implements Nav {
  search = "";
  calls: Array<{ search: string; replace: boolean }> = [];
  getSearch() {
    return this.search;
  }
  setSearch(s: string, replace: boolean) {
    this.search = s;
    this.calls.push({ search: s, replace });
  }
}

describe("QueryBatcher", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("coalesce: múltiplos enqueue viram uma navegação após o debounce", () => {
    const nav = new SpyNav();
    const b = new QueryBatcher(nav);
    b.setDelay(10);

    b.enqueue("a", "1", true);
    b.enqueue("b", "2", true);
    expect(nav.calls.length).toBe(0); // nada antes do flush automático

    vi.advanceTimersByTime(10);
    expect(nav.calls.length).toBe(1);

    const params = new URLSearchParams(nav.search);
    expect(params.get("a")).toBe("1");
    expect(params.get("b")).toBe("2");
    expect(nav.calls[0].replace).toBe(true);
  });

  it("última escrita do mesmo key vence", () => {
    const nav = new SpyNav();
    const b = new QueryBatcher(nav);
    b.setDelay(5);

    b.enqueue("a", "1", true);
    b.enqueue("a", "2", true);

    vi.advanceTimersByTime(5);
    const params = new URLSearchParams(nav.search);
    expect(params.get("a")).toBe("2");
    expect(nav.calls.length).toBe(1);
  });

  it("value null/undefined deleta a chave", () => {
    const nav = new SpyNav();
    nav.search = "a=1&b=2";
    const b = new QueryBatcher(nav);
    b.setDelay(0);

    b.enqueue("a", null, true);
    vi.runAllTimers();

    const params = new URLSearchParams(nav.search);
    expect(params.get("a")).toBeNull();
    expect(params.get("b")).toBe("2");
  });

  it("replaceOnly vira false se qualquer enqueue pedir push", () => {
    const nav = new SpyNav();
    const b = new QueryBatcher(nav);
    b.setDelay(0);

    b.enqueue("a", "1", true); // replace
    b.enqueue("b", "2", false); // push
    vi.runAllTimers();

    expect(nav.calls.length).toBe(1);
    expect(nav.calls[0].replace).toBe(false);
  });

  it("flush manual aplica imediato e limpa fila; flush duplo é no-op", () => {
    const nav = new SpyNav();
    const b = new QueryBatcher(nav);
    b.setDelay(1000);

    b.enqueue("a", "1", true);
    expect(nav.calls.length).toBe(0);

    b.flush();
    expect(nav.calls.length).toBe(1);

    // sem novas entradas
    b.flush();
    expect(nav.calls.length).toBe(1);
  });

  it("não chama setSearch antes do flush", () => {
    const nav = new SpyNav();
    const b = new QueryBatcher(nav);
    b.setDelay(50);

    b.enqueue("x", "1", true);
    expect(nav.calls.length).toBe(0);

    vi.advanceTimersByTime(49);
    expect(nav.calls.length).toBe(0);

    vi.advanceTimersByTime(1);
    expect(nav.calls.length).toBe(1);
  });
});
