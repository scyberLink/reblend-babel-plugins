"use strict";
/* eslint-disable @babel/development/plugin-name */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_plugin_ts_1 = __importDefault(require("./create-plugin.ts"));
exports.default = (0, create_plugin_ts_1.default)({
    name: 'transform-reblend-jsx',
    development: false,
});
