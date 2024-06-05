export default function normalizeOptions(options?: any):
  | {
      development: any;
      importSource: any;
      pragma: any;
      pragmaFrag: any;
      pure: any;
      runtime: any;
      throwIfNamespace: any;
      useBuiltIns?: undefined;
      useSpread?: undefined;
    }
  | {
      development: boolean;
      importSource: any;
      pragma: any;
      pragmaFrag: any;
      pure: any;
      runtime: any;
      throwIfNamespace: any;
      useBuiltIns: any;
      useSpread: any;
    };
//# sourceMappingURL=normalize-options.d.ts.map
