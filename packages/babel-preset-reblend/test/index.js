import _reblendPreset from "../lib/index.js";
const reblendPreset = _reblendPreset.default || _reblendPreset;

import { itBabel8 } from "$repo-utils";

describe("reblend preset", () => {
  it("does throw clear error when no options passed for Babel 6", () => {
    expect(() => {
      reblendPreset({ version: "6.5.0" });
    }).toThrow(Error, /Requires Babel "\^7.0.0-0"/);
  });
  itBabel8("throws when unknown option is passed", () => {
    expect(() => {
      reblendPreset({ assertVersion() {} }, { runtine: true });
    }).toThrowErrorMatchingInlineSnapshot(`
        "@babel/preset-reblend: 'runtine' is not a valid top-level option.
        - Did you mean 'runtime'?"
      `);
  });
  itBabel8("throws when option is of incorrect type", () => {
    expect(() => {
      reblendPreset({ assertVersion() {} }, { runtime: true });
    }).toThrowErrorMatchingInlineSnapshot(
      `"@babel/preset-reblend: 'runtime' option must be a string."`,
    );
  });
});
