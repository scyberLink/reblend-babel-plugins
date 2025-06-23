import { render, fireEvent } from 'reblend-testing-library';
import Anchor from '../src/Anchor';
import Reblend from 'reblendjs';

describe('Anchor', () => {
  it('renders an anchor tag', async () => {
    const { container } = await render(<Anchor data-testid="anchor" />);
    
    expect(container.firstElementChild!.tagName).toEqual('A');
  });

  it('forwards provided href', async () => {
    const { container } = await render(<Anchor href="http://google.com" />);

    expect(container.firstElementChild!.getAttribute('href')!).to.equal(
      'http://google.com',
    );
  });

  it('ensures that a href is a hash if none provided', async () => {
    const { container } = await render(<Anchor />);

    expect(container.firstElementChild!.getAttribute('href')!).toEqual('#');
  });

  it('forwards onClick handler', async () => {
    const handleClick = jest.fn();

    const { container } = await render(<Anchor onClick={handleClick} />);

    fireEvent.click(container.firstChild!);

    expect(handleClick).toHaveBeenCalled();
  });

  it('provides onClick handler as onKeyDown handler for "space"', async () => {
    const handleClick = jest.fn();

    const { container } = await render(<Anchor onClick={handleClick} />);

    fireEvent.keyDown(container.firstChild!, { key: ' ' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should call onKeyDown handler when href is non-trivial', async () => {
    const onKeyDownSpy = jest.fn();

    const { container } = await render(
      <Anchor href="http://google.com" onKeyDown={onKeyDownSpy} />,
    );

    fireEvent.keyDown(container.firstChild!, { key: ' ' });

    expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
  });

  it('prevents default when no href is provided', async () => {
    const handleClick = jest.fn();

    const { container, rerender } = await render(
      <Anchor onClick={handleClick} />,
    );

    fireEvent.click(container.firstChild!);

    await rerender(<Anchor onClick={handleClick} href="#" />);

    fireEvent.click(container.firstChild!);

    expect(handleClick).toHaveBeenCalledTimes(2);
    expect(handleClick.mock.calls[0][0].isDefaultPrevented()).toEqual(true);
    expect(handleClick.mock.calls[1][0].isDefaultPrevented()).toEqual(true);
  });

  it('does not prevent default when href is provided', async () => {
    const handleClick = jest.fn();

    fireEvent.click(
      await render(<Anchor href="#foo" onClick={handleClick} />).container
        .firstChild!,
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick.mock.calls[0][0].isDefaultPrevented()).toEqual(false);
  });

  it('forwards provided role', async () => {
    await render(<Anchor role="dialog" />).getByRole('dialog');
  });

  it('forwards provided role with href', async () => {
    await render(<Anchor role="dialog" href="http://google.com" />).getByRole(
      'dialog',
    );
  });

  it('set role=button with no provided href', async () => {
    const wrapper = await render(<Anchor />);

    wrapper.getByRole('button');

    await wrapper.rerender(<Anchor href="#" />);

    wrapper.getByRole('button');
  });

  it('sets no role with provided href', async () => {
    expect(
      await render(
        <Anchor href="http://google.com" />,
      ).container.firstElementChild!.hasAttribute('role'),
    ).toEqual(false);
  });
});
