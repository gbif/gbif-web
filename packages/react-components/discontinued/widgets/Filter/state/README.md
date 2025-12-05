# Filter state
A context to hold filter state. You can of course build your own, but the thinking is that all our search interfaces will need something very alike and similar to the GBIF APIv1 - that is filters with AND between fields and OR within fields.

```
basisOfRecord: humanObservation OR machineObservation
AND
taxonKey: 2 OR 5
AND
...
```

This simple context object provide a way to do just that. And a filter2predicate function to transform it into the predicate structure used by the UI API wrapper.