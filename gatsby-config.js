module.exports = {
  siteMetadata: {
    title: 'Webpack config tool',
    description:
      'Webpack config tool - create your own webpack config with React, Vue, Typescript and other libraries',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
      },
    },
    'gatsby-plugin-remove-serviceworker',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-43679645-5',
        head: false,
        // Avoids sending pageview hits from custom paths
        exclude: ['/preview/**', '/do-not-track/me/too/'],
      },
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: './images/favicon.png',
      },
    },
    {
      resolve: `gatsby-plugin-drip-widget`,
      options: {
        account: '8328291',
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
    },
  ],
}
