"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = normalizeOptions;
const helper_validator_option_1 = require("@babel/helper-validator-option");
const v = new helper_validator_option_1.OptionValidator('babel-preset-reblend');
function normalizeOptions(options = {}) {
    if (process.env.BABEL_8_BREAKING) {
        if ('useSpread' in options) {
            throw new Error('babel-preset-reblend: Since Babel 8, an inline object with spread elements is always used, and the "useSpread" option is no longer available. Please remove it from your config.');
        }
        if ('useBuiltIns' in options) {
            const useBuiltInsFormatted = JSON.stringify(options.useBuiltIns);
            throw new Error(`babel-preset-reblend: Since "useBuiltIns" is removed in Babel 8, you can remove it from the config.
- Babel 8 now transforms JSX spread to object spread. If you need to transpile object spread with
\`useBuiltIns: ${useBuiltInsFormatted}\`, you can use the following config
{
  "plugins": [
    ["@babel/plugin-transform-object-rest-spread", { "loose": true, "useBuiltIns": ${useBuiltInsFormatted} }]
  ],
  "presets": ["babel-preset-reblend"]
}`);
        }
        const TopLevelOptions = {
            includeTypescript: true,
            development: 'development',
            importSource: 'importSource',
            pragma: 'pragma',
            pragmaFrag: 'pragmaFrag',
            pure: 'pure',
            runtime: 'runtime',
            throwIfNamespace: 'throwIfNamespace',
        };
        v.validateTopLevelOptions(options, TopLevelOptions);
        const includeTypescript = v.validateBooleanOption(TopLevelOptions.includeTypescript, options.includeTypescript, false);
        const development = v.validateBooleanOption(TopLevelOptions.development, options.development, false);
        let importSource = v.validateStringOption(TopLevelOptions.importSource, options.importSource);
        let pragma = v.validateStringOption(TopLevelOptions.pragma, options.pragma);
        let pragmaFrag = v.validateStringOption(TopLevelOptions.pragmaFrag, options.pragmaFrag);
        const pure = v.validateBooleanOption(TopLevelOptions.pure, options.pure);
        const runtime = v.validateStringOption(TopLevelOptions.runtime, options.runtime, 'automatic');
        const throwIfNamespace = v.validateBooleanOption(TopLevelOptions.throwIfNamespace, options.throwIfNamespace, true);
        const validRuntime = ['classic', 'automatic'];
        if (runtime === 'classic') {
            pragma = pragma || 'Reblend.construct';
            pragmaFrag = pragmaFrag || 'Reblend';
        }
        else if (runtime === 'automatic') {
            importSource = importSource || 'reblend';
        }
        else {
            throw new Error(`babel-preset-reblend: 'runtime' must be one of ['automatic', 'classic'] but we have '${runtime}'\n` +
                `- Did you mean '${(0, helper_validator_option_1.findSuggestion)(runtime, validRuntime)}'?`);
        }
        return {
            includeTypescript,
            development,
            importSource,
            pragma,
            pragmaFrag,
            pure,
            runtime,
            throwIfNamespace,
        };
    }
    else {
        let { pragma, pragmaFrag } = options;
        const { includeTypescript, pure, throwIfNamespace = true, runtime = 'classic', importSource, useBuiltIns, useSpread, } = options;
        if (runtime === 'classic') {
            pragma = pragma || 'Reblend.construct';
            pragmaFrag = pragmaFrag || 'Reblend';
        }
        const development = !!options.development;
        return {
            includeTypescript,
            development,
            importSource,
            pragma,
            pragmaFrag,
            pure,
            runtime,
            throwIfNamespace,
            useBuiltIns,
            useSpread,
        };
    }
}
