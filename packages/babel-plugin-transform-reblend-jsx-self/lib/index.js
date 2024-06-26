"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This adds a __self={this} JSX attribute to all JSX elements, which Reblend will use
 * to generate some runtime warnings. However, if the JSX element appears within a
 * constructor of a derived class, `__self={this}` will not be inserted in order to
 * prevent runtime errors.
 *
 * == JSX Literals ==
 *
 * <sometag />
 *
 * becomes:
 *
 * <sometag __self={this} />
 */
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const core_1 = require("@babel/core");
const TRACE_ID = '__self';
/**
 * Finds the closest parent function that provides `this`. Specifically, this looks for
 * the first parent function that isn't an arrow function.
 *
 * Derived from `Scope#getFunctionParent`
 */
function getThisFunctionParent(path) {
    let scope = path.scope;
    do {
        const { path } = scope;
        if (path.isFunctionParent() && !path.isArrowFunctionExpression()) {
            //@ts-ignore
            return path;
        }
    } while ((scope = scope.parent));
    return null;
}
/**
 * Returns whether the class has specified a superclass.
 */
function isDerivedClass(classPath) {
    return classPath.node.superClass !== null;
}
/**
 * Returns whether `this` is allowed at given path.
 */
function isThisAllowed(path) {
    // This specifically skips arrow functions as they do not rewrite `this`.
    const parentMethodOrFunction = getThisFunctionParent(path);
    if (parentMethodOrFunction === null) {
        // We are not in a method or function. It is fine to use `this`.
        return true;
    }
    if (!parentMethodOrFunction.isMethod()) {
        // If the closest parent is a regular function, `this` will be rebound, therefore it is fine to use `this`.
        return true;
    }
    // Current node is within a method, so we need to check if the method is a constructor.
    if (parentMethodOrFunction.node.kind !== 'constructor') {
        // We are not in a constructor, therefore it is always fine to use `this`.
        return true;
    }
    // Now we are in a constructor. If it is a derived class, we do not reference `this`.
    return !isDerivedClass(parentMethodOrFunction.parentPath.parentPath);
}
exports.default = (0, helper_plugin_utils_1.declare)(api => {
    //api.assertVersion(REQUIRED_VERSION(7));
    const visitor = {
        JSXOpeningElement(path) {
            if (!isThisAllowed(path)) {
                return;
            }
            const node = path.node;
            const id = core_1.types.jsxIdentifier(TRACE_ID);
            const trace = core_1.types.thisExpression();
            node.attributes.push(core_1.types.jsxAttribute(id, core_1.types.jsxExpressionContainer(trace)));
        },
    };
    return {
        name: 'transform-reblend-jsx-self',
        visitor: {
            Program(path) {
                path.traverse(visitor);
            },
        },
    };
});
