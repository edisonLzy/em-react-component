import { useState } from 'react';

import Button from '../../packages/em-button/src';
import Wave from '../../packages/em-wave/src';
import '../../packages/styles/index.less';
function App() {
  const [count, setCount] = useState(0);

  return (
    <Wave>
      <Button type="primary">按钮</Button>
    </Wave>
  );
}

export default App;
