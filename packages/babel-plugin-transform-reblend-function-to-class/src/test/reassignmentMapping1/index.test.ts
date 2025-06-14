import { run } from "../testUtils";

test("Should be able to map props argument or state variable when reassing 1", () => {
  expect(() => run(__dirname)).toThrow(/Reblend does not support multiple props parameter's for components/);
});
