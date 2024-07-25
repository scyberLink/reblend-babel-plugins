import { run } from "../testUtils";

test("Should be able to map argument to this.props", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
