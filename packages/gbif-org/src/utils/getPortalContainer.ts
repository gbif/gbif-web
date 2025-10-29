/**
 * Gets the appropriate container for portaling components (Select, Popover, DropdownMenu, etc.)
 * to ensure they are rendered within dialogs/drawers when present.
 *
 * This function checks for container classes in order of priority:
 * 1. `.dialog-popover-container` - for dialog/modal containers
 * 2. `.drawer-popover-container` - for drawer containers
 * 3. Falls back to `document.body` if neither is found
 *
 * @returns The HTMLElement container to use for portaling, or undefined on server-side
 */
export function getPortalContainer(): HTMLElement | undefined {
  if (typeof window === 'undefined') return undefined;
  return (
    document.querySelector<HTMLElement>('.dialog-popover-container') ??
    document.querySelector<HTMLElement>('.drawer-popover-container') ??
    document.body
  );
}
