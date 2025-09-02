import { DatasetLabel } from '@/components/filters/displayNames';
import { HelpLine } from '@/components/helpText';
import { Button } from '@/components/ui/button';
import { Card, DiscreteCardTitle } from '@/components/ui/largeCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useConfig } from '@/config/config';
import { useStringParam } from '@/hooks/useParam';
import { MdDownload, MdClose as No, MdCheck as Yes } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function DownloadOptionsCard() {
  const [checklistKey, setChecklistKey] = useStringParam({ key: 'checklistKey', replace: true });

  return (
    <>
      <DiscreteCardTitle>
        <FormattedMessage id="download.downloadOptions.title" defaultMessage="Download options" />
      </DiscreteCardTitle>

      <Card>
        <div className="g-p-4 g-border-b">
          <h3 className="g-font-semibold g-text-sm">
            <FormattedMessage
              id="download.downloadOptions.chooseChecklist"
              defaultMessage="Choose checklist"
            />
          </h3>
          <p className="g-text-sm g-text-gray-700 g-mb-2">
            <FormattedMessage
              id="download.downloadOptions.chooseChecklistDescription"
              defaultMessage="Select which taxonomic checklist to use for organizing the names in your download"
            />
          </p>
          <ChecklistSelect checklistKey={checklistKey} setChecklistKey={setChecklistKey} />
        </div>

        <div className="g-p-4 g-overflow-auto">
          <table className="gbif-table-style g-min-w-[1000px]">
            <thead>
              <tr>
                <th></th>
                <th>
                  <FormattedMessage
                    id="download.downloadOptions.content.rawData"
                    defaultMessage="Raw data"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="download.downloadOptions.content.interpretedData"
                    defaultMessage="Interpreted data"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="download.downloadOptions.content.images"
                    defaultMessage="Miltimedia"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="download.downloadOptions.content.coordinates"
                    defaultMessage="Coordinates"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="download.downloadOptions.content.fileFormat"
                    defaultMessage="Format"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Button size="sm" className="g-w-full">
                    <MdDownload />
                    <span className="g-ms-1">
                      <FormattedMessage
                        id="enums.downloadFormat.SIMPLE_CSV"
                        defaultMessage="Simple"
                      />
                    </span>
                  </Button>
                </td>
                <th>
                  <No />
                </th>
                <th>
                  <Yes />
                </th>
                <th>
                  <No />
                </th>
                <th>
                  <Yes /> (
                  <FormattedMessage
                    id="download.downloadOptions.tableValues.ifAvailable"
                    defaultMessage="if available"
                  />
                  )
                </th>
                <th>
                  <HelpLine
                    icon
                    id="opening-gbif-csv-in-excel"
                    title={
                      <FormattedMessage
                        id="download.downloadOptions.fileFormats.tabCsv"
                        defaultMessage="Tab-delimited CSV (for use in Excel, etc.)"
                      />
                    }
                    contentClassName="g-w-auto g-max-w-[90vw] g-max-h-[500px] g-overflow-y-scroll"
                  />
                </th>
              </tr>

              <tr>
                <td>
                  <Button size="sm" className="g-w-full">
                    <MdDownload />
                    <span className="g-ms-1">
                      <FormattedMessage
                        id="enums.downloadFormat.DWCA"
                        defaultMessage="Darwin Core Archive"
                      />
                    </span>
                  </Button>
                </td>
                <th>
                  <Yes />
                </th>
                <th>
                  <Yes />
                </th>
                <th>
                  <No /> (
                  <FormattedMessage
                    id="download.downloadOptions.tableValues.links"
                    defaultMessage="links"
                  />
                  )
                </th>
                <th>
                  <Yes /> (
                  <FormattedMessage
                    id="download.downloadOptions.tableValues.ifAvailable"
                    defaultMessage="if available"
                  />
                  )
                </th>
                <th>
                  <HelpLine
                    icon
                    id="opening-gbif-csv-in-excel"
                    title={
                      <FormattedMessage
                        id="download.downloadOptions.fileFormats.tabCsv"
                        defaultMessage="Tab-delimited CSV (for use in Excel, etc.)"
                      />
                    }
                    contentClassName="g-w-auto g-max-w-[90%] g-max-h-[500px] g-overflow-y-scroll"
                  />
                </th>
              </tr>

              <tr>
                <td>
                  <Button size="sm" className="g-w-full">
                    <MdDownload />
                    <span className="g-ms-1">
                      <FormattedMessage
                        id="enums.downloadFormat.SPECIES_LIST"
                        defaultMessage="Species list"
                      />
                    </span>
                  </Button>
                </td>
                <th>
                  <No />
                </th>
                <th>
                  <Yes />
                </th>
                <th>
                  <No />
                </th>
                <th>
                  <No />
                </th>
                <th>
                  <HelpLine
                    icon
                    id="opening-gbif-csv-in-excel"
                    title={
                      <FormattedMessage
                        id="download.downloadOptions.fileFormats.tabCsv"
                        defaultMessage="Tab-delimited CSV (for use in Excel, etc.)"
                      />
                    }
                    contentClassName="g-w-auto g-max-w-[90%] g-max-h-[500px] g-overflow-y-scroll"
                  />
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

type ChecklistSelectProps = {
  checklistKey?: string;
  setChecklistKey: (value: string | undefined) => void;
};

function ChecklistSelect({ checklistKey, setChecklistKey }: ChecklistSelectProps) {
  const siteConfig = useConfig();
  const availableChecklistKeys = siteConfig.availableChecklistKeys ?? [];

  return (
    <Select value={checklistKey} onValueChange={setChecklistKey}>
      <SelectTrigger className="g-w-auto">
        <SelectValue></SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableChecklistKeys.map((key) => (
          <SelectItem key={key} value={key}>
            <DatasetLabel id={key} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
