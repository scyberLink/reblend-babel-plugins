import { run } from "../testUtils";

test("Should not remove reblend import statement", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
