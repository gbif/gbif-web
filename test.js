const systemPrompt = `You a biodiversity informatician. You are detail oriented and make sure to get things right.  I need you to translate a user query into a custom filter syntax. I will describe the syntax now.

# Filter syntax
## Core Structure
field=value              # equals
field=val1|val2|val3     # in (multiple values)
(condition1 and condition2 and ...)  # logical AND
(condition1 or condition2 or ...)   # logical OR
not(condition)          # logical NOT

## Operators
field=value     # equals
field>value     # greater than
field>=value    # greater than or equal
field<value     # less than
field<=value    # less than or equal
field~pattern   # like/pattern match (* and ? wildcards)
field?          # is null
field!          # is not null

## String Handling
Quote strings with spaces or special characters: field="value with spaces"
Multiple values: field=val1|"val 2"|val3
Escape quotes inside strings: field="He said \"hello\""

No quotes needed for simple alphanumeric values
Always quote strings with spaces, pipes (|), or special characters
Pipe separates multiple values in same field
Parentheses group logical operations with operator: prefix
Operators are symbols (=, >, <, ?, !, ~) not words
Nesting allowed - put conditions inside other conditions

## Geospatial
(within:"POLYGON((x1 y1, x2 y2, x3 y3, x1 y1))")
(near:latitude,longitude,distance)  # e.g. (near:55.6,12.5,10km)

# Examples
## Simple
country=DK
year>2000
taxonKey=1|2|3

## Complex
example a: (country=DK and year>=2000 and coordinates! and not(issue="COORDINATE_INVALID"))
example b: (scientificName="Homo sapiens" or taxonKey=2436436)

Possible useful context extracted from the query:
* Aves has the common name bird and has taxonKey 212
* Denmark has countryCode DK
* Current year is 2025
* There is a dataset called "EOD – eBird Observation Dataset" with datasetKey:4fa7b334-ce0d-4e88-aaae-2e0c138d049e
* mediaType has these possible values: StillImage, MovingImage, Audio, InteractiveResource

Fields available for filtering
taxonKey, country, mediaType, year, month (index 0-11), latitude, longitude, basisOfRecord, datasetKey

You can think, but the final result must be prefixed with: "FILTER_RESULT:" 
Here is the use query:
`;

const extendEnumsPrompt = `I need you to generate a list of alternative terms a user could use for a term. The context is a search phrase on a biodiversity website. So for example for the input "Fossil specimen" alternative terms could include: Fossilized specimens, artifacts, remains, relics, Paleontological, paleo, ancient, Prehistoric specimens.

Now please generate a json list of alternative terms for "Living specimen"
`;

const url = 'http://localhost:1234/api/v0/chat/completions';
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemma-3-12b',
    messages: [
      // {
      //   role: 'system',
      //   content: systemPrompt,
      // },
      // {
      //   role: 'user',
      //   content: `show me all pictures of birds in denmark from the last 2 years that aren't from ebird.`,
      // },
      {
        role: 'user',
        content: extendEnumsPrompt,
      },
    ],
    temperature: 0.7,
    max_tokens: -1,
    stream: false,
  }),
};

async function run() {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
}

run();

/*
most relevant fields for filtering:
- taxonKey
- country
- mediaType
- year
- month (index 0-11)
- latitude
- longitude
- gadm 
- basisOfRecord
- datasetKey
- publisher perhaps

relevant enums
typeStatus (no need for variant terms for those we just need plural and singular i suppose)
basisOfRecord (need to extend with variants)
mediaType (need to extend with variants)
occurrenceStatus (need to extend with variants)
lifeStage (need to extend with variants)
establishmentMeans (need to extend with variants)
degreeOfEstablishment (need to extend with variants)
issues and taxonomic issues (need to extend with variants)
license
pathway
sex
preparations
continent
gbifregion (unless of gbif and regions are specifically mentioned)
geological time (vocab)
publishingcountry (same as country)
dwca extensions
redlist categories

bools:
is sequences
repatriated

entries to search for
collection
institution
dataset
publisher
scientificname
vernacular names, including plural and singular somehow

wildcard search
recordedby
identifiedby
perhaps unless gadm: stateprovince, locality, municipality, county, island, islandGroup 
waterbody (since that isn't covered by gadm)
sampling protocol
biostratigrapyhy
litostratigraphy

exact matches
catalogueNumber
occurrenceid
recordnumber
organismid
fieldnumber

fields to inform about based on phrase
startday of year
endday of year
depth
elevation
coordinateuncertaintyinmeters
distancefromcentroidinmeters
gbifregion
identifiedById
recordedbyid

fn that takes a string and returns a list of possibly relevant filters and values
[
  {
    text: 'Aves has the common name birds and has taxonKey:212',
    key: 212,
    relevance: 'HIGH',
    filter: 'taxonKey',
    filterDescription: 'the taxonKey filter is used to filter by their taxonomic classification',
    matchedText: "birds"
  },
  {
    text: 'There is a dataset called "EOD – eBird Observation Dataset" [with this text in the description "...also known as ebird."]. It has datasetKey:4fa7b334-ce0d-4e88-aaae-2e0c138d049e',
    key: 4fa7b334-ce0d-4e88-aaae-2e0c138d049e,
    relevance: 'HIGH',
    filter: 'datasetKey',
    filterDescription: 'the datasetKey filter is used to filter for specific datasets',
    matchedText: "ebird"
  },
  {
    text: 'There is a dataset called "INATURA". It has datasetKey:12345678-1234-5678-123456789012',
    key: 12345678-1234-5678-123456789012,
    relevance: 'LOW',
    filter: 'datasetKey',
    filterDescription: 'the datasetKey filter is used to filter for specific datasets',
    matchedText: "inat"
  }
]

start simple and see how it works
ideas for more:
take a common dictionary and give lower priority to words that are common
include more matches and prioritize based on how many good there are and how unique they are
Download word frequency lists and give higher relevance to words that are less common. That way inat could become relevant despite being a bad match to the datasets

so first step in the function is to get a normalized frequency of each word in the input string
then process each sentence against a list of processors (dataset, type status etc)




*/
