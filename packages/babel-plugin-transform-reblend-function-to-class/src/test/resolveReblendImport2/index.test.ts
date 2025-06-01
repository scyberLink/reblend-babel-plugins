import { run } from "../testUtils";

test("Should be able to transpile resolving the import variable name", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
