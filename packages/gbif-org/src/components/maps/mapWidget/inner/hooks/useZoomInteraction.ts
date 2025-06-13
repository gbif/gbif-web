import type Map from 'ol/Map';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import { useEffect } from 'react';

type Args = {
  map?: Map;
  isFullScreen: boolean;
};

export function useZoomInteraction({ map, isFullScreen }: Args) {
  useEffect(() => {
    if (!map) return;

    const zoomInteraction = createZoomInteraction(map.getTargetElement()!, isFullScreen);

    map.addInteraction(zoomInteraction);

    return () => {
      map.removeInteraction(zoomInteraction);
    };
  }, [map, isFullScreen]);
}

// Our custom zoom interaction that only allows zooming when we determine that the user wants to zoom.
// The default zoom interaction will zoom when the user tries to scroll past the map.
export function createZoomInteraction(
  mapElement: HTMLElement,
  // Zoom should always be enabled when the map is in fullscreen mode
  isFullScreen: boolean
): MouseWheelZoom {
  let disableZoomTimer: number | undefined;
  let zoomOnScroll = false;
  mapElement.addEventListener('click', function () {
    zoomOnScroll = true;
  });
  mapElement.addEventListener('doubleclick', function () {
    zoomOnScroll = true;
  });
  mapElement.addEventListener('mouseleave', function () {
    disableZoomTimer = window.setTimeout(function () {
      zoomOnScroll = false;
    }, 2500);
  });
  mapElement.addEventListener('mouseenter', function () {
    if (disableZoomTimer) {
      window.clearTimeout(disableZoomTimer);
      disableZoomTimer = undefined;
    }
  });

  const zoomInteraction = new MouseWheelZoom({
    condition: (event) => {
      // Distinguish between scroll and pinch events
      // We allways allow pinch events because they are intentional zoom events
      const isPinch = event.originalEvent instanceof WheelEvent && event.originalEvent.ctrlKey;

      // If we are allready interacting with the map we might as well allow all zoom events
      if (isPinch) zoomOnScroll = true;

      return isPinch || isFullScreen || zoomOnScroll;
    },
  });

  return zoomInteraction;
}
