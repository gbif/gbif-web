import { ITrendContext, Trend, TrendProvider, useTrendContext } from './trend';

import { CardContent } from '@/components/ui/largeCard';

import { Callout } from '@/components/callout';
import { Message } from '@/components/message';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { TrendContainer } from './trend';

export function Trends({ path, countryCode }: ITrendContext) {
  return (
    <TrendProvider path={path} countryCode={countryCode}>
      <NumberOfOccurrenceRecords />
      <SpeciesCounts />
      <TemporalTrends />
      <CompletenessAndPrecision />
      <GeographicCoverage />
      <DataSharing />
    </TrendProvider>
  );
}

function NumberOfOccurrenceRecords() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="g-text-xl">
          <FormattedMessage id="trends.noOccRecords" />
        </CardTitle>
        <CardDescription className="g-text-inherit">
          <FormattedMessage id="trends.theseChartsIllustrate1" />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <TrendContainer>
          <Trend
            title={<FormattedMessage id="trends.recordsByKingdom" />}
            info={<FormattedMessage id="trends.occByKingdomChartText" />}
            imgfile="occ_kingdom"
          />
          <Trend
            title={<FormattedMessage id="trends.recordsForAnimalia" />}
            info={<FormattedMessage id="trends.animaliaByBasisOfRecordText" />}
            imgfile="occ_animaliaBoR"
          />
          <Trend
            title={<FormattedMessage id="trends.recordsForPlantae" />}
            info={<FormattedMessage id="trends.plantaeByBasisOfRecordText" />}
            imgfile="occ_plantaeBoR"
          />
        </TrendContainer>
      </CardContent>
    </Card>
  );
}

function SpeciesCounts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="g-text-xl">
          <FormattedMessage id="trends.speciesCounts" />
        </CardTitle>
        <CardDescription className="g-text-inherit">
          <FormattedMessage id="trends.theseChartsIllustrate2" />
        </CardDescription>
      </CardHeader>

      <CardContent bottomPadding={false}>
        <Callout>
          <Callout.Title>
            <FormattedMessage id="trends.definition" />
          </Callout.Title>
          <Callout.Description>
            <p>
              <FormattedMessage id="trends.speciesCountDescription" />
            </p>
          </Callout.Description>
        </Callout>
      </CardContent>

      <CardContent topPadding>
        <TrendContainer>
          <Trend
            title={<FormattedMessage id="trends.speciesCountByKingdom" />}
            info={<FormattedMessage id="trends.numOccSpeciesByKingdom" />}
            imgfile="spe_kingdom"
          />
          <Trend
            title={<FormattedMessage id="trends.speciesCountsForSpecimenRecords" />}
            info={<FormattedMessage id="trends.numSpeciesFromSpecimens" />}
            imgfile="spe_kingdom_specimen"
          />
          <Trend
            title={<FormattedMessage id="trends.speciesCountForObservationRecords" />}
            info={<FormattedMessage id="trends.numSpeciesAssociatedWithObsRecords" />}
            imgfile="spe_kingdom_observation"
          />
        </TrendContainer>
      </CardContent>
    </Card>
  );
}

function TemporalTrends() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="g-text-xl">
          <FormattedMessage id="trends.timeAndSeasonality" />
        </CardTitle>
        <CardDescription className="g-text-inherit">
          <FormattedMessage id="trends.theseChartsIllustrate3" />
        </CardDescription>
      </CardHeader>

      <CardContent bottomPadding={false}>
        <Callout>
          <Callout.Title>
            <FormattedMessage id="trends.definition" />
          </Callout.Title>
          <Callout.Description>
            <p>
              <FormattedMessage id="trends.speciesCountsAreBasedOnTheNumberOfBinomialScientificNames" />
            </p>
          </Callout.Description>
        </Callout>
      </CardContent>

      <CardContent topPadding>
        <TrendContainer>
          <Trend
            title={<FormattedMessage id="trends.recordsByYearOfOccurrence" />}
            info={<FormattedMessage id="trends.theNumberOfOccurrenceRecordsAvailable" />}
            imgfile="occ_yearCollected"
          />
          <Trend
            title={<FormattedMessage id="trends.speciesByYearOfOccurrence" />}
            info={<FormattedMessage id="trends.theNumberOfSpeciesForWhichRecordsAreAvailable" />}
            imgfile="spe_yearCollected"
          />
        </TrendContainer>
      </CardContent>

      <CardContent>
        <TrendContainer>
          <Trend
            title={<FormattedMessage id="trends.recordsByDayOfYear" />}
            info={<FormattedMessage id="trends.recordsAvailableForEachDayOfTheYear" />}
            imgfile="occ_dayCollected"
          />
          <Trend
            title={<FormattedMessage id="trends.speciesByDayOfYear" />}
            info={
              <FormattedMessage id="trends.speciesForWhichRecordsAreAvailableForEachDayOfTheYear" />
            }
            imgfile="spe_dayCollected"
          />
        </TrendContainer>
      </CardContent>

      <CardContent>
        <Callout>
          <Callout.Title>
            <FormattedMessage id="trends.note" />
          </Callout.Title>
          <Callout.Description>
            <p>
              <FormattedMessage id="trends.theseChartsMayRevealPatternsThatRepresentBiasesInDataCollection" />
            </p>
            <br />
            <Message
              className="g-text-sm [&_a]:g-text-primary-500"
              id="trends.byGeneratingTheseChartsAnIssueWasDetected"
            />
          </Callout.Description>
        </Callout>
      </CardContent>
    </Card>
  );
}

