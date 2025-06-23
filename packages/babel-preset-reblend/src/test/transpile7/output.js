"use strict";

var _reblendTestingLibrary = require("reblend-testing-library");
var _ = require("..");
var _reblendjs = require("reblendjs");
describe('useMutationObserver', () => {
  let disconnentSpy;
  beforeEach(async () => {
    disconnentSpy = jest.spyOn(MutationObserver.prototype, 'disconnect');
  });
  afterEach(async () => {
    disconnentSpy?.mockRestore();
  });
  it('should add a mutation observer', async () => {
    const teardown = jest.fn();
    const spy = jest.fn(() => teardown);
    class Wrapper extends _reblendjs.default {
      static ELEMENT_NAME = "Wrapper";
      constructor() {
        super();
      }
      async initState() {
        const {
          item,
          ref
        } = _.useCallbackRef.bind(this)();
        this.state.item = item;
        this.state.ref = ref;
        const {
          setElement
        } = _.useMutationObserver.bind(this)(this.state.item, {
          attributes: true
        }, spy);
        this.state.setElement = setElement;
        _reblendjs.useEffect.bind(this)(() => {
          if (this.state.item) {
            this.state.setElement(this.state.item);
          }
        }, (() => [this.state.item]).bind(this));
      }
      async initProps(props) {
        this.props = {};
        this.props = props;
      }
      async html() {
        return _reblendjs.default.construct.bind(this)("div", {
          ref: this.state.ref,
          ...this.props
        });
      }
    }
    /* @Reblend: Transformed from function to class */
    const wrapper = await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(Wrapper, null));
    expect(spy).toHaveBeenCalledTimes(0);
    await wrapper.rerender(_reblendjs.default.construct.bind(this)(Wrapper, {
      role: "button"
    }));
    await Promise.resolve();
    await (0, _reblendTestingLibrary.waitFor)(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith([expect.objectContaining({
        type: 'attributes',
        attributeName: 'role'
      })], expect.anything());
    });
    expect(spy).toHaveBeenCalledWith([expect.objectContaining({
      type: 'attributes',
      attributeName: 'role'
    })], expect.anything());
    // coverage on the teardown
    await wrapper.unmount();
  });
  it('should update config', async () => {
    const teardown = jest.fn();
    const spy = jest.fn(() => teardown);
    class Wrapper extends _reblendjs.default {
      static ELEMENT_NAME = "Wrapper";
      constructor() {
        super();
      }
      async initState() {
        const {
          item,
          ref
        } = _.useCallbackRef.bind(this)();
        this.state.item = item;
        this.state.ref = ref;
        const {
          setConfig,
          setElement
        } = _.useMutationObserver.bind(this)(this.state.item, {
          attributes: true,
          attributeFilter: this.props.attributeFilter
        }, spy);
        this.state.setConfig = setConfig;
        this.state.setElement = setElement;
        _reblendjs.useEffect.bind(this)(() => this.state.setElement(this.state.item), (() => this.state.item).bind(this));
        _reblendjs.useProps.bind(this)(({
          current: {
            attributeFilter
          },
          initial
        }) => {
          !initial && this.state.setConfig({
            attributes: true,
            attributeFilter
          });
        });
      }
      async initProps({
        attributeFilter,
        ...props
      }) {
        this.props = {};
        this.props.attributeFilter = attributeFilter;
        this.props = {
          ...this.props,
          ...props
        };
      }
      async html() {
        return _reblendjs.default.construct.bind(this)("div", {
          ref: this.state.ref,
          ...this.props
        });
      }
    }
    /* @Reblend: Transformed from function to class */
    const wrapper = await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(Wrapper, {
      attributeFilter: ['data-name']
    }));
    await wrapper.rerender(_reblendjs.default.construct.bind(this)(Wrapper, {
      attributeFilter: ['data-name'],
      role: "presentation"
    }));
    await Promise.resolve();
    expect(spy).toHaveBeenCalledTimes(0);
    await wrapper.rerender(_reblendjs.default.construct.bind(this)(Wrapper, {
      role: "button"
    }));
    await Promise.resolve();
    await (0, _reblendTestingLibrary.waitFor)(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith([expect.objectContaining({
        type: 'attributes',
        attributeName: 'role'
      })], expect.anything());
      expect(disconnentSpy).toHaveBeenCalledTimes(1);
    });
    await wrapper.unmount();
    expect(disconnentSpy).toHaveBeenCalledTimes(3);
  });
});