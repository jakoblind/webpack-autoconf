import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const Header = ({ siteTitle }) => (
  <div>
    <div>
      <h1 style={{ margin: 0 }}>
        <Link
          href="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          <a>{siteTitle}</a>
        </Link>
      </h1>
    </div>
  </div>
);

Header.propTypes = {
  siteTitle: PropTypes.string.isRequired,
};

export default Header;
