import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import TestApp from './TestApp';

const render = (AppInstance) => {
  ReactDOM.render(
    <AppContainer>
      <AppInstance />
    </AppContainer>,
    document.getElementById('root'),
  );
};

if (module.hot) {
  module.hot.accept('./TestApp', () => {
    render(TestApp);
  });
}

render(TestApp);
