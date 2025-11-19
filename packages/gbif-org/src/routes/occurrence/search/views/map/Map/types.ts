import { Theme } from '@/config/theme/theme';

/**
 * Configuration for a single occurrence overlay layer
 */
export type OccurrenceOverlay = {
  /** Unique identifier for the overlay, typically the predicateHash */
  id: string;

  /** The predicate hash for the occurrence query */
  predicateHash: string;

  /** Optional query string parameter */
  q?: string;

  /** Custom styling for this overlay */
  style?: {
    /** Custom color palette for density visualization */
    colors?: string[];

    /** Opacity for the layer (0-1) */
    opacity?: number;

    /** Circle radius stops for different density levels */
    radiusStops?: [number, number][];
  };

  /** Z-index for layer ordering (higher = on top) */
  zIndex?: number;
};

/**
 * Props for overlay management in map components
 */
export type OverlayProps = {
  /** Array of overlay configurations to render */
  overlays: OccurrenceOverlay[];

  /** Theme for default styling */
  theme?: Partial<Theme>;

  /** Callback when a predicate needs to be registered */
  registerPredicate?: (predicateHash: string) => void;

  /** Callback when a tile fails to load */
  onTileError?: () => void;
};
