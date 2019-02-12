import React from 'react'
import styles from '../styles.module.css'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import { CourseSignupForm } from '../components/SignupForms'

export default () => {
  return (
    <Layout title="Bundle optimize helper">
      <div className={styles.webpackConfigContainer}>
          <h1 className={styles.large}>Time to learn webpack properly</h1>
        <p>
            Why do you need both a <code>.babelrc</code> file <i>and</i> a
          <code> webpack.config.js</code> file? What's the difference between babel and webpack?
        </p>

        <p>And why should you put CSS and images in the bundle? Isn't the bundle supposed to be a JavaScript file?</p>

        <h3>Free webpack email course</h3>
        <p>
          With this email course you'll start with a clean slate and you will learn step-by-step how to build a complete webpack app. Coding yourself is the best way to learn webpack.
        </p>
        <p>
          You will be using industry best practices and latest version of
          webpack (version 4).
        </p>

        <div className={styles.sectionsContainer}>
          <div className={styles.sectionsLeft}>
            <p>You get 5 emails in 5 days.</p>
            <ul>
              <li>Lesson 1: What does webpack do? (an overview)</li>
              <li>Lesson 2: Create your first webpack project</li>
              <li>Lesson 3: The webpack.config.js and Babel</li>
              <li>Lesson 4: Create a React app with webpack</li>
              <li>Lesson 5: Styling with webpack</li>
            </ul>
          </div>
          <img src={require('../../images/email-course.jpg')} />
        </div>
        <p>
          Level up your frontend skills and become a more solid, all-round
          frontend dev.
        </p>
        <CourseSignupForm />
        <h3>What are others saying about the course? </h3>
        <img
          className={styles.shadow}
          src={require('../../images/email-course-feedback1.png')}
        />
      </div>
    </Layout>
  )
}
