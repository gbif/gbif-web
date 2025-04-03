import { ApolloServer, ExpressContext } from 'apollo-server-express';
import searchCountries from './countrySearch';
import getOccurrenceMatches from './occurrences';
import { searchParticipants } from './participantSearch';
import searchTaxa from './taxonSearch';
import searchTechDocs from './techdocs';

export const OMNI_SEARCH_TIMEOUT = 700; // it isn't used by all endpoints below, but if they need it, it will be set to 700ms

export default async function searchAll({
  query,
  locale,
  server,
}: {
  query: string;
  server: ApolloServer<ExpressContext>;
  locale: string;
}) {
  try {
    const taxonResults = await searchTaxa({ query, server });
    const countryResult = await searchCountries(query, locale);
    const participantResult = await searchParticipants(query);
    const occurrenceResults = await getOccurrenceMatches(query);
    const documentationResults = await searchTechDocs(query);

    return {
      country: countryResult,
      participant: participantResult,
      taxa: taxonResults,
      occurrences: occurrenceResults,
      techDocs: documentationResults,
    };
  } catch (error) {
    return {
      error: {
        message: 'An error occurred while searching.',
      },
    };
  }
}
