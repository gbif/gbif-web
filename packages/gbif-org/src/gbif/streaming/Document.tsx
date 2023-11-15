import React from 'react';

type Props = {
  children: React.ReactElement;
};

export function Document({ children }: Props) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>GBIF</title>
      </head>
      <body>
        <div id="app">{children}</div>
      </body>
    </html>
  );
}
