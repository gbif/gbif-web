import { get, find } from 'lodash';

const URL_TEMPLATE = 'P1630'; // the wikidata property for an url template such as https://www.gbif.org/species/{id}
const REDLIST_CATEGORIES = {
  LC: true,
  NT: true,
  VU: true,
  EN: true,
  CR: true,
  EW: true,
  EX: true,
  NE: true,
  DD: true,
};

const decorateProperty = (p, res, locale) => ({
  id: get(p, 'mainsnak.datavalue.value'),
  url: get(
    res,
    `entities.${p.mainsnak.property}.claims.${URL_TEMPLATE}[0].mainsnak.datavalue.value`,
  )
    ? get(
        res,
        `entities.${p.mainsnak.property}.claims.${URL_TEMPLATE}[0].mainsnak.datavalue.value`,
      ).replace('$1', p.mainsnak.datavalue.value)
    : '',
  label: get(res, `entities.${p.mainsnak.property}.labels.${locale}`)
    ? get(res, `entities.${p.mainsnak.property}.labels.${locale}`)
    : get(res, `entities.${p.mainsnak.property}.labels.en`),
  description: get(
    res,
    `entities.${p.mainsnak.property}.descriptions.${locale}`,
  )
    ? get(res, `entities.${p.mainsnak.property}.descriptions.${locale}`)
    : get(res, `entities.${p.mainsnak.property}.descriptions.en`),
});

const getItemData = (id, res, locale) => ({
  label: get(res, `entities.${id}.labels.${locale}`)
    ? get(res, `entities.${id}.labels.${locale}`)
    : get(res, `entities.${id}.labels.en`),
  description: get(res, `entities.${id}.descriptions.${locale}`)
    ? get(res, `entities.${id}.descriptions.${locale}`)
    : get(res, `entities.${id}.descriptions.en`),

  aliases: get(res, `entities.${id}.aliases.en`), // Only en locale, to find ThreatStatus abbrevations
});

const getIUCNRedListData = (value, res, threatStatus, locale) => ({
  abbrevation: find(value.aliases, (a) => REDLIST_CATEGORIES[a.value] === true),
  value,
  label: get(
    res,
    `body.entities.${threatStatus.mainsnak.property}.labels.${locale}`,
  )
    ? get(
        res,
        `body.entities.${threatStatus.mainsnak.property}.labels.${locale}`,
      )
    : get(res, `body.entities.${threatStatus.mainsnak.property}.labels.en`),
  description: get(
    res,
    `body.entities.${threatStatus.mainsnak.property}.descriptions.${locale}`,
  )
    ? get(
        res,
        `body.entities.${threatStatus.mainsnak.property}.descriptions.${locale}`,
      )
    : get(
        res,
        `body.entities.${threatStatus.mainsnak.property}.descriptions.en`,
      ),
});

export { decorateProperty, getItemData, getIUCNRedListData };
