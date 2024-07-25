"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPlugin;
const plugin_syntax_jsx_1 = __importDefault(require("@babel/plugin-syntax-jsx"));
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const core_1 = require("@babel/core");
const helper_module_imports_1 = require("@babel/helper-module-imports");
const DEFAULT = {
    importSource: 'reblendjs',
    runtime: 'automatic',
    pragma: 'Reblend.construct',
    pragmaFrag: 'Reblend',
};
const JSX_SOURCE_ANNOTATION_REGEX = /^\s*\*?\s*@jsxImportSource\s+([^\s]+)\s*$/m;
const JSX_RUNTIME_ANNOTATION_REGEX = /^\s*\*?\s*@jsxRuntime\s+([^\s]+)\s*$/m;
const JSX_ANNOTATION_REGEX = /^\s*\*?\s*@jsx\s+([^\s]+)\s*$/m;
const JSX_FRAG_ANNOTATION_REGEX = /^\s*\*?\s*@jsxFrag\s+([^\s]+)\s*$/m;
const get = (pass, name) => pass.get(`babel-plugin-reblend-jsx/${name}`);
const set = (pass, name, v) => pass.set(`babel-plugin-reblend-jsx/${name}`, v);
function hasProto(node) {
    return node.properties.some(value => core_1.types.isObjectProperty(value, { computed: false, shorthand: false }) &&
        (core_1.types.isIdentifier(value.key, { name: '__proto__' }) ||
            core_1.types.isStringLiteral(value.key, { value: '__proto__' })));
}
function createPlugin({ name, development, }) {
    return (0, helper_plugin_utils_1.declare)((_, options) => {
        const { pure: PURE_ANNOTATION, throwIfNamespace = true, filter, runtime: RUNTIME_DEFAULT = process.env.BABEL_8_BREAKING
            ? 'automatic'
            : development
                ? 'automatic'
                : 'classic', importSource: IMPORT_SOURCE_DEFAULT = DEFAULT.importSource, pragma: PRAGMA_DEFAULT = DEFAULT.pragma, pragmaFrag: PRAGMA_FRAG_DEFAULT = DEFAULT.pragmaFrag, } = options;
        if (process.env.BABEL_8_BREAKING) {
            if ('useSpread' in options) {
                throw new Error('babel-plugin-transform-reblend-jsx: Since Babel 8, an inline object with spread elements is always used, and the "useSpread" option is no longer available. Please remove it from your config.');
            }
            if ('useBuiltIns' in options) {
                const useBuiltInsFormatted = JSON.stringify(options.useBuiltIns);
                throw new Error(`babel-plugin-transform-reblend-jsx: Since "useBuiltIns" is removed in Babel 8, you can remove it from the config.
- Babel 8 now transforms JSX spread to object spread. If you need to transpile object spread with
\`useBuiltIns: ${useBuiltInsFormatted}\`, you can use the following config
{
  "plugins": [
    "babel-plugin-transform-reblend-jsx"
    ["@babel/plugin-transform-object-rest-spread", { "loose": true, "useBuiltIns": ${useBuiltInsFormatted} }]
  ]
}`);
            }
            if (filter != null && RUNTIME_DEFAULT === 'automatic') {
                throw new Error('babel-plugin-transform-reblend-jsx: "filter" option can not be used with automatic runtime. If you are upgrading from Babel 7, please specify `runtime: "classic"`.');
            }
        }
        else {
            // eslint-disable-next-line no-var
            var { useSpread = false, useBuiltIns = false } = options;
            if (RUNTIME_DEFAULT === 'classic') {
                if (typeof useSpread !== 'boolean') {
                    throw new Error('transform-reblend-jsx currently only accepts a boolean option for ' +
                        'useSpread (defaults to false)');
                }
                if (typeof useBuiltIns !== 'boolean') {
                    throw new Error('transform-reblend-jsx currently only accepts a boolean option for ' +
                        'useBuiltIns (defaults to false)');
                }
                if (useSpread && useBuiltIns) {
                    throw new Error('transform-reblend-jsx currently only accepts useBuiltIns or useSpread ' +
                        'but not both');
                }
            }
        }
        const injectMetaPropertiesVisitor = {
            JSXOpeningElement(path, state) {
                const attributes = [];
                if (isThisAllowed(path.scope)) {
                    attributes.push(core_1.types.jsxAttribute(core_1.types.jsxIdentifier('__self'), core_1.types.jsxExpressionContainer(core_1.types.thisExpression())));
                }
                attributes.push(core_1.types.jsxAttribute(core_1.types.jsxIdentifier('__source'), core_1.types.jsxExpressionContainer(makeSource(path, state))));
                path.pushContainer('attributes', attributes);
            },
        };
        return {
            name,
            inherits: plugin_syntax_jsx_1.default,
            visitor: {
                JSXNamespacedName(path) {
                    if (throwIfNamespace) {
                        throw path.buildCodeFrameError(`Namespace tags are not supported by default. Reblend's JSX doesn't support namespace tags. \
You can set \`throwIfNamespace: false\` to bypass this warning.`);
                    }
                },
                JSXSpreadChild(path) {
                    throw path.buildCodeFrameError('Spread children are not supported in Reblend.');
                },
                Program: {
                    enter(path, state) {
                        const { file } = state;
                        let runtime = RUNTIME_DEFAULT;
                        let source = IMPORT_SOURCE_DEFAULT;
                        let pragma = PRAGMA_DEFAULT;
                        let pragmaFrag = PRAGMA_FRAG_DEFAULT;
                        let sourceSet = !!options.importSource;
                        let pragmaSet = !!options.pragma;
                        let pragmaFragSet = !!options.pragmaFrag;
                        if (file.ast.comments) {
                            for (const comment of file.ast.comments) {
                                const sourceMatches = JSX_SOURCE_ANNOTATION_REGEX.exec(comment.value);
                                if (sourceMatches) {
                                    source = sourceMatches[1];
                                    sourceSet = true;
                                }
                                const runtimeMatches = JSX_RUNTIME_ANNOTATION_REGEX.exec(comment.value);
                                if (runtimeMatches) {
                                    runtime = runtimeMatches[1];
                                }
                                const jsxMatches = JSX_ANNOTATION_REGEX.exec(comment.value);
                                if (jsxMatches) {
                                    pragma = jsxMatches[1];
                                    pragmaSet = true;
                                }
                                const jsxFragMatches = JSX_FRAG_ANNOTATION_REGEX.exec(comment.value);
                                if (jsxFragMatches) {
                                    pragmaFrag = jsxFragMatches[1];
                                    pragmaFragSet = true;
                                }
                            }
                        }
                        set(state, 'runtime', runtime);
                        if (runtime === 'classic') {
                            if (sourceSet) {
                                throw path.buildCodeFrameError(`importSource cannot be set when runtime is classic.`);
                            }
                            const construct = toMemberExpression(pragma, false);
                            const fragment = toMemberExpression(pragmaFrag, true);
                            set(state, 'id/construct', () => core_1.types.cloneNode(construct));
                            set(state, 'id/fragment', () => core_1.types.cloneNode(fragment));
                            set(state, 'defaultPure', pragma === DEFAULT.pragma);
                        }
                        else if (runtime === 'automatic') {
                            if (pragmaSet || pragmaFragSet) {
                                throw path.buildCodeFrameError(`pragma and pragmaFrag cannot be set when runtime is automatic.`);
                            }
                            const define = (name, id) => set(state, name, createImportLazily(state, path, id, source));
                            define('id/jsx', development ? 'jsxDEV' : 'jsx');
                            define('id/jsxs', development ? 'jsxDEV' : 'jsxs');
                            define('id/construct', 'construct');
                            define('id/fragment', 'Fragment');
                            set(state, 'defaultPure', source === DEFAULT.importSource);
                        }
                        else {
                            throw path.buildCodeFrameError(`Runtime must be either "classic" or "automatic".`);
                        }
                        if (development) {
                            path.traverse(injectMetaPropertiesVisitor, state);
                        }
                    },
                    // TODO(Babel 8): Decide if this should be removed or brought back.
                    // see: https://github.com/babel/babel/pull/12253#discussion_r513086528
                    //
                    // exit(path, state) {
                    //   if (
                    //     get(state, "runtime") === "classic" &&
                    //     get(state, "pragmaSet") &&
                    //     get(state, "usedFragment") &&
                    //     !get(state, "pragmaFragSet")
                    //   ) {
                    //     throw new Error(
                    //       "transform-reblend-jsx: pragma has been set but " +
                    //         "pragmaFrag has not been set",
                    //     );
                    //   }
                    // },
                },
                JSXFragment: {
                    exit(path, file) {
                        let callExpr;
                        if (get(file, 'runtime') === 'classic') {
                            callExpr = buildConstructFragmentCall(path, file);
                        }
                        else {
                            callExpr = buildJSXFragmentCall(path, file);
                        }
                        path.replaceWith(core_1.types.inherits(callExpr, path.node));
                    },
                },
                JSXElement: {
                    exit(path, file) {
                        let callExpr;
                        if (get(file, 'runtime') === 'classic' ||
                            shouldUseConstruct(path)) {
                            callExpr = buildConstructCall(path, file);
                        }
                        else {
                            callExpr = buildJSXElementCall(path, file);
                        }
                        path.replaceWith(core_1.types.inherits(callExpr, path.node));
                    },
                },
                JSXAttribute(path) {
                    if (core_1.types.isJSXElement(path.node.value)) {
                        path.node.value = core_1.types.jsxExpressionContainer(path.node.value);
                    }
                },
            },
        };
        // Returns whether the class has specified a superclass.
        function isDerivedClass(classPath) {
            return classPath.node.superClass !== null;
        }
        // Returns whether `this` is allowed at given scope.
        function isThisAllowed(scope) {
            // This specifically skips arrow functions as they do not rewrite `this`.
            do {
                const { path } = scope;
                if (path.isFunctionParent() && !path.isArrowFunctionExpression()) {
                    if (!path.isMethod()) {
                        // If the closest parent is a regular function, `this` will be rebound, therefore it is fine to use `this`.
                        return true;
                    }
                    // Current node is within a method, so we need to check if the method is a constructor.
                    if (path.node.kind !== 'constructor') {
                        // We are not in a constructor, therefore it is always fine to use `this`.
                        return true;
                    }
                    // Now we are in a constructor. If it is a derived class, we do not reference `this`.
                    return !isDerivedClass(path.parentPath.parentPath);
                }
                if (path.isTSModuleBlock()) {
                    // If the closest parent is a TS Module block, `this` will not be allowed.
                    return false;
                }
            } while ((scope = scope.parent));
            // We are not in a method or function. It is fine to use `this`.
            return true;
        }
        function call(pass, name, args) {
            const node = core_1.types.callExpression(get(pass, `id/${name}`)(), args);
            //if (PURE_ANNOTATION ?? get(pass, 'defaultPure')) annotateAsPure(node);
            return node;
        }
        // We want to use Reblend.construct, even in the case of
        // jsx, for <div {...props} key={key} /> to distinguish it
        // from <div key={key} {...props} />. This is an intermediary
        // step while we deprecate key spread from props. Afterwards,
        // we will stop using construct in the transform.
        function shouldUseConstruct(path) {
            const openingPath = path.get('openingElement');
            const attributes = openingPath.node.attributes;
            let seenPropsSpread = false;
            for (let i = 0; i < attributes.length; i++) {
                const attr = attributes[i];
                if (seenPropsSpread &&
                    core_1.types.isJSXAttribute(attr) &&
                    attr.name.name === 'key') {
                    return true;
                }
                else if (core_1.types.isJSXSpreadAttribute(attr)) {
                    seenPropsSpread = true;
                }
            }
            return false;
        }
        function convertJSXIdentifier(node, parent) {
            if (core_1.types.isJSXIdentifier(node)) {
                if (node.name === 'this' && core_1.types.isReferenced(node, parent)) {
                    return core_1.types.thisExpression();
                }
                else if (core_1.types.isValidIdentifier(node.name, false)) {
                    // @ts-expect-error cast AST type to Identifier
                    node.type = 'Identifier';
                    return node;
                }
                else {
                    return core_1.types.stringLiteral(node.name);
                }
            }
            else if (core_1.types.isJSXMemberExpression(node)) {
                return core_1.types.memberExpression(convertJSXIdentifier(node.object, node), convertJSXIdentifier(node.property, node));
            }
            else if (core_1.types.isJSXNamespacedName(node)) {
                /**
                 * If the flag "throwIfNamespace" is false
                 * print XMLNamespace like string literal
                 */
                return core_1.types.stringLiteral(`${node.namespace.name}:${node.name.name}`);
            }
            // todo: this branch should be unreachable
            return node;
        }
        function convertAttributeValue(node) {
            if (core_1.types.isJSXExpressionContainer(node)) {
                return node.expression;
            }
            else {
                return node;
            }
        }
        function accumulateAttribute(array, attribute) {
            var _a;
            if (core_1.types.isJSXSpreadAttribute(attribute.node)) {
                const arg = attribute.node.argument;
                // Collect properties into props array if spreading object expression
                if (core_1.types.isObjectExpression(arg) && !hasProto(arg)) {
                    array.push(...arg.properties);
                }
                else {
                    array.push(core_1.types.spreadElement(arg));
                }
                return array;
            }
            const value = convertAttributeValue(attribute.node.name.name !== 'key'
                ? attribute.node.value || core_1.types.booleanLiteral(true)
                : attribute.node.value);
            if (attribute.node.name.name === 'key' && value === null) {
                throw attribute.buildCodeFrameError('Please provide an explicit key value. Using "key" as a shorthand for "key={true}" is not allowed.');
            }
            if (core_1.types.isStringLiteral(value) &&
                !core_1.types.isJSXExpressionContainer(attribute.node.value)) {
                value.value = value.value.replace(/\n\s+/g, ' ');
                // "raw" JSXText should not be used from a StringLiteral because it needs to be escaped.
                (_a = value.extra) === null || _a === void 0 ? true : delete _a.raw;
            }
            if (core_1.types.isJSXNamespacedName(attribute.node.name)) {
                // @ts-expect-error mutating AST
                attribute.node.name = core_1.types.stringLiteral(attribute.node.name.namespace.name +
                    ':' +
                    attribute.node.name.name.name);
            }
            else if (core_1.types.isValidIdentifier(attribute.node.name.name, false)) {
                // @ts-expect-error mutating AST
                attribute.node.name.type = 'Identifier';
            }
            else {
                // @ts-expect-error mutating AST
                attribute.node.name = core_1.types.stringLiteral(attribute.node.name.name);
            }
            array.push(core_1.types.inherits(core_1.types.objectProperty(
            // @ts-expect-error The attribute.node.name is an Identifier now
            attribute.node.name, value), attribute.node));
            return array;
        }
        function buildChildrenProperty(children) {
            let childrenNode;
            if (children.length === 1) {
                childrenNode = children[0];
            }
            else if (children.length > 1) {
                childrenNode = core_1.types.arrayExpression(children);
            }
            else {
                return undefined;
            }
            return core_1.types.objectProperty(core_1.types.identifier('children'), childrenNode);
        }
        // Builds JSX into:
        // Production: Reblend.jsx(type, arguments, key)
        // Development: Reblend.jsxDEV(type, arguments, key, isStaticChildren, source, self)
        function buildJSXElementCall(path, file) {
            var _a;
            const openingPath = path.get('openingElement');
            const args = [getTag(openingPath)];
            const attribsArray = [];
            const extracted = Object.create(null);
            // for Reblend.jsx, key, __source (dev), and __self (dev) is passed in as
            // a separate argument rather than in the args object. We go through the
            // props and filter out these three keywords so we can pass them in
            // as separate arguments later
            for (const attr of openingPath.get('attributes')) {
                if (attr.isJSXAttribute() && core_1.types.isJSXIdentifier(attr.node.name)) {
                    const { name } = attr.node.name;
                    switch (name) {
                        case '__source':
                        case '__self':
                            if (extracted[name])
                                throw sourceSelfError(path, name);
                        /* falls through */
                        case 'key': {
                            const keyValue = convertAttributeValue(attr.node.value);
                            if (keyValue === null) {
                                throw attr.buildCodeFrameError('Please provide an explicit key value. Using "key" as a shorthand for "key={true}" is not allowed.');
                            }
                            extracted[name] = keyValue;
                            break;
                        }
                        default:
                            attribsArray.push(attr);
                    }
                }
                else {
                    attribsArray.push(attr);
                }
            }
            const children = core_1.types.react.buildChildren(path.node);
            let attribs;
            if (attribsArray.length || children.length) {
                attribs = buildJSXOpeningElementAttributes(attribsArray, 
                //@ts-expect-error The children here contains JSXSpreadChild,
                // which will be thrown later
                children);
            }
            else {
                // attributes should never be null
                attribs = core_1.types.objectExpression([]);
            }
            args.push(attribs);
            if (development) {
                // isStaticChildren, __source, and __self are only used in development
                // automatically include __source and __self in this plugin
                // so we can eliminate the need for separate Babel plugins in Babel 8
                args.push((_a = extracted.key) !== null && _a !== void 0 ? _a : path.scope.buildUndefinedNode(), core_1.types.booleanLiteral(children.length > 1));
                if (extracted.__source) {
                    args.push(extracted.__source);
                    if (extracted.__self)
                        args.push(extracted.__self);
                }
                else if (extracted.__self) {
                    args.push(path.scope.buildUndefinedNode(), extracted.__self);
                }
            }
            else if (extracted.key !== undefined) {
                args.push(extracted.key);
            }
            return call(file, children.length > 1 ? 'jsxs' : 'jsx', args);
        }
        // Builds props for Reblend.jsx. This function adds children into the props
        // and ensures that props is always an object
        function buildJSXOpeningElementAttributes(attribs, children) {
            const props = attribs.reduce(accumulateAttribute, []);
            // In Reblend.jsx, children is no longer a separate argument, but passed in
            // through the argument object
            if ((children === null || children === void 0 ? void 0 : children.length) > 0) {
                props.push(buildChildrenProperty(children));
            }
            return core_1.types.objectExpression(props);
        }
        // Builds JSX Fragment <></> into
        // Production: Reblend.jsx(type, arguments)
        // Development: Reblend.jsxDEV(type, { children })
        function buildJSXFragmentCall(path, file) {
            const args = [get(file, 'id/fragment')()];
            const children = core_1.types.react.buildChildren(path.node);
            args.push(core_1.types.objectExpression(children.length > 0
                ? [
                    buildChildrenProperty(
                    // The children here contains JSXSpreadChild,
                    // which will be thrown later
                    //@ts-ignore
                    children),
                ]
                : []));
            if (development) {
                args.push(path.scope.buildUndefinedNode(), core_1.types.booleanLiteral(children.length > 1));
            }
            return call(file, children.length > 1 ? 'jsxs' : 'jsx', args);
        }
        // Builds JSX Fragment <></> into
        // Reblend.construct(Reblend, null, ...children)
        function buildConstructFragmentCall(path, file) {
            if (filter && !filter(path.node, file))
                return;
            return call(file, 'construct', [
                get(file, 'id/fragment')(),
                core_1.types.nullLiteral(),
                ...core_1.types.react.buildChildren(path.node),
            ]);
        }
        // Builder
        // Builds JSX into:
        // Production: Reblend.construct(type, arguments, children)
        // Development: Reblend.construct(type, arguments, children, source, self)
        function buildConstructCall(path, file) {
            const openingPath = path.get('openingElement');
            return call(file, 'construct', [
                getTag(openingPath),
                buildConstructOpeningElementAttributes(file, path, openingPath.get('attributes')),
                // ts-expect-error JSXSpreadChild has been transformed in convertAttributeValue
                ...core_1.types.react.buildChildren(path.node),
            ]);
        }
        function getTag(openingPath) {
            const tagExpr = convertJSXIdentifier(openingPath.node.name, openingPath.node);
            let tagName;
            if (core_1.types.isIdentifier(tagExpr)) {
                tagName = tagExpr.name;
            }
            else if (core_1.types.isStringLiteral(tagExpr)) {
                tagName = tagExpr.value;
            }
            if (core_1.types.react.isCompatTag(tagName)) {
                return core_1.types.stringLiteral(tagName);
            }
            else {
                return tagExpr;
            }
        }
        /**
         * The logic for this is quite terse. It's because we need to
         * support spread elements. We loop over all attributes,
         * breaking on spreads, we then push a new object containing
         * all prior attributes to an array for later processing.
         */
        function buildConstructOpeningElementAttributes(file, path, attribs) {
            const runtime = get(file, 'runtime');
            if (!process.env.BABEL_8_BREAKING) {
                if (runtime !== 'automatic') {
                    const objs = [];
                    const props = attribs.reduce(accumulateAttribute, []);
                    if (!useSpread) {
                        // Convert syntax to use multiple objects instead of spread
                        let start = 0;
                        props.forEach((prop, i) => {
                            if (core_1.types.isSpreadElement(prop)) {
                                if (i > start) {
                                    objs.push(core_1.types.objectExpression(props.slice(start, i)));
                                }
                                objs.push(prop.argument);
                                start = i + 1;
                            }
                        });
                        if (props.length > start) {
                            objs.push(core_1.types.objectExpression(props.slice(start)));
                        }
                    }
                    else if (props.length) {
                        objs.push(core_1.types.objectExpression(props));
                    }
                    if (!objs.length) {
                        return core_1.types.nullLiteral();
                    }
                    if (objs.length === 1) {
                        if (!(core_1.types.isSpreadElement(props[0]) &&
                            // If an object expression is spread element's argument
                            // it is very likely to contain __proto__ and we should stop
                            // optimizing spread element
                            core_1.types.isObjectExpression(props[0].argument))) {
                            return objs[0];
                        }
                    }
                    // looks like we have multiple objects
                    if (!core_1.types.isObjectExpression(objs[0])) {
                        objs.unshift(core_1.types.objectExpression([]));
                    }
                    const helper = useBuiltIns
                        ? core_1.types.memberExpression(core_1.types.identifier('Object'), core_1.types.identifier('assign'))
                        : //@ts-ignore
                            file.addHelper('extends');
                    // spread it
                    return core_1.types.callExpression(helper, objs);
                }
            }
            const props = [];
            const found = Object.create(null);
            for (const attr of attribs) {
                const { node } = attr;
                const name = core_1.types.isJSXAttribute(node) &&
                    core_1.types.isJSXIdentifier(node.name) &&
                    node.name.name;
                if (runtime === 'automatic' &&
                    (name === '__source' || name === '__self')) {
                    if (found[name])
                        throw sourceSelfError(path, name);
                    found[name] = true;
                }
                accumulateAttribute(props, attr);
            }
            return props.length === 1 &&
                core_1.types.isSpreadElement(props[0]) &&
                // If an object expression is spread element's argument
                // it is very likely to contain __proto__ and we should stop
                // optimizing spread element
                !core_1.types.isObjectExpression(props[0].argument)
                ? props[0].argument
                : props.length > 0
                    ? core_1.types.objectExpression(props)
                    : core_1.types.nullLiteral();
        }
    });
    function getSource(source, importName) {
        switch (importName) {
            case 'Fragment':
                return `${source}/${development ? 'jsx-dev-runtime' : 'jsx-runtime'}`;
            case 'jsxDEV':
                return `${source}/jsx-dev-runtime`;
            case 'jsx':
            case 'jsxs':
                return `${source}/jsx-runtime`;
            case 'construct':
                return source;
        }
    }
    function createImportLazily(pass, path, importName, source) {
        return () => {
            const actualSource = getSource(source, importName);
            if ((0, helper_module_imports_1.isModule)(path)) {
                let reference = get(pass, `imports/${importName}`);
                if (reference)
                    return core_1.types.cloneNode(reference);
                reference = (0, helper_module_imports_1.addNamed)(path, importName, actualSource, {
                    importedInterop: 'uncompiled',
                    importPosition: 'after',
                });
                set(pass, `imports/${importName}`, reference);
                return reference;
            }
            else {
                let reference = get(pass, `requires/${actualSource}`);
                if (reference) {
                    reference = core_1.types.cloneNode(reference);
                }
                else {
                    reference = (0, helper_module_imports_1.addNamespace)(path, actualSource, {
                        importedInterop: 'uncompiled',
                    });
                    set(pass, `requires/${actualSource}`, reference);
                }
                return core_1.types.memberExpression(reference, core_1.types.identifier(importName));
            }
        };
    }
}
function toMemberExpression(id, isFragment) {
    if (isFragment) {
        return (id
            .split('.')
            .map(name => core_1.types.identifier(name))
            // @ts-expect-error - The Array#reduce does not have a signature
            // where the type of initial value differs from callback return type
            .reduce((object, property) => core_1.types.memberExpression(object, property)));
    }
    return core_1.types.callExpression(core_1.types.memberExpression(id
        .split('.')
        .map(name => core_1.types.identifier(name))
        // @ts-expect-error - The Array#reduce does not have a signature
        // where the type of initial value differs from callback return type
        .reduce((object, property) => core_1.types.memberExpression(object, property)), core_1.types.identifier('bind')), [core_1.types.thisExpression()]);
}
function makeSource(path, state) {
    const location = path.node.loc;
    if (!location) {
        // the element was generated and doesn't have location information
        return path.scope.buildUndefinedNode();
    }
    //  todo: avoid mutating PluginPass
    if (!state.fileNameIdentifier) {
        const { filename = '' } = state;
        const fileNameIdentifier = path.scope.generateUidIdentifier('_jsxFileName');
        path.scope.getProgramParent().push({
            id: fileNameIdentifier,
            init: core_1.types.stringLiteral(filename),
        });
        //  todo: avoid mutating PluginPass
        state.fileNameIdentifier = fileNameIdentifier;
    }
    return makeTrace(core_1.types.cloneNode(
    //  todo: avoid mutating PluginPass
    state.fileNameIdentifier), location.start.line, location.start.column);
}
function makeTrace(fileNameIdentifier, lineNumber, column0Based) {
    const fileLineLiteral = lineNumber != null ? core_1.types.numericLiteral(lineNumber) : core_1.types.nullLiteral();
    const fileColumnLiteral = column0Based != null ? core_1.types.numericLiteral(column0Based + 1) : core_1.types.nullLiteral();
    return core_1.template.expression.ast `{
    fileName: ${fileNameIdentifier},
    lineNumber: ${fileLineLiteral},
    columnNumber: ${fileColumnLiteral},
  }`;
}
function sourceSelfError(path, name) {
    const pluginName = `transform-reblend-jsx-${name.slice(2)}`;
    return path.buildCodeFrameError(`Duplicate ${name} prop found. You are most likely using the deprecated ${pluginName} Babel plugin. Both __source and __self are automatically set when using the automatic runtime. Please remove transform-reblend-jsx-source and transform-reblend-jsx-self from your Babel config.`);
}
