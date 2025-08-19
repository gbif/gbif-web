export class NotFoundError extends Error {
  constructor() {
    super('404');
  }

  status = 404;
}

// NotFoundLoaderResponse is preferred to NotFoundError if it is possible to determine that there is a 404 error already in the loader.
// react-router-dom can catch the error in the loader and still successfully server-side render the page.
// If the NotFoundError is thrown during rendering, the server will fall back to client-side rendering
// as ReactDOMServer.renderToString doesn't support error boundaries.
export class NotFoundLoaderResponse extends Response {
  constructor(message?: string) {
    super(message, { status: 404 });
  }
}

export class UnexpectedLoaderError extends Response {
  constructor(message?: string) {
    super(message, { status: 500 });
  }
}
