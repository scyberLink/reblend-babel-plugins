import { run } from "../testUtils";

test("Should be able to map array desctructured declarations arrow function", () => {
  expect(() => run(__dirname)).toThrow(/Reblend does not support multiple props parameter's for components/);
});
