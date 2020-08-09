import { createLogger } from 'redux-logger';
import { createStore } from 'easy-peasy';
import search from 'store/models/search';

const store = createStore(
  {
    search
  },
  {
    middleware: [],
  }
);

export default store;
