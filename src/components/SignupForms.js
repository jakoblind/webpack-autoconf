import React from 'react'
import styles from '../styles.module.css'

export const SignupForm = ({ buttonText, buttonStyle, signupText, dripId }) => (
  <div className={styles.signupFormArea}>
    <form
      action={`https://www.getdrip.com/forms/${dripId}/submissions`}
      method="post"
      data-drip-embedded-form={dripId}
    >
      <div>
        <input
          autoFocus="true"
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
          value={buttonText || 'Send Me Lesson 1'}
          data-drip-attribute="sign-up-button"
        />
        <br />
        {signupText}
      </div>
    </form>
  </div>
)

export function withHidden(WrappedComponent, text) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = { hidden: true }
      this.show = this.show.bind(this)
    }
    show() {
      this.setState({ hidden: false })
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
      )
    }
  }
}

export const SampleChapterSignupForm = ({ buttonText }) => (
  <SignupForm
    buttonText={buttonText || 'Send me a sample chapter'}
    buttonStyle={styles.blueButton}
    signupText="You'll also get articles related to webpack and JavaScript once or twice per month"
    dripId={'78049842'}
  />
)

export const GenericSignupForm = ({ buttonText }) => (
  <SignupForm buttonText={buttonText} dripId={'81916834'} />
)

export const CourseSignupForm = ({ buttonText }) => (
  <SignupForm buttonText={buttonText} dripId={'138671466'} />
)
