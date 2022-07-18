import { FC } from 'react';
export interface SwiperItemProps {}
const SwiperItem: FC<SwiperItemProps> = ({ children }) => {
  return <div className="swiper-item">{children}</div>;
};

export default SwiperItem;
