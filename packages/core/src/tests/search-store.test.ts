import { describe, it, expect, vi } from "vitest";
import { SearchStore } from "../search-store";
import { MemoryNav } from "../nav";

describe("SearchStore", () => {
  it("subscribe notifica nas mudanças e unsubscribe para de notificar", () => {
    const nav = new MemoryNav();
    const store = new SearchStore(nav);

    const l1 = vi.fn();
    const l2 = vi.fn();

    const unsub1 = store.subscribe(l1);
    store.subscribe(l2);

    // 1ª mudança
    store.setSearch("a=1", false);
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);

    // remove l1
    unsub1();

    // 2ª mudança
    store.setSearch("a=2", false);
    expect(l1).toHaveBeenCalledTimes(1); // não aumentou
    expect(l2).toHaveBeenCalledTimes(2); // ainda ouvindo
  });

  it("não notifica se o search não mudou (idempotência)", () => {
    const nav = new MemoryNav();
    const store = new SearchStore(nav);

    const l = vi.fn();
    store.subscribe(l);

    store.setSearch("a=1", false);
    store.setSearch("a=1", true); // igual ao atual
    expect(l).toHaveBeenCalledTimes(1);
  });

  it("getSearch delega ao nav", () => {
    const nav = new MemoryNav();
    const store = new SearchStore(nav);
    expect(store.getSearch()).toBe("");

    store.setSearch("x=9", false);
    expect(store.getSearch()).toBe("x=9");
  });
});
