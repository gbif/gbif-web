type Newable<T> = { new (...args: any[]): T };

abstract class GbifEvent extends Event {
  dispatch() {
    // Window is not defined on the server
    if (typeof window === 'undefined') return;
    window.dispatchEvent(this);
  }

  static addEventListener<T extends Event>(CustomEventClass: Newable<T>) {
    return (eventHandler: (event: T) => void) => {
      const listner = (event: Event) => {
        if (event instanceof CustomEventClass === false) return;
        eventHandler(event);
      };

      window.addEventListener(CustomEventClass.name, listner);
      return () => window.removeEventListener(CustomEventClass.name, listner);
    };
  }
}

export class StartLoadingEvent extends GbifEvent {
  name = 'gbif-start-loading';

  constructor(public routeId: string) {
    super(StartLoadingEvent.name);
  }

  static listen = GbifEvent.addEventListener(StartLoadingEvent);
}

export class NavigationCompleteEvent extends GbifEvent {
  name = 'gbif-navigation-complete';

  constructor() {
    super(NavigationCompleteEvent.name);
  }

  static listen = GbifEvent.addEventListener(NavigationCompleteEvent);
}

export class AbortLoadingEvent extends GbifEvent {
  name = 'gbif-abort-loading';

  constructor() {
    super(AbortLoadingEvent.name);
  }

  static listen = GbifEvent.addEventListener(AbortLoadingEvent);
}
