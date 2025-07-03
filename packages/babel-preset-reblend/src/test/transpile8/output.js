"use strict";

exports.__esModule = true;
exports.default = void 0;
exports.useDropdownItem = useDropdownItem;
var _reblendjs = require("reblendjs");
var _reblendHooks = require("reblend-hooks");
var _SelectableContext = require("./SelectableContext");
var _NavContext = require("./NavContext");
var _Button = require("./Button");
var _DataKey = require("./DataKey");
/**
 * Create a dropdown item. Returns a set of props for the dropdown item component
 * including an `onClick` handler that prevents selection when the item is disabled
 */
function useDropdownItem({
  key,
  href,
  active,
  disabled,
  onClick
}) {
  const [onSelectCtx] = _reblendjs.useContext.bind(this)(_SelectableContext.default, "onSelectCtx");
  this.state.onSelectCtx = onSelectCtx;
  const [navContext] = _reblendjs.useContext.bind(this)(_NavContext.default, "navContext");
  this.state.navContext = navContext;
  const {
    activeKey
  } = this.state.navContext || {};
  this.state.activeKey = activeKey;
  const eventKey = (0, _SelectableContext.makeEventKey)(key, href);
  this.state.eventKey = eventKey;
  const isActive = active == null && key != null ? (0, _SelectableContext.makeEventKey)(this.state.activeKey) === this.state.eventKey : active;
  this.state.isActive = isActive;
  const handleClick = _reblendHooks.useEventCallback.bind(this)(event => {
    if (disabled) return;
    onClick?.(event);
    if (this.state.onSelectCtx && !event.isPropagationStopped()) {
      this.state.onSelectCtx(this.state.eventKey, event);
    }
  });
  this.state.handleClick = handleClick;
  return [{
    onClick: this.state.handleClick,
    'aria-disabled': disabled || undefined,
    'aria-selected': this.state.isActive,
    [(0, _DataKey.dataAttr)('dropdown-item')]: ''
  }, {
    isActive: this.state.isActive
  }];
}
/* @Reblend: Transformed from function to class */
const DropdownItem = class
  /* @Reblend: Transformed from function to class */
extends _reblendjs.default {
  static ELEMENT_NAME = "DropdownItem";
  constructor() {
    super();
  }
  async initState() {
    const [dropdownItemProps] = useDropdownItem.bind(this)({
      key: this.props.eventKey,
      href: this.props.href,
      disabled: this.props.disabled,
      onClick: this.props.onClick,
      active: this.props.active
    });
    this.state.dropdownItemProps = dropdownItemProps;
  }
  async initProps({
    eventKey,
    disabled,
    onClick,
    active,
    as: Component = _Button.default,
    ref,
    ...props
  }) {
    this.props = arguments[0] || {};
    this.props.eventKey = eventKey;
    this.props.disabled = disabled;
    this.props.onClick = onClick;
    this.props.active = active;
    this.props.Component = Component;
    this.props.ref = ref;
    this.props = {
      ...this.props,
      ...props
    };
  }
  async html() {
    return _reblendjs.default.construct.bind(this)(this.props.Component, {
      ...this.props,
      ref: this.props.ref,
      ...this.state.dropdownItemProps
    });
  }
};
DropdownItem.displayName = 'DropdownItem';
var _default = exports.default = DropdownItem;