import React from 'react';
import links from './links.json'

const defaultGbifOrgLinks = {
    dataset: {
        href: (occurrence) => `https://www.gbif.org/dataset/${occurrence.datasetKey}`,
        key: "datasetKey"       
    },
  
        scientificName: {
            href: (occurrence) => `https://www.gbif.org/species/${occurrence.gbifClassification?.usage?.key}`
        },
        acceptedScientificName: {
            href: (occurrence) => `https://www.gbif.org/species/${occurrence.gbifClassification?.acceptedUsage?.key}`
        }
    
};
// A context to share links for the full app/component
const linksWithTemplates = Object.keys(links).reduce((acc, cur) => ( acc[cur] = links[cur] === 'default' ? defaultGbifOrgLinks[cur] : {...links[cur], href: occurrence => links[cur].template.replace('$key', occurrence[links[cur].key]) }, acc), {})

export default React.createContext(linksWithTemplates);