interface Window {
  // Exposed so the hosted-portal configuration manager can list what a portal may enable.
  gbif?: {
    availableFilters?: string[];
    availableColumnOptions?: string[];
  };
}
