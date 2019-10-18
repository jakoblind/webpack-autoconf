import React from 'react';
import Layout from '../components/layout';
import styles from '../styles.module.css';

function App(props) {
  return (
    <Layout title="Thank you for signing up!">
      <div className={styles.webpackConfigContainer}>
        <h1 className={styles.large}>Thank you for signing up!</h1>
        <p>Good stuff will be delivered straight to your inbox.</p>
      </div>
    </Layout>
  );
}

export default App;
