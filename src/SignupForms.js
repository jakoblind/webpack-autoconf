import React from 'react'
import styles from './styles.module.css'

export const SignupForm = ({ buttonText, dripId }) => (
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
          className={styles.myButton}
          type="submit"
          value={buttonText || 'Send Me Lesson 1'}
          data-drip-attribute="sign-up-button"
        />
      </div>
    </form>
  </div>
)

export const GenericSignupForm = ({ buttonText }) => (
  <SignupForm buttonText={buttonText} dripId={'81916834'} />
)

export const CourseSignupForm = ({ buttonText }) => (
  <SignupForm buttonText={buttonText} dripId={'138671466'} />
)
