import Swiper, { SwiperItem } from '../../packages/em-swiper/src';
import '../../packages/em-swiper/style/index.less';
import './index.less';
function App() {
  return (
    <div className="main">
      <Swiper>
        <SwiperItem>1</SwiperItem>
        <SwiperItem>2</SwiperItem>
        <SwiperItem>3</SwiperItem>
      </Swiper>
    </div>
  );
}

export default App;
