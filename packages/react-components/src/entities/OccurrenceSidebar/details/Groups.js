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
import _ from "lodash";

const { Term: T, Value: V } = Properties;

export function Groups({
  data = {},
  isSpecimen,
  loading,
  error,
  className,
  showAll,
  verbatim,
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
      verbatim,
      theme,
      occurrence
    )
  );
}

function showTerm(groupTitle, term, showAll, verbatim) {
   if (verbatim) {
    return true;
  } else if (!showAll) {
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
  verbatim,
  theme,
  occurrence
) {
  if (_.isEmpty(group)) {
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
                <Classification taxon={group} />
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
          {title === "Location" && !showAll &&  <>
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
            .filter((term) => showTerm(title, term, showAll, verbatim))
            .map((term) => (
              <React.Fragment key={term.label}>
                <T>
                  <FormattedMessage
                    id={`ocurrenceFieldNames.${term.label}`}
                    defaultMessage={_.startCase(term.label)}
                  />
                </T>
                <V>
                    {getValue(term, verbatim)}
                </V>
              </React.Fragment>
            ))}
        </Properties>
      </Accordion>
    );
}

function getValue(term, verbatim){

    return <>
        {term.remarks && term.remarks !== "NOT_INDEXED" && (
                      <span css={css.termRemark()}>{term.remarks.toLowerCase()}</span>
                    )}
                  <div>
                    {term.value || term.verbatim}{" "}
                    
                    {term.issues &&
                      term.issues.length > 0 &&
                      term.issues.map((i) => (
                        <span css={css.issuePill(i)}>
                          <FormattedMessage
                            id={`issueEnum.${i.id}`}
                            defaultMessage={i.id}
                          />
                        </span>
                      ))}
                  </div>
                  {verbatim && <div css={css.termRemark()}>{term.verbatim}</div>}
    </>
}




