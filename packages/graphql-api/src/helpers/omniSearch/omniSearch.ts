import { ApolloServer, ExpressContext } from 'apollo-server-express';
import searchCountries from './countrySearch';
import { searchParticipants } from './participantSearch';
import searchTaxa from './taxonSearch';

export default async function searchAll({
  query,
  locale,
  server,
}: {
  query: string;
  server: ApolloServer<ExpressContext>;
  locale: string;
}) {
  const taxonResults = await searchTaxa({ query, server });
  const countryResult = await searchCountries(query, locale);
  const participantResult = await searchParticipants(query);

  return {
    country: countryResult,
    participant: participantResult,
    taxa: taxonResults,
  };
}
