module.exports = {
  siteMetadata: {
    title: 'createapp - webpack/Parcel/Snowpack boilerplate generator',
    description:
      'Frontend app generator. Create webpack config, Parcel app or Snowpack with React, Vue, Svelte, Typescript, babel, css modules, CSS, SASS, less, code splitting',
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
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        generateMatchPathRewrites: true, // boolean to turn off automatic creation of redirect rules for client only paths
      },
    },
  ],
};
