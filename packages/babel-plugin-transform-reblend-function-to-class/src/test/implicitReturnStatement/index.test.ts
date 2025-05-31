import { run } from "../testUtils";

test("Should transpile to Reblend class without explicit return statement", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
