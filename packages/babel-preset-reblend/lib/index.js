"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const babel_plugin_transform_reblend_jsx_1 = __importDefault(require("babel-plugin-transform-reblend-jsx"));
const babel_plugin_transform_reblend_function_to_class_1 = __importDefault(require("babel-plugin-transform-reblend-function-to-class"));
const normalize_options_1 = __importDefault(require("./normalize-options"));
exports.default = (0, helper_plugin_utils_1.declarePreset)((api, opts) => {
    //api.assertVersion(REQUIRED_VERSION(7));
    const { includeTypescript = true, importSource, pragma = 'Reblend.construct', pragmaFrag = 'Reblend', pure, runtime, throwIfNamespace, } = (0, normalize_options_1.default)(opts);
    return {
        presets: [
            [includeTypescript && require.resolve('@babel/preset-typescript')].filter(Boolean),
        ],
        plugins: [
            babel_plugin_transform_reblend_function_to_class_1.default,
            [
                babel_plugin_transform_reblend_jsx_1.default,
                process.env.BABEL_8_BREAKING
                    ? {
                        importSource,
                        pragma,
                        pragmaFrag,
                        runtime,
                        throwIfNamespace,
                        pure,
                    }
                    : {
                        importSource,
                        pragma,
                        pragmaFrag,
                        runtime,
                        throwIfNamespace,
                        pure,
                        useBuiltIns: !!opts.useBuiltIns,
                        useSpread: opts.useSpread,
                    },
            ],
        ].filter(Boolean),
    };
});
