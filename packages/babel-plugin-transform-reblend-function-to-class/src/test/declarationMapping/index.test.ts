import { run } from "../testUtils";

test("Should be able to map declarations to this.declarations", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
