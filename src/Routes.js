import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import * as constants from 'constants';

import Layout from 'containers/Layout';
import Home from 'containers/Home';

export default class Routes extends Component {
  render() {
    return (
      <Layout>
        <Switch>
          <Route path={'/'} component={Home} />
        </Switch>
      </Layout>
    );
  }
}
