import { Children, forwardRef, isValidElement, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Тонкие разделители между пунктами. */
  dividers?: boolean;
}

export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { dividers, className, children, ...rest },
  ref,
) {
  return (
    <ul ref={ref} {...rest} className={cx('vui-list', dividers && 'vui-list--dividers', className)}>
      {Children.map(children, (child) =>
        isValidElement(child) ? <li className="vui-list__row">{child}</li> : child,
      )}
    </ul>
  );
});
