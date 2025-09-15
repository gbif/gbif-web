import { TextField } from '../hostedPortalForm';
import { FormattedMessage } from 'react-intl';

export function DataScope() {
  return (
    <TextField
      name="dataScope"
      textarea
      descriptionPosition="above"
      description={
        <FormattedMessage
          id="hostedPortalApplication.dataScopeDescription"
          defaultMessage="Note that hosted portals can only display occurrence records that are already shared on GBIF.org and organized to the GBIF backbone taxonomy. Briefly describe the scope of the occurrence data that you would like to display on a GBIF hosted portal, including, for example, the geographic, taxonomic and temporal scope or other parameters. Approximately how many datasets and records currently available from GBIF.org meet this scope? Please include links to GBIF.org searches as appropriate."
        />
      }
    />
  );
}
