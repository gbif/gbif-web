const _ = require('lodash')
const URL_TEMPLATE = 'P1630'; // the wikidata property for an url template such as https://www.gbif.org/species/{id}
const REDLIST_CATEGORIES = {'LC': true, 'NT': true, 'VU': true, 'EN': true, 'CR': true, 'EW': true, 'EX': true, 'NE': true, 'DD': true};

const decorateProperty = (p, res, locale) => ({
    id: _.get(p, 'mainsnak.datavalue.value'),
    url: _.get(
        res,
        `entities.${
            p.mainsnak.property
        }.claims.${URL_TEMPLATE}[0].mainsnak.datavalue.value`
    )
        ? _.get(
              res,
              `entities.${
                  p.mainsnak.property
              }.claims.${URL_TEMPLATE}[0].mainsnak.datavalue.value`
          ).replace('$1', p.mainsnak.datavalue.value)
        : '',
    label: _.get(
        res,
        `entities.${p.mainsnak.property}.labels.${locale}`
    )
        ? _.get(res, `entities.${p.mainsnak.property}.labels.${locale}`)
        : _.get(res, `entities.${p.mainsnak.property}.labels.en`),
    description: _.get(
        res,
        `entities.${p.mainsnak.property}.descriptions.${locale}`
    )
        ? _.get(
              res,
              `entities.${p.mainsnak.property}.descriptions.${locale}`
          )
        : _.get(res, `entities.${p.mainsnak.property}.descriptions.en`)
})

const getItemData = (id, res, locale) => (
     {
        label: _.get(
            res,
            `entities.${id}.labels.${locale}`
        )
            ? _.get(res, `entities.${id}.labels.${locale}`)
            : _.get(res, `entities.${id}.labels.en`),
        description: _.get(
            res,
            `entities.${id}.descriptions.${locale}`
        )
            ? _.get(
                  res,
                  `entities.${id}.descriptions.${locale}`
              )
            : _.get(res, `entities.${id}.descriptions.en`),

        aliases: _.get(res, `entities.${id}.aliases.en`) // Only en locale, to find ThreatStatus abbrevations
    }
)

const getIUCNRedListData = (value, res, threatStatus, locale) => ({
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
})

module.exports = {decorateProperty, getItemData, getIUCNRedListData}