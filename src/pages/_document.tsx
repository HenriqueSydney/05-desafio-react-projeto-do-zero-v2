import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ReactElement } from 'react';

export default class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Nunito+Sans&display=swap"
            rel="stylesheet"
          />

          <link rel="shortcut icon" href="favicon.png" type="image/x-icon" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
