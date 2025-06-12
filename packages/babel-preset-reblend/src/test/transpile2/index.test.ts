import { run } from "../testUtils";

test("Should transpile to Reblend hook in cjs and avoid helper initialization and CommonJS hoisting issue", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
