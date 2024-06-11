"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This adds {fileName, lineNumber, columnNumber} annotations to JSX tags.
 *
 * NOTE: lineNumber and columnNumber are both 1-based.
 *
 * == JSX Literals ==
 *
 * <sometag />
 *
 * becomes:
 *
 * var __jsxFileName = 'this/file.js';
 * <sometag __source={{fileName: __jsxFileName, lineNumber: 10, columnNumber: 1}}/>
 */
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const core_1 = require("@babel/core");
const TRACE_ID = '__source';
const FILE_NAME_VAR = '_jsxFileName';
const createNodeFromNullish = (val, fn) => (val == null ? core_1.types.nullLiteral() : fn(val));
exports.default = (0, helper_plugin_utils_1.declare)(api => {
    //api.assertVersion(REQUIRED_VERSION(7));
    function makeTrace(fileNameIdentifier, { line, column }) {
        const fileLineLiteral = createNodeFromNullish(line, core_1.types.numericLiteral);
        const fileColumnLiteral = createNodeFromNullish(column, c => 
        // c + 1 to make it 1-based instead of 0-based.
        core_1.types.numericLiteral(c + 1));
        return core_1.template.expression.ast `{
      fileName: ${fileNameIdentifier},
      lineNumber: ${fileLineLiteral},
      columnNumber: ${fileColumnLiteral},
    }`;
    }
    const isSourceAttr = (attr) => core_1.types.isJSXAttribute(attr) && attr.name.name === TRACE_ID;
    return {
        name: 'transform-reblend-jsx-source',
        visitor: {
            JSXOpeningElement(path, state) {
                const { node } = path;
                if (
                // the element was generated and doesn't have location information
                !node.loc ||
                    // Already has __source
                    path.node.attributes.some(isSourceAttr)) {
                    return;
                }
                if (!state.fileNameIdentifier) {
                    const fileNameId = path.scope.generateUidIdentifier(FILE_NAME_VAR);
                    state.fileNameIdentifier = fileNameId;
                    path.scope.getProgramParent().push({
                        id: fileNameId,
                        init: core_1.types.stringLiteral(state.filename || ''),
                    });
                }
                node.attributes.push(core_1.types.jsxAttribute(core_1.types.jsxIdentifier(TRACE_ID), core_1.types.jsxExpressionContainer(makeTrace(core_1.types.cloneNode(state.fileNameIdentifier), node.loc.start))));
            },
        },
    };
});
