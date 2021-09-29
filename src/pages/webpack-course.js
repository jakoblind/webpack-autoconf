import React from 'react';
import * as styles from '../styles.module.css';
import Layout from '../components/layout';
import { CourseSignupForm } from '../components/SignupForms';
import feedbackImg from '../../images/email-course-feedback1.png';
import emailCourseImg from '../../images/email-course.jpg';

export default () => {
  return (
    <Layout title="Free webpack course">
      <div className={styles.webpackConfigContainer}>
        <h1 className={styles.large}>Time to learn webpack properly</h1>
        <p>
          Why do you need both a <code>.babelrc</code> file <i>and</i> a
          <code> webpack.config.js</code> file? What's the difference between
          babel and webpack?
        </p>

        <p>
          And why should you put CSS and images in the bundle? Isn't the bundle
          supposed to be a JavaScript file?
        </p>

        <h2>Free webpack email course</h2>
        <p>
          With this email course you'll start with a clean slate and you will
          learn step-by-step how to build a complete webpack app. Coding
          yourself is the best way to learn webpack.
        </p>
        <p>
          You will be using industry best practices and latest version of
          webpack (version 4).
        </p>
        <h3>Here is what people are saying about the course: </h3>
        <img
          alt="webpack email course feedback"
          className={styles.shadow}
          src={feedbackImg}
        />
        <p>
          <i>
            "It helped to learn/solidify very important concepts about webpack"
          </i>
        </p>
        <p>
          <i>
            "Great introduction, understood quite some things about webpack for
            the first time."
          </i>
        </p>
        <h3>Learn the basics of webpack in less than a week</h3>
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
          <img alt="webpack email course" src={emailCourseImg} />
        </div>
        <p>
          Level up your frontend skills and become a more solid, all-round
          frontend dev. Get started right now, the first lesson takes only 10
          minutes to complete.
        </p>
        <CourseSignupForm />
        <br />
      </div>
    </Layout>
  );
};
