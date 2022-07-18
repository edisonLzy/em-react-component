import cls from 'classnames';
import type { PropsWithChildren } from 'react';
import '../style/index.less';
const baseClass = 'em-button';
interface InternalButtonProps {
  type: 'primary' | 'link' | 'normal';
}
export type ButtonProps = Partial<InternalButtonProps>;
export default function Button({
  children,
  type = 'normal',
}: PropsWithChildren<ButtonProps>) {
  const classes = cls(baseClass, {
    [`${baseClass}-${type}`]: type !== 'normal',
  });
  return (
    <button
      onClick={() => {
        console.log('xxx');
      }}
      className={classes}
    >
      {children}
    </button>
  );
}
