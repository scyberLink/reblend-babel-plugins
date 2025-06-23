import { run } from "../testUtils";

test("Should clone reblend imports node", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
