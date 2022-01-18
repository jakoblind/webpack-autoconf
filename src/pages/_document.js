import Document, { Html, Head, Main, NextScript } from 'next/document';
import config from '../config';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="google-site-verification"
            content="UOjML_KiDFBKebmkb_ybTNcwQaEq3DIW-f7EIzCFo08"
          />
          <script async defer src="https://buttons.github.io/buttons.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
