import axios from '../../../../search/OccurrenceSearch/api/axios';

const enumMap = {};

const getByLanguage = (obj, language) => {
  if (!obj) return;
  return obj[language] || obj.eng || undefined;
}

const getCoreFields = (obj, language) => {
  const label = getByLanguage(obj.label, language);
  const definition = getByLanguage(obj.definition, language);
  return {
    name: obj.name,
    ...(label ? {label} : null),
    ...(definition ? {definition} : null),
  }
}

const fetchVocabulary = async (name, language) => {
  const vocab = (await axios.get(`https://api.gbif-uat.org/v1/vocabularies/${name}`)).data;
  const concepts = (await axios.get(`https://api.gbif-uat.org/v1/vocabularies/${name}/concepts?limit=1000`)).data;

  const trimmedConcepts = concepts.results.map(c => {
    return {...getCoreFields(c, language),}
  });

  return {
    ...getCoreFields(vocab, language),
    concepts: trimmedConcepts,
    hasConceptDefinitions: trimmedConcepts.some(e => e.definition)
  };
}

export const getVocabulary = async (name, language) => {
  language = language || 'eng';
  if (!enumMap[`${name}_${language}`]) {
    enumMap[`${name}_${language}`] = fetchVocabulary(name, language);
  }
  return enumMap[`${name}_${language}`];
}