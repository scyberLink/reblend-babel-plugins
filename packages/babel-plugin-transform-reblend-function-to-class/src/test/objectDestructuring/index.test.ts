import { run } from "../testUtils";

test("Should be able to map object destructured declarations to the class", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
