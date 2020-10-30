/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useContext } from "react";
import { FormattedMessage, FormattedDate } from "react-intl";
import ThemeContext from "../../../style/themes/ThemeContext";
import specialFields from "./specialFields";
import * as css from "../styles";
import { Accordion, Properties } from "../../../components";
import { Classification } from "./TaxonClassification/TaxonClassification"
import { MapPresentation } from "./Map/Map"
import { DynamicProperties } from "./DynamicProperties/DynamicProperties"
import { HyperText } from '../../../components';
import { prettifyEnum } from '../../../utils/labelMaker/config2labels';
import LinksContext from '../../../search/OccurrenceSearch/config/links/LinksContext';

import _ from "lodash";


const { Term: T, Value: V } = Properties;

export function Groups({
  data = {},
  isSpecimen,
  loading,
  error,
  className,
  showAll,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const links = useContext(LinksContext)
  const { occurrence } = data;
  if (loading || !occurrence) return <h1>Loading</h1>;
  const {
    occurrence: { groups },
  } = data;

  return [
    "Record",
    "Taxon",
    "Location",
    "Occurrence",
    "Event",
    "Organism",
    "MaterialSample",
    "GeologicalContext",
    "Identification",
    "Other"
  ].map((group) =>
    getGroup(
      group,
      groups[group],
      isSpecimen,
      showAll,
      theme,
      occurrence,
      links
    )
  );
}

function showTerm(groupTitle, term, showAll) {
  if (!showAll) {
    if (!term) {
      debugger;
    }
    return !term.hideInDefaultView && !specialFields[groupTitle][term.label];
  } else {
    return true;
  }
}

function getGroup(
  title,
  group,
  isSpecimen,
  showAll,
  theme,
  occurrence,
  links
) {
  if (_.isEmpty(group) || group.filter((term) => showTerm(title, term, showAll)).length === 0) {
    return null;
  };
  const groupMap = group.reduce((acc, cur) => {
    acc[cur.label] = cur;
    return acc
  }, {})
  return (
    <Accordion
      key={title}
      css={css.accordion({ theme })}
      summary={title}
      defaultOpen={true}
    >
      <Properties style={{ fontSize: 13 }} horizontal={true}>
        {/*         Scientific names and classification is in the summary

{title === "Taxon" && !showAll && (
            <>
            <T>
                <FormattedMessage
                  id={`ocurrenceFieldNames.scientificName`}
                  defaultMessage={"Scientific Name"}
                />
              </T>
              <V>
              <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }} />
              {groupMap.scientificName?.issues?.length > 0 && " " &&
              groupMap.scientificName.issues.map((i) => (
                <span css={css.issuePill(i)} key={i}>
                  <FormattedMessage
                    id={`issueEnum.${i.id}`}
                    defaultMessage={i.id}
                  />
                </span>
              ))}
              {groupMap.scientificName?.issues?.length > 0 && <div css={css.termRemark()}>{groupMap.scientificName?.verbatim}</div>}
              </V>
              {groupMap.synonym?.value === true && groupMap.acceptedScientificName?.value &&  <> <T>
                <FormattedMessage
                  id={`ocurrenceFieldNames.acceptedScientificName`}
                  defaultMessage={"Accepted Scientific Name"}
                />
              </T>
              <V>
              <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.acceptedUsage.formattedName }} />
              </V></>}
              <T>
                <FormattedMessage
                  id={`ocurrenceFieldNames.classification`}
                  defaultMessage={"Classification"}
                />
              </T>
              <V>
                <Classification taxon={group} showUnknownRanks={true}/>
              </V>
            
            </>
          )} */}
        {title === "Location" && !showAll && groupMap.decimalLatitude && groupMap.decimalLongitude && <>
          <T>
            <FormattedMessage
              id={`ocurrenceFieldNames.coordinates`}
              defaultMessage={"Coordinates"}
            />
          </T>
          <V>
            <MapPresentation location={group} />
          </V>

        </>}
        {title === "Record" && !showAll && groupMap.dynamicProperties?.verbatim && <>
          <T>
            <FormattedMessage
              id={`ocurrenceFieldNames.dynamicProperties`}
              defaultMessage={"Dynamic properties"}
            />
          </T>
          <V>
            <DynamicProperties data={groupMap.dynamicProperties.verbatim} />
          </V>

        </>}
        {group
          .filter((term) => showTerm(title, term, showAll))
          .map((term) => (
            <React.Fragment key={term.label}>
              <T>
                <FormattedMessage
                  id={`ocurrenceFieldNames.${term.label}`}
                  defaultMessage={_.startCase(term.label)}
                />
              </T>
              <V>
                {getValue(term)}
              </V>
            </React.Fragment>
          ))}
      </Properties>
    </Accordion>
  );
}


function renderAsType({ label, value, verbatim, renderAsType }) {
  switch (renderAsType) {
    case 'date':
      return <FormattedDate value={value}
        year="numeric"
        month="long"
        day="2-digit" />;
    case 'enum':
      return value ? <FormattedMessage id={`enums.${label}.${value}`} defaultMessage={value} /> : <span css={css.termRemark()}>{verbatim}</span>
    default:
      return <HyperText text={value || verbatim} />;
  }
}

function getValue(term) {

  return <>
    <div>
      {renderAsType(term)}{" "}

      {term.issues &&
        term.issues.length > 0 &&
        term.issues.map((i) => (
          <span css={css.issuePill(i)} key={i}>
            <FormattedMessage
              id={`issueEnum.${i.id}`}
              defaultMessage={prettifyEnum(i.id)}
            />
          </span>
        ))}
    </div>
    {term.value && term.verbatim && term.value != term.verbatim && <div css={css.termRemark()}>{term.verbatim}</div>}
    {term.remarks && term.remarks === "INFERRED" && (
      <span css={css.termRemark()}>{term.remarks.toLowerCase()}</span>
    )}
  </>
}




