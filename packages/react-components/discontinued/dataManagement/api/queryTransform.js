const isConfigObject = (customConfig) => customConfig?.hasOwnProperty(''); // Placeholder

// This is a placeholder function to handle custom queries.
// Currently, it just overrides the default query with a custom one (if provided),
// however, it will make the query transformations a bit easier
// in the future.
export const queryTransform = (query, queryConfig = {}, queryTag) => {
	const customConfig = queryConfig[queryTag];
	if (isConfigObject(customConfig)) {
		// Do some transformations here here
	} else if (typeof customConfig === 'string') {
		return customConfig; // Just override the query
	}

	// Return the original query
	return query;
}