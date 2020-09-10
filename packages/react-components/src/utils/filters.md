# How to add a new filter (another of a type)
Since there are many filters, we reuse components and build them from configuration.
Writing them individually seemed overwhelming and difficult to maintain, though easier to read.

Adding a filter also mean that you have to tell us:
* How to query for that value (what is the API predicate)
* How to translate it in various places (filter names, counts etc)
* How should the filter trigger button behave
* How does the popup behave?
* How to trigger it from elsewhere?

## What are the parts in a filter
Filters are composed of 3 parts
* The content (name, menu, options, apply, cancel)
* The popup holding the filter
* A trigger button that shows the current filter and triggers the popup with the content

The seperation allow us to 
* have additional triggers (such as the little filter icon on the table headers)
* Use the filter content/options in more places. E.g. in the meta filter that search across filters. Or if we at a later time want to have a sidebar with all filters as we have it on the current gbif.org.

## Filter types
We have filter types. 
* A suggest filter (e.g. for datasets, publishers)
* An enum filter (e.g. for basis of record or licences)
* A range filter (e.g. year)
* A simple text input filter (free text search for keywords, with no suggest)

# how to add custom filters (a new type)