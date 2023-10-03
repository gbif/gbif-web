// This object is a mapping between the content types from ElasticSearch and the GraphQL types
// The keys are the content types from ElasticSearch and the values are the GraphQL types
// All types in this object are result options in the resource search
export const SEARCH_RESULT_OPTIONS = Object.freeze({
    dataUse: 'DataUse',
    event: 'Event',
    notification: 'Notification',
    news: 'News',
    project: 'GbifProject',
    composition: 'Composition',
    call: 'Call',
    tool: 'Tool',
    document: 'GbifDocument',
    article: 'Article',
    help: 'Help',
    literature: 'Literature',
    // organisation: 'Organization',
});