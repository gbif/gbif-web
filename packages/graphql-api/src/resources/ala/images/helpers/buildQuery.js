const buildQuery = ({ facet, search, filters, size, from }) => {
  const params = new URLSearchParams();

  // Map schema names to API endpoint names
  if (facet) params.append('facet', facet);
  if (search) params.append('q', search);
  if (size) params.append('max', size);
  if (from) params.append('offset', from);

  // Add filter queries
  (filters || [])
    .filter((filter) => filter.length > 0)
    .forEach((filter) => params.append('fq', filter));

  return params.toString();
};

export default buildQuery;
