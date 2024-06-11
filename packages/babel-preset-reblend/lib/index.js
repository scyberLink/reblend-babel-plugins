"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const babel_plugin_transform_reblend_jsx_1 = __importDefault(require("babel-plugin-transform-reblend-jsx"));
const babel_plugin_transform_reblend_jsx_development_1 = __importDefault(require("babel-plugin-transform-reblend-jsx-development"));
const babel_plugin_transform_reblend_display_name_1 = __importDefault(require("babel-plugin-transform-reblend-display-name"));
const babel_plugin_transform_reblend_pure_annotations_1 = __importDefault(require("babel-plugin-transform-reblend-pure-annotations"));
const normalize_options_1 = __importDefault(require("./normalize-options"));
exports.default = (0, helper_plugin_utils_1.declarePreset)((api, opts) => {
    //api.assertVersion(REQUIRED_VERSION(7));
    const { development, importSource, pragma = 'Reblend.construct', pragmaFrag = 'Reblend', pure, runtime, throwIfNamespace, } = (0, normalize_options_1.default)(opts);
    return {
        plugins: [
            [
                development ? babel_plugin_transform_reblend_jsx_development_1.default : babel_plugin_transform_reblend_jsx_1.default,
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
            babel_plugin_transform_reblend_display_name_1.default,
            pure !== false && babel_plugin_transform_reblend_pure_annotations_1.default,
        ].filter(Boolean),
    };
});
