import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import React, { useCallback, useMemo, useState } from 'react';
import { FaChevronLeft, FaDownload } from 'react-icons/fa';
import { generateCubeSql } from './cube/cubeService';
import { DownloadSummary } from './DownloadSummary';
import { formatFileSize, getEstimatedSizeInBytes, getEstimatedUnzippedSizeInBytes } from './utils';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/reactRouterPlugins';
import { Message } from '@/components/message';

interface TermsStepProps {
  predicate?: any;
  sql?: string;
  selectedFormat: any;
  configuration: any;
  totalRecords?: number;
  onBack: () => void;
  source?: string | null;
}

type AcceptedTerm = 'dataUse' | 'largeDownload';

// Constants from portal16
const LARGE_DOWNLOAD_OFFSET = 1048576; // 1M records - above this size, not possible to handle in Excel

interface DownloadTimeEstimate {
  speed: number;
  hours: number;
  minutes: number;
  formattedTime: string;
}

function calculateDownloadTime(sizeInBytes: number, speedMbps: number): DownloadTimeEstimate {
  const sizeInMegabits = (sizeInBytes * 8) / (1024 * 1024);
  const timeInSeconds = sizeInMegabits / speedMbps;
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.round((timeInSeconds % 3600) / 60);

  let formattedTime = '';
  if (hours > 0) {
    formattedTime = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    if (minutes > 0) {
      formattedTime += ` ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
  } else {
    formattedTime = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }

  return {
    speed: speedMbps,
    hours,
    minutes,
    formattedTime,
  };
}

export default function TermsStep({
  predicate,
  selectedFormat,
  configuration,
  totalRecords,
  onBack,
  source,
}: TermsStepProps) {
  const intl = useIntl();
  const navigate = useNavigate();
  const { localizeLink } = useI18n();
  // Get zipped download size (what user downloads)
  const estimatedSizeInBytes = getEstimatedSizeInBytes(selectedFormat.id, totalRecords ?? 0);
  // Get unzipped size (disk space needed after extraction)
  const estimatedUnzippedSizeInBytes = getEstimatedUnzippedSizeInBytes(
    selectedFormat.id,
    totalRecords ?? 0
  );
  const isLargeDownload =
    totalRecords && ['SIMPLE_CSV', 'DWCA'].includes(selectedFormat.id)
      ? totalRecords > LARGE_DOWNLOAD_OFFSET
      : false;

  const [preparingDownload, setPreparingDownload] = useState(false);
  const [error, setError] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState({
    dataUse: false,
    ...(isLargeDownload && { largeDownload: false }),
  });

  const allTermsAccepted = Object.values(acceptedTerms).every(Boolean);

  // Get the primary download time estimate (50 Mbps)
  const primaryEstimate = useMemo(() => {
    return calculateDownloadTime(estimatedSizeInBytes, 50);
  }, [estimatedSizeInBytes]);

  const handleDownload = useCallback(async () => {
    setPreparingDownload(true);
    let sql = configuration.sql;
    let machineDescription = configuration.machineDescription;
    if (configuration.cube) {
      const result = await generateCubeSql(configuration.cube, predicate);
      if (result.error) {
        alert(intl.formatMessage({ id: 'customSqlDownload.errorGeneratingSql' }));
        setPreparingDownload(false);
        return;
      }
      sql = result.sql;
      machineDescription = result.machineDescription;
    }

    const format = selectedFormat.downloadFormat ?? selectedFormat.id;
    fetch('/api/user/download/predicate?source=' + encodeURIComponent(source ?? ''), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        predicate,
        format: format,
        checklistKey: configuration.checklistKey,
        verbatimExtensions: selectedFormat.id === 'DWCA' ? configuration.extensions : [],
        machineDescription: selectedFormat.id === 'SQL_CUBE' ? machineDescription : undefined,
        sql: format === 'SQL_TSV_ZIP' ? sql : undefined,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        navigate(localizeLink(`/occurrence/download/${data.downloadKey}`));
      })
      .catch((error) => {
        console.error('There was a problem with the download request:', error);
        setError(error);
      })
      .finally(() => {
        setPreparingDownload(false);
      });
  }, [configuration, predicate, selectedFormat, intl, navigate, localizeLink, source]);

  const handleTermChange = (term: AcceptedTerm) => {
    setAcceptedTerms((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  };

  return (
    <div className="g-max-w-4xl g-mx-auto">
      {/* Header */}
      <div className="g-mb-4">
        <button
          onClick={onBack}
          className="g-flex g-items-center g-gap-2 g-text-gray-600 hover:g-text-gray-900 g-mb-4 g-transition-colors"
        >
          <FaChevronLeft size={20} />
          <FormattedMessage id="occurrenceDownloadFlow.backToConfiguration" />
        </button>
      </div>

      <div className="g-grid lg:g-grid-cols-3 g-gap-8">
        {/* Terms Content */}
        <div className="lg:g-col-span-2 g-space-y-6">
          {/* Data Use Agreement */}
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
            <div className="g-p-6">
              <div className="g-flex g-items-start g-gap-4">
                <div className="g-flex-shrink-0 g-mt-1">
                  <Checkbox
                    id="dataUse"
                    checked={acceptedTerms.dataUse}
                    onCheckedChange={() => handleTermChange('dataUse')}
                    className="g-h-5 g-w-5"
                  />
                </div>
                <div className="g-flex-1">
                  <label
                    htmlFor="dataUse"
                    className="g-flex g-items-center g-gap-2 g-font-semibold g-text-gray-900 g-mb-2 g-cursor-pointer"
                  >
                    <FormattedMessage id="occurrenceDownloadFlow.dataUseAgreement" />
                  </label>
                  <div className="g-text-sm g-text-gray-700 g-space-y-2 g-prose">
                    <Message id="occurrenceDownloadFlow.promoteTransparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Large Download Warning - Conditional */}
          {isLargeDownload && (
            <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
              <div className="g-p-6">
                <div className="g-flex g-items-start g-gap-4">
                  <div className="g-flex-shrink-0 g-mt-1">
                    <Checkbox
                      id="largeDownload"
                      checked={acceptedTerms.largeDownload || false}
                      onCheckedChange={() => handleTermChange('largeDownload')}
                      className="g-h-5 g-w-5"
                    />
                  </div>
                  <div className="g-flex-1">
                    <label
                      htmlFor="largeDownload"
                      className="g-flex g-items-center g-gap-2 g-font-semibold g-text-gray-900 g-mb-2 g-cursor-pointer"
                    >
                      <FormattedMessage id="occurrenceDownloadFlow.largeDownloadAcknowledgment" />
                    </label>
                    <div className="g-text-sm g-text-gray-700 g-space-y-3 g-prose">
                      <div>
                        <p>
                          <FormattedMessage
                            id="occurrenceDownloadFlow.largeDownloadEstimatedSize"
                            values={{
                              size: <strong>{formatFileSize(estimatedSizeInBytes)}</strong>,
                            }}
                          />{' '}
                          <FormattedMessage
                            id="occurrenceDownloadFlow.largeDownloadConnectionSpeed"
                            values={{
                              speed: primaryEstimate.speed,
                              time: <strong>{primaryEstimate.formattedTime}</strong>,
                            }}
                          />
                        </p>
                        <p>
                          <FormattedMessage
                            id="occurrenceDownloadFlow.largeDownloadDiskSpace"
                            values={{
                              size: <strong>{formatFileSize(estimatedUnzippedSizeInBytes)}</strong>,
                            }}
                          />
                        </p>
                        <p>
                          <FormattedMessage
                            id="occurrenceDownloadFlow.largeDownloadRowCount"
                            values={{
                              count: (
                                <strong>
                                  <FormattedNumber value={totalRecords ?? 0} />
                                </strong>
                              ),
                            }}
                          />
                        </p>
                        <p>
                          <FormattedMessage id="occurrenceDownloadFlow.largeDownloadExcelWarning" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:g-col-span-1">
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6 g-sticky g-top-6">
            <h3 className="g-font-semibold g-text-gray-900 g-mb-4">
              <FormattedMessage id="occurrenceDownloadFlow.downloadSummary" />
            </h3>

            <DownloadSummary selectedFormat={selectedFormat} configuration={configuration} />

            <div className="g-space-y-3 g-mb-6 g-mt-6">
              <h4 className="g-font-medium g-text-gray-900">
                <FormattedMessage id="occurrenceDownloadFlow.termsStatus" />
              </h4>
              <Term
                label={<FormattedMessage id="occurrenceDownloadFlow.dataUseAgreement" />}
                termKey="dataUse"
                accepted={acceptedTerms.dataUse}
                handleTermChange={handleTermChange}
              />
              {isLargeDownload && (
                <Term
                  label={
                    <FormattedMessage id="occurrenceDownloadFlow.largeDownloadAcknowledgment" />
                  }
                  termKey="largeDownload"
                  accepted={acceptedTerms.largeDownload || false}
                  handleTermChange={handleTermChange}
                />
              )}
            </div>

            <Button
              disabled={!allTermsAccepted || preparingDownload}
              className={`g-w-full g-flex g-items-center g-justify-center g-gap-2`}
              onClick={handleDownload}
            >
              <FaDownload size={16} />
              <FormattedMessage id="occurrenceDownloadFlow.createDownload" />
            </Button>

            {!allTermsAccepted && (
              <p className="g-text-xs g-text-gray-500 g-text-center g-mt-2">
                <FormattedMessage id="occurrenceDownloadFlow.completeRequirements" />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Term({
  termKey,
  accepted,
  handleTermChange,
  label,
}: {
  termKey: AcceptedTerm;
  accepted: boolean;
  handleTermChange: (term: AcceptedTerm) => void;
  label: string | React.ReactNode;
}) {
  return (
    <label className="g-flex g-items-start g-gap-2 g-text-sm">
      <Checkbox
        id={termKey}
        checked={accepted}
        onCheckedChange={() => handleTermChange(termKey)}
        className="'g-flex-none g-me-2 g-mt-0.5 g-h-4 g-w-4"
      />
      <span className={accepted ? 'g-text-green-700' : 'g-text-gray-600'}>{label}</span>
    </label>
  );
}
