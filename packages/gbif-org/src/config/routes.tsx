import { countryKeyRoute } from '@/routes/country/key';
import { datasetKeyRoute } from '@/routes/dataset/key';
import { datasetSearchRoute } from '@/routes/dataset/search';
import { installationKeyRoute } from '@/routes/installation/key';
import { literatureSearchRoute } from '@/routes/literature/search';

import { networkKeyRoute } from '@/routes/network/key';
import { nodeKeyRoute } from '@/routes/node/key';
import { downloadKeyRoute } from '@/routes/occurrence/download/key';
import { occurrenceKeyRoutes } from '@/routes/occurrence/key';
import { occurrenceSearchRoute } from '@/routes/occurrence/search';
import { createParticipantKeyRoute } from '@/routes/participant/key';
import { publisherKeyRoute } from '@/routes/publisher/key';
import { publisherSearchRoute } from '@/routes/publisher/search';
import { resourceKeyRoutes } from '@/routes/resource/key';
import { resourceSearchRoute } from '@/routes/resource/search';
import { taxonKeyRoute } from '@/routes/taxon/key';
import { taxonSearchRoute } from '@/routes/taxon/search';

export const dataRoutes = [
  // search routes first in case of conflict
  datasetSearchRoute,
  occurrenceSearchRoute,
  taxonSearchRoute,
  publisherSearchRoute,
  literatureSearchRoute,
  resourceSearchRoute,

  // detail routes
  datasetKeyRoute,
  installationKeyRoute,
  networkKeyRoute,
  ...occurrenceKeyRoutes,
  downloadKeyRoute,
  publisherKeyRoute,
  taxonKeyRoute,
  countryKeyRoute,
  createParticipantKeyRoute(), // using function to avoid circular dependency error
  nodeKeyRoute,
  // Must be last as alias handling will require match on whildcard
  ...resourceKeyRoutes,
];
