module.exports = {
  siteMetadata: {
    title:
      'Create App - your tool for starting a new webpack or Parcel project',
    description:
      'Create your own webpack config or Parcel app with React, Vue, Typescript, CSS, SCSS, SASS, less, codesplitting, etc, with this online tool',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'createapp.dev',
        short_name: 'createapp',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: `${__dirname}/images/favicon.png`,
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-43679645-5',
        head: false,
        // Avoids sending pageview hits from custom paths
        exclude: ['/preview/**', '/do-not-track/me/too/'],
      },
    },
  ],
};
