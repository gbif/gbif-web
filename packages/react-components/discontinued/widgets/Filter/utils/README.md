# Filters
Hvordan vil jeg gerne bruge dem.

```
// filterbar.js
<div>
  <TaxonFilter />
</div>

// TaxonFilter.js
const config = {...};
export const TaxonFilter = props => {
  return <SuggestFilter config={config}>
}

const buttonConfig = {...};
export TaxonFilterButton = props => {
  return <FilterButton config={buttonConfig}>
}

export {
  Trigger, // the button that will show the filter onClick
  Content, // the content (should be usable in other places than the popover).
           // Does not update the filters
  Popover  // the popover (that takes a trigger as a child) and opens a popover and update filters
}

```

jeg har brug for 
`<TaxonFilterButton />` + 
`<TaxonFilterPopover> <MyTrigger /> </TaxonFilterPopover>` og evt også





NOTES

## Creating a new filter
NB: This is not intended as instructions for how to configure a new filter as a library consumer, but rather how to develop new filters from scratch with full freedom.

To create a new filter, you need to create and edit a few files

*How to map your filter to a data query*
`packages/react-components/src/search/OccurrenceSearch/api/queryAdapter/compose.js` to define how your new filterName and values are mapped to a query.

*Human readable labels*
You also need to define what the filter is called and how it is pluralized.

*Create a UI for editing the filter*
You probably also want to add a component to edit the filter. A new filter need to align to a specific interface.

*Interface*
Your filter component will be shown in popups or inline in drawers. 
It will recieve following props

In the filterbar, we need a button to start editing. You need to provide a components. It will receive 2 props: `theme` and `currentFilter`

## Components to help you build filters
It is nice if filters look familiar. To help there is a bunch of components to wrap and edit data.



