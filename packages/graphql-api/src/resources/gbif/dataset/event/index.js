// eslint-disable-next-line import/prefer-default-export
export const getDatasetEvents = async (
  parent,
  { key: datasetKey, limit, offset, eventID, optParentEventID },
  { dataSources },
) => {
  const query = {
    predicate: {
      type: 'and',
      predicates: [
        {
          type: 'equals',
          key: 'datasetKey',
          value: datasetKey,
        },
      ],
    },
    size: 1,
    from: 0,
    metrics: {
      facet: {
        type: 'facet',
        key: 'eventId',
        size: limit + 1,
        from: offset,
      },
    },
  };
  if (optParentEventID) {
    query.predicate.predicates.push({
      type: 'equals',
      key: 'parentEventId',
      value: optParentEventID,
    });
  }
  if (eventID) {
    query.predicate.predicates.push({
      type: 'equals',
      key: 'eventId',
      value: eventID,
    });
  }
  // console.log(JSON.stringify(query, null, 2));
  const occurrences = await dataSources.occurrenceAPI.searchOccurrences({
    query,
  });

  return {
    limit,
    offset,
    endOfRecords: occurrences.aggregations.facet.buckets.length < limit,
    results: occurrences.aggregations.facet.buckets.map((e) => ({
      eventId: e.key,
      occurrenceCount: e.doc_count,
      firstOccurrence: dataSources.occurrenceAPI
        .searchOccurrences({
          query: {
            size: 1,
            from: 0,
            predicate: {
              type: 'and',
              predicates: [
                ...query.predicate.predicates,
                { type: 'equals', key: 'eventId', value: e.key },
              ],
            },
          },
        })
        .then((res) => {
          return res.documents.results[0];
        }),
    })),
  };
};

export const getDatasetEventCount = async (parent, args, { dataSources }) => {
  const { optParentEventID } = args;
  const query = {
    predicate: {
      type: 'and',
      predicates: [
        {
          type: 'equals',
          key: 'datasetKey',
          value: parent.key,
        },
      ],
    },
    size: 1,
    from: 0,
    metrics: {
      facet: {
        type: 'facet',
        key: 'eventId',
        size: 100001,
        from: 0,
      },
    },
  };
  if (optParentEventID) {
    query.predicate.predicates.push({
      type: 'equals',
      key: 'parentEventId',
      value: optParentEventID,
    });
  }
  const occurrences = await dataSources.occurrenceAPI.searchOccurrences({
    query,
  });
  return occurrences.aggregations.facet.buckets.length;
};
