/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useContext } from "react";
import { FormattedMessage, FormattedDate } from "react-intl";
import ThemeContext from "../../../style/themes/ThemeContext";
import specialFields from "./specialFields";
import * as css from "../styles";
import { Accordion, Properties } from "../../../components";
import {Classification} from "./Classification/Classification"
import {MapPresentation} from "./Map/Map"
import {DynamicProperties} from "./DynamicProperties/DynamicProperties"
import {HyperText} from '../../../components';

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
    "Dataset",
    "Crawling",
  ].map((group) =>
    getGroup(
      group,
      groups[group],
      isSpecimen,
      showAll,
      theme,
      occurrence
    )
  );
}

function showTerm(groupTitle, term, showAll) {
  if (!showAll) {
    return !term.hideInDefaultView /* && _.get(term, "remarks") !== "NOT_INDEXED" */ && !specialFields[groupTitle][term.label];
  }  else {
    return true;
  }
}

function getGroup(
  title,
  group,
  isSpecimen,
  showAll,
  theme,
  occurrence
) {
  if (_.isEmpty(group) || group.filter((term) => showTerm(title, term, showAll)).length === 0) {
    return null;
  }; 
  const groupMap = group.reduce((acc, cur) => {
    acc[cur.label]= cur;
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
          {title === "Taxon" && !showAll && (
            <>
            <T>
                <FormattedMessage
                  id={`ocurrenceFieldNames.scientificName`}
                  defaultMessage={"Scientific Name"}
                />
              </T>
              <V>
                {groupMap.scientificName.value}
              </V>
              <T>
                <FormattedMessage
                  id={`ocurrenceFieldNames.classification`}
                  defaultMessage={"Classification"}
                />
              </T>
              <V>
                <Classification taxon={group} showUnknownRanks={true}/>
              </V>
            {groupMap.synonym?.value === true && groupMap.acceptedScientificName?.value &&  <> <T>
                <FormattedMessage
                  id={`ocurrenceFieldNames.taxonomicStatus`}
                  defaultMessage={"Taxonomic Status"}
                />
              </T>
              <V>
                {`Synonym of ${groupMap.acceptedScientificName.value}`}
              </V></>}
            </>
          )}
          {title === "Location" && !showAll && groupMap.decimalLatitude && groupMap.decimalLongitude &&  <>
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
          {title === "Record" && !showAll &&  groupMap.dynamicProperties?.verbatim && <>
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


function renderAsType({label, value, verbatim, renderAsType}){
  switch(renderAsType) {
    case 'date':
      return <FormattedDate value={value}
      year="numeric"
      month="long"
      day="2-digit" />;
    case 'enum':
        return <FormattedMessage id={`enums.${label}.${value}`} />;
    default:
      return <HyperText text={value || verbatim} />;
  }
}

function getValue(term){
    
    return <>
                  <div>
                    {renderAsType(term)}{" "}
                    
                    {term.issues &&
                      term.issues.length > 0 &&
                      term.issues.map((i) => (
                        <span css={css.issuePill(i)} key={i}>
                          <FormattedMessage
                            id={`issueEnum.${i.id}`}
                            defaultMessage={i.id}
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




