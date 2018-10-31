import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Demo from './src/Demo';

const render = (AppInstance) => {
  ReactDOM.render(
    <AppContainer>
      <AppInstance />
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(Demo);

if (module.hot) {
  module.hot.accept('./src/Demo', () => {
    render(Demo);
  });
}
