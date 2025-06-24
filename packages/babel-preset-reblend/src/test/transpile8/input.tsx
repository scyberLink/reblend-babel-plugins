import Reblend, { ComponentRef, MouseEventHandler } from 'reblendjs';
import { useContext } from 'reblendjs';
import { useEventCallback } from 'reblend-hooks';

import SelectableContext, { makeEventKey } from './SelectableContext';
import NavContext from './NavContext';

import { EventKey, DynamicComponent } from './types';
import Button from './Button';
import { dataAttr } from './DataKey';

export interface DropdownItemProps extends Reblend.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: Reblend.ElementType;

  /**
   * Highlight the menu item as active.
   */
  active?: boolean;

  /**
   * Disable the menu item, making it unselectable.
   */
  disabled?: boolean;

  /**
   * Value passed to the `onSelect` handler, useful for identifying the selected menu item.
   */
  eventKey?: EventKey;

  /**
   * HTML `href` attribute corresponding to `a.href`.
   */
  href?: string;

  ref?: ComponentRef;
}

interface UseDropdownItemOptions {
  key?: EventKey | null;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
}

/**
 * Create a dropdown item. Returns a set of props for the dropdown item component
 * including an `onClick` handler that prevents selection when the item is disabled
 */
export function useDropdownItem({
  key,
  href,
  active,
  disabled,
  onClick,
}: UseDropdownItemOptions) {
  const [onSelectCtx] = useContext(SelectableContext);
  const [navContext] = useContext(NavContext);

  const { activeKey } = navContext || {};
  const eventKey = makeEventKey(key, href);

  const isActive =
    active == null && key != null
      ? makeEventKey(activeKey) === eventKey
      : active;

  const handleClick = useEventCallback((event) => {
    if (disabled) return;

    onClick?.(event);

    if (onSelectCtx && !event.isPropagationStopped()) {
      onSelectCtx(eventKey, event);
    }
  });

  return [
    {
      onClick: handleClick,
      'aria-disabled': disabled || undefined,
      'aria-selected': isActive,
      [dataAttr('dropdown-item')]: '',
    },
    { isActive },
  ] as const;
}

const DropdownItem: DynamicComponent<
  typeof Button,
  DropdownItemProps
> = ({
  eventKey,
  disabled,
  onClick,
  active,
  as: Component = Button,
  ref,
  ...props
}: DropdownItemProps) => {
  const [dropdownItemProps] = useDropdownItem({
    key: eventKey,
    href: props.href,
    disabled,
    onClick,
    active,
  });

  return <Component {...props} ref={ref} {...dropdownItemProps} />;
};

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
