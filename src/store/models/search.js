import { action, thunk } from 'easy-peasy';
import { isEmpty } from 'lodash-es';

const initialState = {
  searchResults: [],
  start: 0,
  totalPages: 1
};

export default {
  ...initialState,

  getSearchResults: thunk((actions, payload) => {
    fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyCdAyM0BPNci5bzTAuRzDVkYLSvCPLKECI&cx=018264299595958242005:dvs2adlrsca&q=${payload.searchQuery}&start=${payload.start}`).then(resp => resp.json()).then((resp) => {
      if (!isEmpty(resp.items)) {
        actions.setSearchResults(resp);
      } else {
        actions.resetSearchResults();
      }
      return resp;
    });
  }),

  setSearchResults: action((state, payload) => {
    return {
      totalPages: Math.ceil(payload.queries.request[0].totalResults / 10),
      start: state.start + payload.items.length,
      searchResults: [
        ...payload.items
      ]
    };
  }),

  resetSearchResults: action((state, payload) => {
    return {
      searchResults: [],
      start: 0,
      totalPages: 1
    };
  }),
};
