"use strict";

var Reblend = require("reblendjs");
var _reblendTestingLibrary = require("reblend-testing-library");
var _userEvent = require("@testing-library/user-event");
var _globals = require("@jest/globals");
var _Modal = require("../src/Modal");
var _ModalManager = require("../src/ModalManager");
(0, _globals.describe)('<Modal>', () => {
  let attachTo;
  (0, _globals.beforeEach)(() => {
    attachTo = document.createElement('div');
    document.body.appendChild(attachTo);
  });
  (0, _globals.afterEach)(() => {
    attachTo.remove();
  });
  const getDialog = () => _reblendTestingLibrary.screen.getByRole('dialog');
  (0, _globals.it)('should render the modal content', () => {
    class Wrapper extends Reblend.Reblend {
      static ELEMENT_NAME = "Wrapper";
      constructor() {
        super();
      }
      async initState() {}
      async initProps({
        children
      }) {
        this.props = {};
        this.props.children = children;
      }
      async html() {
        return Reblend.Reblend.construct.bind(this)(Reblend.Reblend, null, this.props.children);
      }
    }
    /* @Reblend: Transformed from function to class */
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
      container: attachTo
    });
    (0, _globals.expect)(getDialog().querySelectorAll('strong')).toHaveLength(1);
  });
  (0, _globals.it)('should disable scrolling on the modal container while open', async () => {
    const modal = Reblend.createRef();
    class Container extends Reblend.Reblend {
      static ELEMENT_NAME = "Container";
      constructor() {
        super();
      }
      async initState() {
        const [isOpen, setIsOpen] = Reblend.useState.bind(this)(true, "isOpen");
        this.state.isOpen = isOpen;
        this.state.setIsOpen = setIsOpen;
      }
      async initProps() {
        this.props = {};
      }
      async html() {
        return Reblend.Reblend.construct.bind(this)(_Modal.default, {
          ref: modal,
          show: this.state.isOpen,
          onHide: () => this.state.setIsOpen(false),
          renderBackdrop: p => Reblend.Reblend.construct.bind(this)("div", {
            "data-backdrop": true,
            ...p
          })
        }, Reblend.Reblend.construct.bind(this)("strong", null, "Message"));
      }
    }
    /* @Reblend: Transformed from function to class */
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(Container, null), {
      container: attachTo
    });
    const modalContainer = document.body;
    const backdrop = modal.current.backdrop;
    await (0, _reblendTestingLibrary.waitFor)(() => (0, _globals.expect)(modalContainer.style.overflow).toEqual('hidden'));
    await _userEvent.default.click(backdrop);
    await (0, _reblendTestingLibrary.waitFor)(() => (0, _globals.expect)(_reblendTestingLibrary.screen.queryByRole('dialog')).toBeNull());
    (0, _globals.expect)(modalContainer.style.overflow).toEqual('');
  });
  (0, _globals.it)('should fire backdrop click callback', async () => {
    const onClickSpy = jest.fn();
    const modal = Reblend.createRef();
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true,
      onBackdropClick: onClickSpy,
      ref: modal
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
      container: attachTo
    });
    await _userEvent.default.click(modal.current.backdrop);
    (0, _globals.expect)(onClickSpy).toHaveBeenCalledTimes(1);
  });
  (0, _globals.it)('should close the modal when the backdrop is clicked', async () => {
    const spy = jest.fn();
    const modal = Reblend.createRef();
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true,
      onHide: spy,
      ref: modal
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
      container: attachTo
    });
    await _userEvent.default.click(modal.current.backdrop);
    (0, _globals.expect)(spy).toHaveBeenCalledTimes(1);
  });
  (0, _globals.it)('should not close the modal when the "static" backdrop is clicked', async () => {
    const spy = jest.fn();
    const modal = Reblend.createRef();
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true,
      onHide: spy,
      backdrop: "static",
      ref: modal
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
      container: attachTo
    });
    await _userEvent.default.click(modal.current.backdrop);
    (0, _globals.expect)(spy).not.toHaveBeenCalled();
  });
  (0, _globals.it)('should close the modal when the esc key is pressed', () => {
    const spy = jest.fn();
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true,
      onHide: spy
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
      container: attachTo
    });
    _reblendTestingLibrary.fireEvent.keyDown(document.body, {
      key: 'Escape',
      keyCode: 27
    });
    (0, _globals.expect)(spy).toHaveBeenCalled();
  });
  (0, _globals.it)('should not trigger onHide if e.preventDefault() called', () => {
    const spy = jest.fn();
    const modal = Reblend.createRef();
    const onEscapeKeyDown = e => {
      e.preventDefault();
    };
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true,
      onHide: spy,
      onEscapeKeyDown: onEscapeKeyDown,
      ref: modal
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
      container: attachTo
    });
    _reblendTestingLibrary.fireEvent.keyDown(document.body, {
      key: 'Escape',
      keyCode: 27
    });
    (0, _globals.expect)(spy).not.toHaveBeenCalled();
  });
  (0, _globals.it)('should add role to child', () => {
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true
    }, Reblend.Reblend.construct.bind(this)("div", null, "Message")), {
      container: attachTo
    });
    (0, _globals.expect)(getDialog().firstElementChild.getAttribute('role')).toEqual('document');
  });
  (0, _globals.it)('should allow custom rendering', () => {
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true,
      renderDialog: props => Reblend.Reblend.construct.bind(this)("div", {
        ...props,
        role: "group",
        "data-testid": "group"
      }, "Message")
    }), {
      container: attachTo
    });
    (0, _globals.expect)(_reblendTestingLibrary.screen.getByTestId('group').getAttribute('role')).toEqual('group');
  });
  (0, _globals.it)('should unbind listeners when unmounted', () => {
    const {
      rerender
    } = (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)("div", null, Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Foo bar"))), {
      container: attachTo
    });
    (0, _globals.expect)(document.body.hasAttribute(_ModalManager.OPEN_DATA_ATTRIBUTE)).toEqual(true);
    rerender(null);
    (0, _globals.expect)(document.body.hasAttribute(_ModalManager.OPEN_DATA_ATTRIBUTE)).toEqual(false);
  });
  (0, _globals.it)('should fire show callback on mount', () => {
    const onShowSpy = jest.fn();
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true,
      onShow: onShowSpy
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
      container: attachTo
    });
    (0, _globals.expect)(onShowSpy).toBeCalledTimes(1);
  });
  (0, _globals.it)('should fire show callback on update', () => {
    const onShowSpy = jest.fn();
    const {
      rerender
    } = (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      onShow: onShowSpy
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
      container: attachTo
    });
    rerender(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true,
      onShow: onShowSpy
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")));
    (0, _globals.expect)(onShowSpy).toBeCalledTimes(1);
  });
  (0, _globals.it)('should accept role on the Modal', () => {
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      role: "alertdialog",
      show: true
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
      container: attachTo
    });
    (0, _globals.expect)(_reblendTestingLibrary.screen.getByRole('alertdialog')).toBeTruthy();
  });
  (0, _globals.it)('should accept the `aria-describedby` property on the Modal', () => {
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      "aria-describedby": "modal-description",
      show: true
    }, Reblend.Reblend.construct.bind(this)("strong", {
      id: "modal-description"
    }, "Message")), {
      container: attachTo
    });
    (0, _globals.expect)(getDialog().getAttribute('aria-describedby')).toEqual('modal-description');
  });
  (0, _globals.it)('should not render in a portal when `portal` is false', () => {
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)("div", {
      "data-testid": "container"
    }, Reblend.Reblend.construct.bind(this)(_Modal.default, {
      show: true,
      portal: false
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message"))));
    (0, _globals.expect)(_reblendTestingLibrary.screen.getByTestId('container').contains(_reblendTestingLibrary.screen.getByRole('dialog'))).toBeTruthy();
  });
  (0, _globals.it)('should render the dialog when mountDialogOnEnter and mountDialogOnEnter are false when not shown', () => {
    (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
      mountDialogOnEnter: false,
      unmountDialogOnExit: false
    }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
      container: attachTo
    });
    (0, _globals.expect)(_reblendTestingLibrary.screen.getByText('Message')).toBeTruthy();
  });
  (0, _globals.describe)('Focused state', () => {
    let focusableContainer;
    (0, _globals.beforeEach)(() => {
      focusableContainer = document.createElement('div');
      focusableContainer.tabIndex = 0;
      focusableContainer.className = 'focus-container';
      document.body.appendChild(focusableContainer);
      focusableContainer.focus();
    });
    (0, _globals.afterEach)(() => {
      document.body.removeChild(focusableContainer);
    });
    (0, _globals.it)('should focus on the Modal when it is opened', () => {
      (0, _globals.expect)(document.activeElement).toEqual(focusableContainer);
      const result = (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
        show: true,
        className: "modal"
      }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
        container: focusableContainer
      });
      (0, _globals.expect)(document.activeElement.classList.contains('modal')).toBe(true);
      result.rerender(Reblend.Reblend.construct.bind(this)(_Modal.default, {
        show: false,
        className: "modal"
      }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")));
      (0, _globals.expect)(document.activeElement).toEqual(focusableContainer);
    });
    (0, _globals.it)('should not focus on the Modal when autoFocus is false', () => {
      (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
        show: true,
        autoFocus: false
      }, Reblend.Reblend.construct.bind(this)("strong", null, "Message")), {
        container: focusableContainer
      });
      (0, _globals.expect)(document.activeElement).toEqual(focusableContainer);
    });
    (0, _globals.it)('should not focus Modal when child has focus', () => {
      (0, _globals.expect)(document.activeElement).toEqual(focusableContainer);
      (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
        show: true,
        className: "modal"
      }, Reblend.Reblend.construct.bind(this)("div", null, Reblend.Reblend.construct.bind(this)("input", {
        autoFocus: true
      }))), {
        container: focusableContainer
      });
      const input = document.getElementsByTagName('input')[0];
      (0, _globals.expect)(document.activeElement).toEqual(input);
    });
    (0, _globals.it)('should return focus to the modal', async () => {
      (0, _globals.expect)(document.activeElement).toEqual(focusableContainer);
      (0, _reblendTestingLibrary.render)(Reblend.Reblend.construct.bind(this)(_Modal.default, {
        show: true,
        className: "modal"
      }, Reblend.Reblend.construct.bind(this)("div", null, Reblend.Reblend.construct.bind(this)("input", {
        autoFocus: true
      }))), {
        container: focusableContainer
      });
      focusableContainer.focus();
      await (0, _reblendTestingLibrary.waitFor)(() => {
        (0, _globals.expect)(document.activeElement.classList.contains('modal')).toBe(true);
      });
    });
  });
});