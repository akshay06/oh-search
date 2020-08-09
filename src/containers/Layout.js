import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import styles from './Layout.css';

const Layout = ({ children }) => {

  return (
    <Fragment>
      {/* GLOBAL THINGS LIKE LOADERS, POPUPS, ALERTS WILL COME HERE */}
      <div className={cx(styles.container)}>
        {children}
      </div>
    </Fragment>
  );
};

export default withRouter(Layout);
