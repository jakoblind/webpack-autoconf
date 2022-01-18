import React from 'react';
import * as styles from '../styles.module.css';
import Layout from '../components/layout';
import { GenericSignupForm } from '../components/SignupForms';

export default function About() {
  return (
    <Layout title="Bundle optimize helper">
      <div className={styles.webpackConfigContainer}>
        <h1 className={styles.large}>About</h1>
        <h2>Who made this thing?</h2>
        <p>
          It's me, Jakob who made this. I write
          <a href="http://blog.jakoblind.no">a blog about React</a> that you
          might want to check out if you liked this! I am also on{' '}
          <a href="https://twitter.com/karljakoblind">twitter</a>.
        </p>
        <h2>Want more?</h2>
        <p>
          Want to be notified when I build more cool stuff like this? And also
          get early access to articles? Subscribe to my list:
        </p>
        <GenericSignupForm />
      </div>
    </Layout>
  );
}
