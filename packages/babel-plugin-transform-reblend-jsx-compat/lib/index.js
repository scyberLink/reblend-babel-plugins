"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const babel_helper_builder_reblend_jsx_1 = __importDefault(require("babel-helper-builder-reblend-jsx"));
const core_1 = require("@babel/core");
exports.default = (0, helper_plugin_utils_1.declare)(api => {
    //api.assertVersion(REQUIRED_VERSION(7));
    return {
        name: 'transform-reblend-jsx-compat',
        manipulateOptions(_, parserOpts) {
            parserOpts.plugins.push('jsx');
        },
        visitor: (0, babel_helper_builder_reblend_jsx_1.default)({
            pre(state) {
                state.callee = state.tagExpr;
            },
            post(state) {
                if (core_1.types.react.isCompatTag(state.tagName)) {
                    state.call = core_1.types.callExpression(core_1.types.memberExpression(core_1.types.memberExpression(core_1.types.identifier('Reblend'), core_1.types.identifier('DOM')), state.tagExpr, core_1.types.isLiteral(state.tagExpr)), state.args);
                }
            },
            compat: true,
        }),
    };
});
