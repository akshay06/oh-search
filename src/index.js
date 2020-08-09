import '@babel/polyfill';
import 'theme/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

const render = () => {
  ReactDOM.render(<Root />, document.getElementById('root'));
};

render();
