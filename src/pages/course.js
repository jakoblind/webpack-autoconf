import React from 'react'
import styles from '../styles.module.css'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import { CourseSignupForm } from '../SignupForms'

export default () => {
  return (
    <Layout title="Bundle optimize helper">
      <div className={styles.webpackConfigContainer}>
        <h1 className={styles.large}>Time to learn webpack properly</h1>
        <p>
          You have clicked around in this tool for a while. But you still can't
          wrap your head around how webpack works.
        </p>
        <ul>
          <li>"What is the .babelrc file?"</li>
          <li>
            "What is a loader and what is a plugin? what's the difference?"
          </li>
          <li>"They want me to put CSS and images in the bundle?!"</li>
        </ul>

        <p>
          To learn webpack properly you must get your hands dirty and do the
          work. It's not enough to glance over some generated webpack configs.
        </p>

        <h3>Free webpack email course</h3>
        <p>Yes, it's a build tool. Yes, you need a course to learn it.</p>

        <p>
          With this email course you will learn webpack from the ground up.
          Using industry best practices. <i>And it's free!</i>
        </p>

        <p>You get 5 emails in 5 days.</p>
        <ul>
          <li>Lesson 1: What does webpack do? (an overview)</li>
          <li>Lesson 2: Create your first webpack project</li>
          <li>Lesson 3: The webpack.config.js and Babel</li>
          <li>Lesson 4: Create a React app with webpack</li>
          <li>Lesson 5: Styling with webpack</li>
        </ul>

        <p>
          Level up your frontend skills and become a more solid, all-round
          frontend dev. Sign up to get lesson 1 right now!
        </p>
        <CourseSignupForm />
      </div>
    </Layout>
  )
}
