import { run } from "../testUtils";

test("Should transpile to Reblend hook", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
