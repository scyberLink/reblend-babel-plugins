import { run } from "../testUtils";

test("Should handle typescript undefined suppression syntax", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
