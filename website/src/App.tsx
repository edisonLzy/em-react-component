import { useState } from 'react';

import Button from '../../packages/em-button/src';
import Wave from '../../packages/em-wave/src';
import '../../packages/styles/index.less';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Wave>
        <Button type="primary">按钮</Button>
      </Wave>

      <Wave>
        <div
          style={{
            width: '20px',
            height: '20px',
            background: '#f53f3f',
          }}
        ></div>
      </Wave>

      <Wave>
        <div
          style={{
            width: '20px',
            height: '20px',
            background: '#4e5969',
          }}
        ></div>
      </Wave>
    </>
  );
}

export default App;
