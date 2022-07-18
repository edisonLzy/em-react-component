import { CSSProperties, FC, Children, useMemo, useRef } from 'react';
import cls from 'classnames';
interface SwiperProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: CSSProperties;
  /**
   * 是否自动播放
   */
  autoplay?: boolean;
  /**
   * 切换时间
   */
  duration?: number;
  /**
   * 默认显示第几张
   */
  nowIndex?: number;
}
const Swiper: FC<SwiperProps> = ({
  children,
  className = '',
  style: customStyle = {},
}) => {
  const swiperRef = useRef<HTMLDivElement>(null);
  const filterChildren = useMemo(() => {
    // 过滤掉无效的 children
    return Children.toArray(children).filter((child: any) => {
      const { type } = child;
      const isSwiperItem =
        typeof type === 'function' && type.name === 'SwiperItem';
      return isSwiperItem;
    });
  }, [children]);
  const renderChildren = useMemo(() => {
    const { length } = filterChildren;
    // 格式化 children
    const first = filterChildren[length - 1];
    const last = filterChildren[0];
    const displayArr = [first, ...filterChildren, last];
    return displayArr;
  }, [filterChildren]);
  return (
    <div
      ref={swiperRef}
      style={customStyle}
      className={cls('swiper', className)}
    >
      <div
        style={{
          width: renderChildren.length * swiperRef.current!.offsetWidth,
        }}
        className="swiper-main"
      >
        {renderChildren}
      </div>
    </div>
  );
};
export default Swiper;
