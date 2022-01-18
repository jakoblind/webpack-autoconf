import React from 'react';
import Layout from '../../components/layout';
import { Configurator } from '../../components/Configurator';
import { useRouter } from 'next/router';

const App = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <Layout>
      <Configurator urlId={slug && slug[0]} selectedStartTab={'webpack'} />
    </Layout>
  );
};

export default App;
