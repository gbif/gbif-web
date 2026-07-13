import React from 'react';

/**
 * Context that lets a Dialog/Drawer publish its content node so descendant
 * popovers, dropdowns, selects and toasts can portal into it instead of
 * `document.body`. This is needed because modal dialogs use `aria-hidden`
 * on body siblings; portaling into the dialog's content keeps popovers
 * accessible to screen readers.
 *
 * Components outside of any dialog/drawer get `null` from context and fall
 * back to `document.body`. This avoids the stale-reference bug that arose
 * when `document.querySelector('.drawer-popover-container')` was called
 * during the render that closed the drawer — the container would be
 * captured just before unmount, leaving the Portal pointing to a detached
 * DOM node.
 */
export const PortalContainerContext = React.createContext<HTMLElement | null>(null);

// Marker classes set by DialogBottomSheetContent and Drawer on their content nodes.
// Used to bridge the context across React root boundaries (see standaloneWrapper.tsx).
export const PORTAL_CONTAINER_SELECTOR = '.dialog-popover-container, .drawer-popover-container';

export function usePortalContainer(): HTMLElement | undefined {
  const fromContext = React.useContext(PortalContainerContext);
  if (fromContext) return fromContext;
  if (typeof window === 'undefined') return undefined;
  return document.body;
}
