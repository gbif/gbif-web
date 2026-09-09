import { ApolloServer, BaseContext } from '@apollo/server';
import searchCountries from './countrySearch';
import getOccurrenceMatches from './occurrences';
import { searchParticipants } from './participantSearch';
import searchTaxa from './taxonSearch';

export const OMNI_SEARCH_TIMEOUT = 700; // it isn't used by all endpoints below, but if they need it, it will be set to 700ms

export default async function searchAll({
  query,
  locale,
  languageCode = 'eng',
  server,
  checklistKey,
}: {
  query: string;
  languageCode: string;
  server: ApolloServer<BaseContext>;
  locale: string;
  checklistKey?: string;
}) {
  try {
    const taxonResults = await searchTaxa({
      query,
      server,
      languageCode,
      checklistKey,
    });
    const countryResults = await searchCountries(query, locale);
    const participantResult = await searchParticipants(query);
    const occurrenceResults = await getOccurrenceMatches(query);
    // const documentationResults = await searchTechDocs(query);

    return {
      // deprecated: use countries instead. Kept while clients migrate to the list
      country: countryResults[0],
      countries: countryResults,
      participant: participantResult,
      taxa: taxonResults,
      occurrences: occurrenceResults,
      // techDocs: documentationResults,
    };
  } catch (error) {
    console.log(error);
    return {
      error: {
        message: 'An error occurred while searching.',
      },
    };
  }
}
