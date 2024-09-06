export class NotFoundError extends Error {
  constructor() {
    super('404');
  }
}

export class UnexpectedLoaderError extends Error {
  constructor() {
    super('500');
  }
}
