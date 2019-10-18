import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

const Header = ({ siteTitle }) => (
  <div>
    <div>
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </div>
);

Header.propTypes = {
  siteTitle: PropTypes.string.isRequired,
};

export default Header;
