"use strict";

exports.__esModule = true;
var _exportNames = {
  render: true,
  renderHook: true,
  cleanup: true,
  fireEvent: true,
  getConfig: true,
  configure: true
};
exports.cleanup = cleanup;
exports.render = render;
exports.renderHook = renderHook;
var _dom = require("@testing-library/dom");
Object.keys(_dom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _dom[key]) return;
  exports[key] = _dom[key];
});
var _fireEvent = require("./fire-event");
exports.fireEvent = _fireEvent.fireEvent;
var _config = require("./config");
exports.getConfig = _config.getConfig;
exports.configure = _config.configure;
var _reblendjs = require("reblendjs");
// Ideally we'd just use a WeakMap where containers are keys and roots are values.
// We use two variables so that we can bail out in constant time when we render with a new container (most common use case)
const mountedContainers = new Set();
function wrapUiIfNeeded(innerElement, wrapperComponent) {
  return wrapperComponent ? _reblendjs.default.construct(wrapperComponent, {}, innerElement) : innerElement;
}
async function renderRoot(ui, {
  baseElement,
  container,
  queries,
  wrapper: WrapperComponent
} = {}) {
  if (!container) return undefined;
  _reblendjs.ConfigUtil.getInstance().update({
    noDefering: true
  });
  await _reblendjs.default.mountOn(container, await wrapUiIfNeeded(ui, WrapperComponent));
  return {
    container,
    baseElement,
    debug: (el = baseElement, maxLength, options) => Array.isArray(el) ?
    // eslint-disable-next-line no-console
    el.forEach(e => console.log((0, _dom.prettyDOM)(e, maxLength, options))) :
    // eslint-disable-next-line no-console,
    console.log((0, _dom.prettyDOM)(el, maxLength, options)),
    unmount: async () => {
      mountedContainers.delete(container);
      await (0, _reblendjs.detach)(container);
    },
    rerender: async rerenderUi => {
      const rerenderchildren = await wrapUiIfNeeded(rerenderUi, WrapperComponent);
      await _reblendjs.default.mountOn(container, rerenderchildren);
      // Intentionally do not return anything to avoid unnecessarily complicating the API.
      // folks can use all the same utilities we return in the first place that are bound to the container
    },
    asFragment: () => {
      /* istanbul ignore else (old jsdom limitation) */
      if (typeof document.createRange === "function") {
        return document.createRange().createContextualFragment(container?.innerHTML);
      } else {
        const template = document.createElement("template");
        template.innerHTML = container?.innerHTML;
        return template.content;
      }
    },
    ...(0, _dom.getQueriesForElement)(baseElement, queries)
  };
}
async function render(ui, {
  baseElement,
  container,
  queries,
  wrapper
} = {}) {
  if (!baseElement) {
    // default to document.body instead of documentElement to avoid output of potentially-large
    // head elements (such as JSS style blocks) in debug output
    baseElement = document.body;
  }
  if (!container) {
    container = baseElement.appendChild(document.createElement("div"));
  }
  mountedContainers.add(container);
  return await renderRoot(ui, {
    container,
    baseElement,
    queries,
    wrapper
  });
}
async function cleanup() {
  for (const container of mountedContainers) {
    await (0, _reblendjs.detach)(container);
  }
  mountedContainers.clear();
}
async function renderHook(useRenderCallback, options = {}) {
  const {
    initialProps,
    ...renderOptions
  } = options;
  let result = (0, _reblendjs.useRef)();

  //@reblendComponent
  class TestComponent extends _reblendjs.default {
    static ELEMENT_NAME = "TestComponent";
    constructor() {
      super();
    }
    async initState() {
      _reblendjs.useEffect.bind(this)(() => {
        const pendingResult = useRenderCallback.bind(this)(this.props.renderCallbackProps);
        result && (result.current = pendingResult);
      }, (() => this.props.refreshCode).bind(this));
    }
    async initProps({
      renderCallbackProps,
      refreshCode
    }) {
      this.props = {};
      this.props.renderCallbackProps = renderCallbackProps;
      this.props.refreshCode = refreshCode;
    }
    async html() {
      return null;
    }
  }
  /* @Reblend: Transformed from function to class */
  const {
    rerender: baseRerender,
    unmount
  } = await render(_reblendjs.default.construct.bind(this)(TestComponent, {
    renderCallbackProps: initialProps,
    refreshCode: 0
  }), renderOptions);
  async function rerender(rerenderCallbackProps) {
    return await baseRerender(_reblendjs.default.construct.bind(this)(TestComponent, {
      renderCallbackProps: rerenderCallbackProps,
      refreshCode: (0, _reblendjs.rand)(101, 4321)
    }));
  }
  return {
    result,
    rerender,
    unmount
  };
}

// just re-export everything from dom-testing-library

/* eslint func-name-matching:0 */