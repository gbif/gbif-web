const _ = require('lodash')
const got = require('got')
const wdk = require('wikibase-sdk')({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql'
});


const USER_AGENT = "gbif-graphql/1.0";

const REDLIST_CATEGORIES = {'LC': true, 'NT': true, 'VU': true, 'EN': true, 'CR': true, 'EW': true, 'EX': true, 'NE': true, 'DD': true};

const WIKI_GBIF_IDENTIFIER = 'P846';
const URL_TEMPLATE = 'P1630';
const IUCN_TAXON_IDENTIFIER = 'P627';
const IUCN_CONSERVATION_STATUS = 'P141';



const getIdentifiers = async (key, locale) => {
    const url = wdk.getReverseClaims(WIKI_GBIF_IDENTIFIER, key.toString(), {
        keepProperties: true
    });
    const reverseClaimResponse = await got(url, {
        responseType: 'json',
        headers: {
            'User-Agent': USER_AGENT
        }
      });

    const entitiesIds = wdk.simplify.sparqlResults(reverseClaimResponse.body);
    if (entitiesIds.length === 0) {
        return null//throw new Error('not found');
    }
    const wikidataId = _.get(entitiesIds, '[0].subject');
    const entityUrl = wdk.getEntities(entitiesIds.map((e) => e.subject));
    const entityResponse = await got(entityUrl, {
        responseType: 'json',
        headers: {
            'User-Agent': USER_AGENT
        }
      });
    const keys = Object.keys(entityResponse.body.entities);
    const claims = _.get(entityResponse.body.entities, `${keys[0]}.claims`) || [];
    const claimKeys = Object.keys(claims);
    const externalIds = claimKeys
        .filter(
            (k) => _.get(claims, `${k}[0].mainsnak.datatype`) === 'external-id'
        )
        .map((k) => _.get(claims, `${k}[0]`));

    const identifiers = await decorateWithPropertyDescriptions(externalIds, locale);
    const iucnIdentifier = await decorateWithPropertyDescriptions(claimKeys
        .filter(
            (k) => k === IUCN_TAXON_IDENTIFIER
        )
        .map((k) => _.get(claims, `${k}[0]`)), locale);
    const iucnThreatStats = await getIUCNThreatStatus(claimKeys
        .filter(
            (k) => k === IUCN_CONSERVATION_STATUS
        )
        .map((k) => _.get(claims, `${k}[0]`)), locale);
    return {
        wikidataId: wikidataId,
        wikidataUrl: `https://www.wikidata.org/wiki/${wikidataId}`,
        identifiers: identifiers,
        iucnIdentifier: iucnIdentifier,
        iucnThreatStatus: iucnThreatStats
    };
};

const decorateWithPropertyDescriptions = (properties, locale = 'en') => {
    if (properties.length === 0) {
        return '';
    }
    const url = wdk.getEntities(
        properties.map((k) => _.get(k, `mainsnak.property`))
    );
    return got(url, {
        responseType: 'json',
        headers: {
            'User-Agent': USER_AGENT
        }
      }).then((res) => {

        return properties.map((p) => ({
            id: _.get(p, 'mainsnak.datavalue.value'),
            url: _.get(
                res,
                `body.entities.${
                    p.mainsnak.property
                }.claims.${URL_TEMPLATE}[0].mainsnak.datavalue.value`
            )
                ? _.get(
                      res,
                      `body.entities.${
                          p.mainsnak.property
                      }.claims.${URL_TEMPLATE}[0].mainsnak.datavalue.value`
                  ).replace('$1', p.mainsnak.datavalue.value)
                : '',
            label: _.get(
                res,
                `body.entities.${p.mainsnak.property}.labels.${locale}`
            )
                ? _.get(res, `body.entities.${p.mainsnak.property}.labels.${locale}`)
                : _.get(res, `body.entities.${p.mainsnak.property}.labels.en`),
            description: _.get(
                res,
                `body.entities.${p.mainsnak.property}.descriptions.${locale}`
            )
                ? _.get(
                      res,
                      `body.entities.${p.mainsnak.property}.descriptions.${locale}`
                  )
                : _.get(res, `body.entities.${p.mainsnak.property}.descriptions.en`)
        }));
    });
};

const getIUCNThreatStatus = async (properties, locale = 'en') => {
    const threatStatus = properties[0];
    if (!threatStatus) {
        return '';
    }
    const url = wdk.getEntities(
        properties.map((k) => _.get(k, `mainsnak.property`))
    );
    const res = await got(url, {
        responseType: 'json',
        headers: {
            'User-Agent': USER_AGENT
        }
      });

    const value = await resolveWikiDataItem(_.get(threatStatus, 'mainsnak.datavalue.value.id'), locale);
    return {
            abbrevation: _.find(value.aliases, (a) => REDLIST_CATEGORIES[a.value] === true),
            value: value,
            label: _.get(
                res,
                `body.entities.${threatStatus.mainsnak.property}.labels.${locale}`
            )
                ? _.get(res, `body.entities.${threatStatus.mainsnak.property}.labels.${locale}`)
                : _.get(res, `body.entities.${threatStatus.mainsnak.property}.labels.en`),
            description: _.get(
                res,
                `body.entities.${threatStatus.mainsnak.property}.descriptions.${locale}`
            )
                ? _.get(
                      res,
                      `body.entities.${threatStatus.mainsnak.property}.descriptions.${locale}`
                  )
                : _.get(res, `body.entities.${threatStatus.mainsnak.property}.descriptions.en`)
        };
};

const resolveWikiDataItem = async (id, locale = 'en') => {
    const url = wdk.getEntities(
       [id]
    );
    const res = await got(url, {
        responseType: 'json',
        headers: {
            'User-Agent': USER_AGENT
        }
      });
    return {
        label: _.get(
            res,
            `body.entities.${id}.labels.${locale}`
        )
            ? _.get(res, `body.entities.${id}.labels.${locale}`)
            : _.get(res, `body.entities.${id}.labels.en`),
        description: _.get(
            res,
            `body.entities.${id}.descriptions.${locale}`
        )
            ? _.get(
                  res,
                  `body.entities.${id}.descriptions.${locale}`
              )
            : _.get(res, `body.entities.${id}.descriptions.en`),

        aliases: _.get(res, `body.entities.${id}.aliases.en`) // Only en locale, to find ThreatStatus abbrevations
    };
};

module.exports = {
    getIdentifiers,
    getIUCNThreatStatus
}