function CompletenessAndPrecision() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="g-text-xl">
          <FormattedMessage id="trends.completenessAndPrecision" />
        </CardTitle>
        <CardDescription className="g-text-inherit">
          <FormattedMessage id="trends.theseChartsIllustrate4" />
        </CardDescription>
      </CardHeader>

      <CardContent bottomPadding={false}>
        <Callout>
          <Callout.Title>
            <FormattedMessage id="trends.definition" />
          </Callout.Title>
          <Callout.Description>
            <p>
              <FormattedMessage id="trends.aRecordIsHereDefinedToBeCompleteIfItIncludes" />
            </p>
          </Callout.Description>
        </Callout>
      </CardContent>

      <CardContent topPadding>
        <h3 className="g-text-lg g-font-bold g-pb-2">
          <FormattedMessage id="trends.completeness" />
        </h3>
        <p className="g-text-sm g-pb-4">
          <FormattedMessage id="trends.theseChartsIllustrate5" />
        </p>
        <TrendContainer>
          <Trend title={<FormattedMessage id="trends.allRecords" />} imgfile="occ_complete" />
          <Trend
            title={<FormattedMessage id="trends.specimenRecords" />}
            imgfile="occ_complete_specimen"
          />
          <Trend
            title={<FormattedMessage id="trends.observationRecords" />}
            imgfile="occ_complete_observation"
          />
        </TrendContainer>
      </CardContent>

      <CardContent>
        <h3 className="g-text-lg g-font-bold g-pb-2">
          <FormattedMessage id="trends.taxonomicPrecision" />
        </h3>
        <p className="g-text-sm g-pb-4">
          <FormattedMessage id="trends.theseChartsIllustrate6" />
        </p>
        <TrendContainer>
          <Trend
            title={<FormattedMessage id="trends.allRecords" />}
            imgfile="occ_complete_kingdom"
          />
          <Trend
            title={<FormattedMessage id="trends.specimenRecords" />}
            imgfile="occ_complete_kingdom_specimen"
          />
          <Trend
            title={<FormattedMessage id="trends.observationRecords" />}
            imgfile="occ_complete_kingdom_observation"
          />
        </TrendContainer>
      </CardContent>

      <CardContent>
        <h3 className="g-text-lg g-font-bold g-pb-2">
          <FormattedMessage id="trends.geographicPrecision" />
        </h3>
        <p className="g-text-sm g-pb-4">
          <FormattedMessage id="trends.theseChartsIllustrate7" />
        </p>
        <TrendContainer>
          <Trend title={<FormattedMessage id="trends.allRecords" />} imgfile="occ_complete_geo" />
          <Trend
            title={<FormattedMessage id="trends.specimenRecords" />}
            imgfile="occ_complete_geo_specimen"
          />
          <Trend
            title={<FormattedMessage id="trends.observationRecords" />}
            imgfile="occ_complete_geo_observation"
          />
        </TrendContainer>
      </CardContent>

      <CardContent>
        <h3 className="g-text-lg g-font-bold g-pb-2">
          <FormattedMessage id="trends.temporalPrecision" />
        </h3>
        <p className="g-text-sm g-pb-4">
          <FormattedMessage id="trends.theseChartsIllustrate8" />
        </p>
        <TrendContainer>
          <Trend title={<FormattedMessage id="trends.allRecords" />} imgfile="occ_complete_date" />
          <Trend
            title={<FormattedMessage id="trends.specimenRecords" />}
            imgfile="occ_complete_date_specimen"
          />
          <Trend
            title={<FormattedMessage id="trends.observationRecords" />}
            imgfile="occ_complete_date_observation"
          />
        </TrendContainer>
      </CardContent>
    </Card>
  );
}

function GeographicCoverage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="g-text-xl">
          <FormattedMessage id="trends.geographicCoverageForRecordedSpecies" />
        </CardTitle>
        <CardDescription className="g-text-inherit">
          <FormattedMessage id="trends.theseChartsIllustrate9" />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <TrendContainer>
          <Trend title={<FormattedMessage id="trends.oneDegree" />} imgfile="occ_cells_one_deg" />
          <Trend title={<FormattedMessage id="trends.halfDegree" />} imgfile="occ_cells_half_deg" />
          <Trend
            title={<FormattedMessage id="trends.pointOneDegree" />}
            imgfile="occ_cells_point_one_deg"
          />
        </TrendContainer>
      </CardContent>
    </Card>
  );
}

function DataSharing() {
  const { countryCode } = useTrendContext();
  const hasCountry = Boolean(countryCode);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="g-text-xl">
          <FormattedMessage id="trends.dataSharingWithCountryOfOrigin" />
        </CardTitle>
        <CardDescription className="g-text-inherit">
          {hasCountry ? (
            <FormattedMessage
              id="trends.thisChartShowsTheNumberOfRecordsAboutBiodiversityOccurringInCountry"
              values={{
                TRANSLATED_COUNTRY: <FormattedMessage id={`enums.countryCode.${countryCode}`} />,
              }}
            />
          ) : (
            <FormattedMessage id="trends.thisChartShowsGlobalTrends" />
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <TrendContainer>
          <Trend imgfile="occ_repatriation" />
        </TrendContainer>
      </CardContent>
    </Card>
  );
}
