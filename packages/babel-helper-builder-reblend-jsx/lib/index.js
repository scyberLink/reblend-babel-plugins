"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
const helper_annotate_as_pure_1 = __importDefault(require("@babel/helper-annotate-as-pure"));
function default_1(opts) {
    // @ts-ignore
    const visitor = {};
    visitor.JSXNamespacedName = function (path) {
        if (opts.throwIfNamespace) {
            throw path.buildCodeFrameError(`Namespace tags are not supported by default. Reblend's JSX doesn't support namespace tags. \
You can set \`throwIfNamespace: false\` to bypass this warning.`);
        }
    };
    visitor.JSXSpreadChild = function (path) {
        throw path.buildCodeFrameError('Spread children are not supported in Reblend.');
    };
    visitor.JSXElement = {
        exit(path, state) {
            const callExpr = buildElementCall(path, state);
            if (callExpr) {
                path.replaceWith((0, types_1.inherits)(callExpr, path.node));
            }
        },
    };
    visitor.JSXFragment = {
        exit(path, state) {
            if (opts.compat) {
                throw path.buildCodeFrameError('Fragment tags are only supported in Reblend 16 and up.');
            }
            const callExpr = buildFragmentCall(path, state);
            if (callExpr) {
                path.replaceWith((0, types_1.inherits)(callExpr, path.node));
            }
        },
    };
    return visitor;
    function convertJSXIdentifier(node, parent) {
        if ((0, types_1.isJSXIdentifier)(node)) {
            if (node.name === 'this' && (0, types_1.isReferenced)(node, parent)) {
                return (0, types_1.thisExpression)();
            }
            else if ((0, types_1.isValidIdentifier)(node.name, false)) {
                // ts-expect-error casting JSXIdentifier to Identifier
                node.type = 'Identifier';
                return node;
            }
            else {
                return (0, types_1.stringLiteral)(node.name);
            }
        }
        else if ((0, types_1.isJSXMemberExpression)(node)) {
            return (0, types_1.memberExpression)(convertJSXIdentifier(node.object, node), convertJSXIdentifier(node.property, node));
        }
        else if ((0, types_1.isJSXNamespacedName)(node)) {
            /**
             * If there is flag "throwIfNamespace"
             * print XMLNamespace like string literal
             */
            return (0, types_1.stringLiteral)(`${node.namespace.name}:${node.name.name}`);
        }
        return node;
    }
    function convertAttributeValue(node) {
        if ((0, types_1.isJSXExpressionContainer)(node)) {
            return node.expression;
        }
        else {
            return node;
        }
    }
    function convertAttribute(node) {
        var _a;
        if ((0, types_1.isJSXSpreadAttribute)(node)) {
            return (0, types_1.spreadElement)(node.argument);
        }
        const value = convertAttributeValue(node.value || (0, types_1.booleanLiteral)(true));
        if ((0, types_1.isStringLiteral)(value) && !(0, types_1.isJSXExpressionContainer)(node.value)) {
            value.value = value.value.replace(/\n\s+/g, ' ');
            // "raw" JSXText should not be used from a StringLiteral because it needs to be escaped.
            (_a = value.extra) === null || _a === void 0 ? true : delete _a.raw;
        }
        if ((0, types_1.isJSXNamespacedName)(node.name)) {
            // @ts-expect-error Mutating AST nodes
            node.name = (0, types_1.stringLiteral)(node.name.namespace.name + ':' + node.name.name.name);
        }
        else if ((0, types_1.isValidIdentifier)(node.name.name, false)) {
            // @ts-expect-error Mutating AST nodes
            node.name.type = 'Identifier';
        }
        else {
            // @ts-expect-error Mutating AST nodes
            node.name = (0, types_1.stringLiteral)(node.name.name);
        }
        return (0, types_1.inherits)((0, types_1.objectProperty)(
        // @ts-expect-error Mutating AST nodes
        node.name, value), node);
    }
    function buildElementCall(path, pass) {
        if (opts.filter && !opts.filter(path.node, pass))
            return;
        const openingPath = path.get('openingElement');
        // @ts-expect-error mutating AST nodes
        path.node.children = types_1.react.buildChildren(path.node);
        const tagExpr = convertJSXIdentifier(openingPath.node.name, openingPath.node);
        const args = [];
        let tagName;
        if ((0, types_1.isIdentifier)(tagExpr)) {
            tagName = tagExpr.name;
        }
        else if ((0, types_1.isStringLiteral)(tagExpr)) {
            tagName = tagExpr.value;
        }
        const state = {
            tagExpr: tagExpr,
            tagName: tagName,
            args: args,
            pure: false,
        };
        if (opts.pre) {
            opts.pre(state, pass);
        }
        const attribs = openingPath.node.attributes;
        let convertedAttributes;
        if (attribs.length) {
            if (process.env.BABEL_8_BREAKING) {
                convertedAttributes = (0, types_1.objectExpression)(attribs.map(convertAttribute));
            }
            else {
                convertedAttributes = buildOpeningElementAttributes(attribs, pass);
            }
        }
        else {
            convertedAttributes = (0, types_1.nullLiteral)();
        }
        args.push(convertedAttributes, 
        // @ts-expect-error JSXExpressionContainer has been transformed by convertAttributeValue
        ...path.node.children);
        if (opts.post) {
            opts.post(state, pass);
        }
        const call = state.call || (0, types_1.callExpression)(state.callee, args);
        if (state.pure)
            (0, helper_annotate_as_pure_1.default)(call);
        return call;
    }
    function pushProps(_props, objs) {
        if (!_props.length)
            return _props;
        objs.push((0, types_1.objectExpression)(_props));
        return [];
    }
    /**
     * The logic for this is quite terse. It's because we need to
     * support spread elements. We loop over all attributes,
     * breaking on spreads, we then push a new object containing
     * all prior attributes to an array for later processing.
     */
    function buildOpeningElementAttributes(attribs, 
    // @ts-ignore
    pass) {
        let _props = [];
        const objs = [];
        const { useSpread = false } = pass.opts;
        if (typeof useSpread !== 'boolean') {
            throw new Error('transform-reblend-jsx currently only accepts a boolean option for ' +
                'useSpread (defaults to false)');
        }
        const useBuiltIns = pass.opts.useBuiltIns || false;
        if (typeof useBuiltIns !== 'boolean') {
            throw new Error('transform-reblend-jsx currently only accepts a boolean option for ' +
                'useBuiltIns (defaults to false)');
        }
        if (useSpread && useBuiltIns) {
            throw new Error('transform-reblend-jsx currently only accepts useBuiltIns or useSpread ' +
                'but not both');
        }
        if (useSpread) {
            const props = attribs.map(convertAttribute);
            return (0, types_1.objectExpression)(props);
        }
        while (attribs.length) {
            const prop = attribs.shift();
            if ((0, types_1.isJSXSpreadAttribute)(prop)) {
                _props = pushProps(_props, objs);
                objs.push(prop.argument);
            }
            else {
                _props.push(convertAttribute(prop));
            }
        }
        pushProps(_props, objs);
        let convertedAttribs;
        if (objs.length === 1) {
            // only one object
            convertedAttribs = objs[0];
        }
        else {
            // looks like we have multiple objects
            if (!(0, types_1.isObjectExpression)(objs[0])) {
                objs.unshift((0, types_1.objectExpression)([]));
            }
            const helper = useBuiltIns
                ? (0, types_1.memberExpression)((0, types_1.identifier)('Object'), (0, types_1.identifier)('assign'))
                : pass.addHelper('extends');
            // spread it
            convertedAttribs = (0, types_1.callExpression)(helper, objs);
        }
        return convertedAttribs;
    }
    function buildFragmentCall(path, pass) {
        if (opts.filter && !opts.filter(path.node, pass))
            return;
        // @ts-expect-error mutating AST nodes
        path.node.children = types_1.react.buildChildren(path.node);
        const args = [];
        const tagName = null;
        const tagExpr = pass.get('jsxFragIdentifier')();
        const state = {
            tagExpr: tagExpr,
            tagName: tagName,
            args: args,
            pure: false,
        };
        if (opts.pre) {
            opts.pre(state, pass);
        }
        // no attributes are allowed with <> syntax
        args.push((0, types_1.nullLiteral)(), 
        // @ts-expect-error JSXExpressionContainer has been transformed by convertAttributeValue
        ...path.node.children);
        if (opts.post) {
            opts.post(state, pass);
        }
        pass.set('usedFragment', true);
        const call = state.call || (0, types_1.callExpression)(state.callee, args);
        if (state.pure)
            (0, helper_annotate_as_pure_1.default)(call);
        return call;
    }
}
exports.default = default_1;
