import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import store from './store';

class Root extends Component {
  render() {
    return (
      <StoreProvider store={store}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </StoreProvider>
    );
  }
}

export default hot(Root);
