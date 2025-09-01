import { describe, it, expect } from "vitest";
import { MemoryNav } from "../nav";

describe("MemoryNav", () => {
  it("retorna vazio por padrão", () => {
    const nav = new MemoryNav();
    expect(nav.getSearch()).toBe("");
  });

  it("seta e lê o search", () => {
    const nav = new MemoryNav();
    nav.setSearch("a=1", false);
    expect(nav.getSearch()).toBe("a=1");

    nav.setSearch("b=2", true);
    expect(nav.getSearch()).toBe("b=2");
  });
});
