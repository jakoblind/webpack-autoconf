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
      <Link className={styles.logo} to="/">
        Create App
      </Link>
      <Link to="/webpack-course">Free webpack course</Link>
      <Link to="/webpack-book">Webpack book</Link>
      <a href="http://blog.jakoblind.no/">Articles</a>
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
          <script async defer src="https://buttons.github.io/buttons.js" />
          <script
            async
            defer
            type="text/javascript"
            src="https://transactions.sendowl.com/assets/sendowl.js"
          />

          <html lang="en" />
        </Helmet>

        <div>
          <Header />
          {children}
        </div>
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
              width: '200px',
              margin: 'auto',
            }}
          >
            <li>
              <a href="https://twitter.com/karljakoblind">Twitter</a>
            </li>
            <li>
              <a href="https://github.com/jakoblind">Github</a>
            </li>
          </ul>
        </footer>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
var _kiq = _kiq || []
;(function() {
  setTimeout(function() {
    var d = document,
      f = d.getElementsByTagName('script')[0],
      s = d.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = 'https://cl.qualaroo.com/ki.js/73453/h4f.js'
    f.parentNode.insertBefore(s, f)
  }, 1)
})()
export default Layout
