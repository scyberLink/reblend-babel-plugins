import { run } from "../testUtils";

test("Should transpile to Reblend hook in cjs", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
