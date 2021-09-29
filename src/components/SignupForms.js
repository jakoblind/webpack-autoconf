import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as styles from '../styles.module.css';

/* DRIP form. currently not in use. */
// eslint-disable-next-line
const SignupForm = ({ buttonText, buttonStyle, signupText, dripId }) => (
  <div className={styles.signupFormArea}>
    <form
      action={`https://www.getdrip.com/forms/${dripId}/submissions`}
      method="post"
      data-drip-embedded-form={dripId}
    >
      <div>
        <input
          autoFocus
          className={styles.signupField}
          placeholder="Your Email"
          type="email"
          id="drip-email"
          name="fields[email]"
        />
      </div>
      <div>
        <input
          className={styles.signupField}
          placeholder="Your Name"
          type="text"
          id="drip-first-name"
          name="fields[first_name]"
        />
      </div>
      <div className={styles.signupButtonArea}>
        <input
          className={buttonStyle || styles.myButton}
          type="submit"
          value={buttonText}
          data-drip-attribute="sign-up-button"
        />
        <br />
        {signupText}
      </div>
    </form>
  </div>
);

SignupForm.propTypes = {
  buttonText: PropTypes.string,
  buttonStyle: PropTypes.string,
  signupText: PropTypes.string,
  dripId: PropTypes.string.isRequired,
};

SignupForm.defaultProps = {
  buttonText: 'Send Me Lesson 1',
  buttonStyle: '',
  signupText: '',
};

function ConvertKitSignupForm({
  children,
  buttonText,
  buttonStyle,
  signupText,
  formId = '915821',
  tags,
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const clearError = () => {
    if (email !== '' && name !== '') {
      setErrorMessage('');
    }
  };

  const onSubmit = e => {
    if (email === '' || name === '') {
      setErrorMessage('Please no empty inputs');
      e.preventDefault();
    }
  };
  return (
    <div className={styles.signupFormArea}>
      <form
        onSubmit={onSubmit}
        method="post"
        action={`https://app.convertkit.com/forms/${formId}/subscriptions`}
      >
        {children}
        <div className={styles.signupFormValidationError}>{errorMessage}</div>
        <div>
          <input
            className={styles.signupField}
            onChange={e => {
              clearError();
              setEmail(e.target.value);
            }}
            style={
              errorMessage && email === '' ? { border: '1px solid red' } : {}
            }
            autoFocus
            placeholder="Your Email"
            name="email_address"
            type="email"
          />
        </div>
        <div>
          <input
            className={styles.signupField}
            onChange={e => {
              clearError();
              setName(e.target.value);
            }}
            style={
              errorMessage && name === '' ? { border: '1px solid red' } : {}
            }
            name="first_name"
            placeholder="Your Name"
          />
        </div>
        {tags ? (
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
        ) : (
          <div />
        )}
        <input type="hidden" name="api_key" value="qEqWamI6-oY7MOPZSU7qfw" />
        <div className={styles.signupButtonArea}>
          <input
            className={buttonStyle || styles.myButton}
            type="submit"
            value={buttonText || 'Send Me Lesson 1'}
          />
          <br />
          {signupText}
        </div>
      </form>
    </div>
  );
}

ConvertKitSignupForm.propTypes = {
  buttonText: PropTypes.string,
  buttonStyle: PropTypes.string,
  signupText: PropTypes.string,
  formId: PropTypes.string.isRequired,
  tags: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

ConvertKitSignupForm.defaultProps = {
  buttonText: 'Send Me Lesson 1',
  buttonStyle: '',
  signupText: '',
  children: [],
};

export function withHidden(WrappedComponent, text) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hidden: true };
      this.show = this.show.bind(this);
    }

    show() {
      this.setState({ hidden: false });
    }

    render() {
      return (
        <div>
          {this.state.hidden ? (
            <button className={styles.link} onClick={this.show}>
              {text}
            </button>
          ) : (
            <WrappedComponent {...this.props} />
          )}
        </div>
      );
    }
  };
}

export const SampleChapterSignupForm = ({ buttonText }) => (
  <ConvertKitSignupForm
    buttonText={buttonText || 'Send me a sample chapter'}
    buttonStyle={styles.blueButton}
    signupText="You'll also get articles related to webpack and JavaScript once or twice per month"
    formId="918254"
  />
);

SampleChapterSignupForm.propTypes = {
  buttonText: PropTypes.string,
};

SampleChapterSignupForm.defaultProps = {
  buttonText: 'Send me a sample chapter',
};

export const GenericSignupForm = ({ buttonText }) => (
  <ConvertKitSignupForm buttonText={buttonText} formId="931959" />
);

GenericSignupForm.propTypes = {
  buttonText: PropTypes.string,
};

GenericSignupForm.defaultProps = {
  buttonText: 'Sign up',
};

export const CourseSignupForm = ({ buttonText, tags }) => (
  <ConvertKitSignupForm buttonText={buttonText} formId="917789" tags={tags} />
);

CourseSignupForm.propTypes = {
  buttonText: PropTypes.string,
  tags: PropTypes.number.isRequired,
};

CourseSignupForm.defaultProps = {
  buttonText: 'Sign up',
};
