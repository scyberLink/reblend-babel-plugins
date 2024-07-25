import { run } from "../testUtils";

test("Should bind hooks to `this` and correctly expand object property assignment", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
