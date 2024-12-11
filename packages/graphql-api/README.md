# GraphQL API
Not a stable API that should be used for production systems outside GBIFS.

## Quick start
The `.env`-file should be placed in root and can be found in `gbif-configuration/gbif-web`.

Make sure you have the correct version on Node installed. We manage node versions with [nvm](https://github.com/nvm-sh/nvm). Type `nvm use` to install the required version. You can also do so manually, see `.nvmrc` for the required version.

```
npm install
```

Start developing with
```
npm run develop
```

It needs the [es-api](https://github.com/gbif/gbif-web/tree/master/packages/es-api) to start. Either running locally or pointing to a deployed version

## How deep to go
How far to resolve.
* On facets. Can you resolve the value to a title? For say datasetKey? how about enumeration keys to translations? Can you resolve to the full object? If so we need different schemas for each facet type.
* How much context is carried on? And how to do it.
  * I do an occurrence search for q=test and facet=basisOfRecord. Can I then breakdown each basisOfRecord by another facet? It should then carry its filter context and just add an additional parameter. How to do that. I currently add a custom _query field and modify that as you dig deeper.

## Custom endpoints
Should these be placed in the graphql project or elsewhere. I tend to say elsewhere, to keep this project cleaner. Examples of such endpoints:

* format a scientific name as html
* extract, parse and format verbatim data for treatment pages
* simulated sampling event API (less obvious)
* Literature API -- .i.e. will this project be composing ES queries?

## How to slice
Some data clearly belongs in the API, other less so, but nice to have there. And other is very UI specific. Some guidelines for how to decide might be nice. Example

* **Dataset contact order**. Dataset pages have a custom order of contacts, based on a long set of instructions from Dmitry. It is not in the APIs though. If we believe this is a meaningful and good way to present dataset contacts, should it then be in the API?

## Translations
How does these fit in? Are they a part of the API? Can I do
```
dataset(key:UUID) {
  type
  # some convention for getting the translation
  _translation {
    es {
      type
    }
  }
  # or
  _i18n_type {
    es
  }
}

# or even
dataset(key:UUID, locale:'es') {
  type
  _locale_type
}

# Translations as a seperate resource
# This seem less useful and unclear if you have to ask for individual fields
translations {
  es {
    datasetType
  }
}
```

*Including translations*

I can see a quality in having an API to expose translations. Currently they are somewhat hidden in CrowdIn. It is a community generated resource, but not publicly available in any useful way as far as I can see.

## Species or taxon
Should we rename the confusingly named species resource?

## "issues" with the REST API

### Filters over child resources
Instead of having `node/UUID/dataset` it would be nice to do `dataset/search?nodeKey=UUID`. This is more powerful as it allows facets, search etc.

### Clean up pluralization?
Our current API is mostly consistent, but not always. Should we correct or mirror existing endpoints?

### Entities differ from search to byKey
Search results differ from viewing items by key. That means that we cannot reuse our model. That isn't an issue per se, but it makes it more difficult to read and use the API.

* Having many fields isn't an issue for the GraphQL API (I assume that is why we have stripped some fields).
* We also have extra fields in the search API (such as resolved titles). I assume this is from when backend and frontend was developed by the same people, so changes to the backend was made to accomodate the frontend. This is less the case now that it is different developers. For the GraphQL API, this is also less of an issue as it is easy to resolve the foreigh keys.

## Directory API
We currently have a none public directory API, that gets partially exposed via the portal. That means that the project cannot be run without credentials. it would be nice to have a public directory API that we could also include in the graphAPI.

## Enumeration or vocabulary
What is the relation between the vocabulary endpoints and the enum endpoint(s)?
Are there overlaps? are they synced?

**Hot reloading of enums?**
Enumerations are currently loaded from the enumeration endpoint at startup. Does this need to be dynamic?

## Protecting the APIs from misuse
The GBIF APIs are public, which makes them susceptible to misuse through bombarding and complex queries. This becomes even easier with a GraphQL API. It seems reasonable to consider how we can protect the APIs from misuse.

> As long as the REST API is completely open, then it does not make sense to spend much energy beyond protecting against accidental benign misuse.
>
> The query-depth-limit already in place, might be sufficient for now. Perhaps combined with a required ApiKey.

*Inspiration*
Github allow a little traffic for anonymous users and more for authenticated (REST API). They have a cost function on the graph API and you can query it.
https://developer.github.com/v4/guides/resource-limitations/

*Other idea and things to consider*
* recommended in the Apollo docs: https://blog.apollographql.com/securing-your-graphql-api-from-malicious-queries-16130a324a6b
* https://leapgraph.com/graphql-api-security

### Autentication
We could allow anonymous API usage for the REST API as we always have, but require login on the GraphQL API, or at least put limitations on non-authorized users. There could be a hierarchy?

* Large limitations for anonymous IP
* Medium shared limitations on anonymous users across IPs
* Some limitations for authenticated users
* Few limitations for authenticated apps

### Query cost
Another way to guard against overloading the APIs is to put limitations on the complexity.
https://blog.apollographql.com/securing-your-graphql-api-from-malicious-queries-16130a324a6b

### Rate limits
https://github.com/ravangen/graphql-rate-limit

## Error handling
This being new, I'm not sure how I would prefer errors. I've found 3 approaches:

1. The default and suggested in Apollo [reference](https://blog.apollographql.com/full-stack-error-handling-with-graphql-apollo-5c12da407210)
2. [reference](https://itnext.io/the-definitive-guide-to-handling-graphql-errors-e0c58b52b5e1) Wrap your response in an error wrapper, if the error influence UI
3. [reference](https://blog.logrocket.com/handling-graphql-errors-like-a-champ-with-unions-and-interfaces/) Use union types as a way to return either an error or a response for a given query or type.

Perhaps, because I haven't tried it, but 3 looks frustrating and cumbersome to me. It is nice that the errors are colocated, but the cost is high. Much more complex schemas, more complex queries and I've kind of lost the type safety in my response.

2 is more appealing, but frustrating having to wrap everything with a {response, error}. If the API was tied to a specific UI, then we could choose to use a wrapper when error handling had known UI consequences, but for a generic API, it would need to be everywhere.

So I guess I prefer 1, even though that doesn't appeal to me either. The errors are not colocated with the item that failed and I have to iterate an array, interpret paths and know custom error enums, to figure out if it is relevant to the component that I'm rendering.

# Docker

Docker images can be built and published to docker hub using the following command
```
docker buildx build . --push --platform linux/amd64,linux/arm64 --tag "$DOCKER_HUB_ORG/graphql-api:$(git rev-parse --short HEAD)"
```

To run use:
```
docker run -p 4000:4000 --mount type=bind,source="$(pwd)"/.env,target=/usr/src/.env -d <DOCKER_HUB_OR_OR_USER>/graphql-api
```

# Translation of Resources (Contentful Data)
To translate content from Contentful, you must provide an HTTP header called "locale" with a value corresponding to the desired language.  
## The available languages are as follows:
1. U.K. English (en-GB) - Default, No Fallback
2. Russian (ru) - Fallback: en-GB
3. Spanish (es) - Fallback: en-GB
4. Arabic (ar) - Fallback: en-GB
5. French (fr) - Fallback: en-GB
6. Portuguese (pt) - Fallback: en-GB
7. Chinese (Simplified) (zh-Hans) - Fallback: en-GB
8. Dutch (nl) - Fallback: en-GB
9. Chinese (Traditional) (zh-Hant) - Fallback: en-GB
10. Japanese (ja) - Fallback: en-GB
11. Korean (ko) - Fallback: en-GB
12. Ukrainian (uk) - Fallback: en-GB
13. Polish (pl) - Fallback: en-GB
