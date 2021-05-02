import * as React from 'react';
import { render } from 'react-dom';
import Options from './components/optionsApp/app';

(() => {
  const element = document.getElementById('options-app');
  if (element) {
    const app = <Options />;
    render(app, element);
  }
})();
