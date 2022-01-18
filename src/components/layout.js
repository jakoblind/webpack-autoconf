import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';

import * as styles from '../styles.module.css';

import config from '../config';

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>
        <Link href="/">
          <a className="header-link">Create App</a>
        </Link>
      </h1>
      <h2 className="main-subheader">Frontend build config generator</h2>
    </div>
  );
};

const Layout = ({ children, title, metaDescription, hideHeader }) => (
  <>
    <Head>
      <title>{title || config.title}</title>
      <meta
        name="description"
        content={metaDescription || config.description}
      />
      <meta
        name="google-site-verification"
        content="UOjML_KiDFBKebmkb_ybTNcwQaEq3DIW-f7EIzCFo08"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inconsolata"
        rel="stylesheet"
      />

      <script async defer src="https://buttons.github.io/buttons.js" />
      <script
        async
        defer
        type="text/javascript"
        src="https://transactions.sendowl.com/assets/sendowl.js"
      />
      <html lang="en" />
    </Head>

    {hideHeader ? null : <Header />}
    <div>{children}</div>
    <footer>
      <br />
      <br />
      <br />
      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-around`,
          listStyle: `none`,
          color: 'black',
          maxWidth: '517px',
          margin: 'auto',
        }}
      >
        <li>
          <Link href="/webpack-course">
            <a>Free webpack course</a>
          </Link>
        </li>
        <Link href="/webpack-book">
          <a>Webpack book</a>
        </Link>
        <a href="http://blog.jakoblind.no/webpack/">Articles</a>
        <Link href="/about">
          <a>About</a>
        </Link>
      </ul>
      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-around`,
          listStyle: `none`,
          color: 'black',
          width: '390px',
          margin: '30px auto',
        }}
      >
        <li>
          <a href="https://twitter.com/karljakoblind">Twitter</a>
        </li>
        <li>
          <a href="https://spectrum.chat/createapp-dev">Community</a>
        </li>

        <li>
          <a href="https://github.com/jakoblind">GitHub</a>
        </li>
        <li>
          <a
            className="github-button"
            href="https://github.com/jakoblind/webpack-autoconf/issues"
            aria-label="Issue jakoblind/webpack-autoconf on GitHub"
          >
            Issue
          </a>
        </li>
      </ul>
    </footer>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  metaDescription: PropTypes.string,
};

Layout.defaultProps = {
  title: '',
  metaDescription: '',
};

export default Layout;
