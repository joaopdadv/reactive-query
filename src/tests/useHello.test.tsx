import { renderHook } from "@testing-library/react";
import { useHello } from "..";

test("useHello retorna a saudação certa", () => {
  const { result } = renderHook(() => useHello("joaopdadv"));
  expect(result.current).toBe("Olá, joaopdadv!");
});
