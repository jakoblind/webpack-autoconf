import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { Link } from 'gatsby'
import styles from '../styles.module.css'
import './layout.css'

const Header = () => {
  return (
    <div className={styles.header}>
      <Link to="/">webpack config tool</Link>
      <Link to="/optimize">Bundle optimizer</Link>
      <Link to="/course">Free webpack course</Link>
      <Link to="/book">webpack book</Link>
      <Link to="/about">About</Link>
    </div>
  )
}

const Layout = ({ children, title, metaDescription }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={title || data.site.siteMetadata.title}
          meta={[
            {
              name: 'description',
              content: metaDescription || data.site.siteMetadata.description,
            },
            {
              name: 'google-site-verification',
              content: 'UOjML_KiDFBKebmkb_ybTNcwQaEq3DIW-f7EIzCFo08',
            },
          ]}
        >
          <script async defe src="https://buttons.github.io/buttons.js" />
          <script
            type="text/javascript"
            src="https://transactions.sendowl.com/assets/sendowl.js"
          />

          <html lang="en" />
        </Helmet>

        <div>
          <Header />
          {children}
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
