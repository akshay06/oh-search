import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Input.css';

export default class Input extends Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    onEnter: PropTypes.func,
    onKeyUp: PropTypes.func,
    label: PropTypes.string,
    id: PropTypes.string,
    props: PropTypes.object,
    invalid: PropTypes.bool,
    error: PropTypes.string,
  };

  static defaultProps = {
    classes: {},
    className: '',
    onEnter: null,
    onKeyUp: null,
    label: '',
    id: '',
    props: {},
    invalid: false,
    error: '',
  };

  handleKeyUp = (e) => {
    const { onEnter, onKeyUp } = this.props;

    if (onKeyUp) {
      onKeyUp(e);
    }

    if (e.keyCode === 13 && onEnter) {
      onEnter(e);
    }
  };

  render() {
    const {
      classes, className, onEnter, label, id, props, error, invalid, ...restProps
    } = this.props;

    return (
      <Fragment>
        {
          label && (
            <label
              className={cx(styles.label, classes.label)}
              htmlFor={id}
              {...props.labelProps}
            >
              {label}
            </label>
          )
        }
        <div className={cx(styles.inputWrapper, classes.inputWrapper)}>
          <input
            {...restProps}
            id={id}
            className={cx(styles.input, className, { [styles.inputError]: invalid })}
          />
          {
            invalid && (
              <div className={cx(styles.helperText, classes.helperText)}>{error}</div>
            )
          }
        </div>
      </Fragment>
    );
  }
}
