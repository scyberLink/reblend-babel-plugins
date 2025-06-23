"use strict";

var _reblendTestingLibrary = require("reblend-testing-library");
var _Anchor = require("../src/Anchor");
var _reblendjs = require("reblendjs");
describe('Anchor', () => {
  it('renders an anchor tag', async () => {
    const {
      container
    } = await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      "data-testid": "anchor"
    }));
    expect(container.firstElementChild.tagName).toEqual('A');
  });
  it('forwards provided href', async () => {
    const {
      container
    } = await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      href: "http://google.com"
    }));
    expect(container.firstElementChild.getAttribute('href')).to.equal('http://google.com');
  });
  it('ensures that a href is a hash if none provided', async () => {
    const {
      container
    } = await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, null));
    expect(container.firstElementChild.getAttribute('href')).toEqual('#');
  });
  it('forwards onClick handler', async () => {
    const handleClick = jest.fn();
    const {
      container
    } = await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      onClick: handleClick
    }));
    _reblendTestingLibrary.fireEvent.click(container.firstChild);
    expect(handleClick).toHaveBeenCalled();
  });
  it('provides onClick handler as onKeyDown handler for "space"', async () => {
    const handleClick = jest.fn();
    const {
      container
    } = await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      onClick: handleClick
    }));
    _reblendTestingLibrary.fireEvent.keyDown(container.firstChild, {
      key: ' '
    });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it('should call onKeyDown handler when href is non-trivial', async () => {
    const onKeyDownSpy = jest.fn();
    const {
      container
    } = await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      href: "http://google.com",
      onKeyDown: onKeyDownSpy
    }));
    _reblendTestingLibrary.fireEvent.keyDown(container.firstChild, {
      key: ' '
    });
    expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
  });
  it('prevents default when no href is provided', async () => {
    const handleClick = jest.fn();
    const {
      container,
      rerender
    } = await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      onClick: handleClick
    }));
    _reblendTestingLibrary.fireEvent.click(container.firstChild);
    await rerender(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      onClick: handleClick,
      href: "#"
    }));
    _reblendTestingLibrary.fireEvent.click(container.firstChild);
    expect(handleClick).toHaveBeenCalledTimes(2);
    expect(handleClick.mock.calls[0][0].isDefaultPrevented()).toEqual(true);
    expect(handleClick.mock.calls[1][0].isDefaultPrevented()).toEqual(true);
  });
  it('does not prevent default when href is provided', async () => {
    const handleClick = jest.fn();
    _reblendTestingLibrary.fireEvent.click(await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      href: "#foo",
      onClick: handleClick
    })).container.firstChild);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick.mock.calls[0][0].isDefaultPrevented()).toEqual(false);
  });
  it('forwards provided role', async () => {
    await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      role: "dialog"
    })).getByRole('dialog');
  });
  it('forwards provided role with href', async () => {
    await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      role: "dialog",
      href: "http://google.com"
    })).getByRole('dialog');
  });
  it('set role=button with no provided href', async () => {
    const wrapper = await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, null));
    wrapper.getByRole('button');
    await wrapper.rerender(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      href: "#"
    }));
    wrapper.getByRole('button');
  });
  it('sets no role with provided href', async () => {
    expect(await (0, _reblendTestingLibrary.render)(_reblendjs.default.construct.bind(this)(_Anchor.default, {
      href: "http://google.com"
    })).container.firstElementChild.hasAttribute('role')).toEqual(false);
  });
});