import React from 'react';
import Layout from '../components/layout';
import { Configurator } from '../components/Configurator';
import PropTypes from 'prop-types';

export class App extends React.Component {
  render() {
    return (
      <Layout>
        <Configurator selectedTab={'webpack'} />
      </Layout>
    );
  }
}

App.propTypes = {
  pageContext: PropTypes.shape({
    selectedTab: PropTypes.string,
  }),
};

App.defaultProps = {
  pageContext: {
    selectedTab: 'webpack',
  },
};

export default App;
