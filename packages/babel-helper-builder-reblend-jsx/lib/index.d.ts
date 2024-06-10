import type { PluginPass, Visitor, types as t } from '@babel/core';
type ElementState = {
    tagExpr: t.Expression;
    tagName: string | undefined | null;
    args: Array<any>;
    call?: any;
    pure: boolean;
    callee?: any;
};
export interface Options {
    filter?: (node: t.Node, pass: PluginPass) => boolean;
    pre?: (state: ElementState, pass: PluginPass) => void;
    post?: (state: ElementState, pass: PluginPass) => void;
    compat?: boolean;
    pure?: string;
    throwIfNamespace?: boolean;
    useSpread?: boolean;
    useBuiltIns?: boolean;
}
export default function (opts: Options): Visitor<any>;
export {};
//# sourceMappingURL=index.d.ts.map