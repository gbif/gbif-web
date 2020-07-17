/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useContext } from "react";
import { FormattedMessage, FormattedDate } from "react-intl";
import ThemeContext from "../../../style/themes/ThemeContext";
import * as css from "../styles";
import {
  Accordion,
  Properties

} from "../../../components";
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
    "Occurrence",
    "Record",
    "Organism",
    "MaterialSample",
    "Event",
    "Location",
    "GeologicalContext",
    "Identification",
    "Taxon",
    "Dataset",
    "Crawling",
  ].map((group) => getGroup(group, groups[group], isSpecimen, showAll, verbatim));
}

function showTerm(term, showAll, verbatim){
    if(verbatim){
        return true
    } else if(!showAll){
        return !term.hideInDefaultView && _.get(term, 'remarks') !== 'EXCLUDED'
    } else {
        return _.get(term, 'remarks') !== 'EXCLUDED'
    }
}

function getGroup(title, group, isSpecimen, showAll, verbatim, theme) {
  if (_.isEmpty(group)) return null;
  return (
    <Accordion
      key={title}
      css={css.accordion({ theme })}
      summary={title}
      defaultOpen={true}
    >
      <Properties style={{ fontSize: 13 }} horizontal={true}>
        {group.filter((term) => showTerm(term, showAll, verbatim) )
          .map((term) => (
            <React.Fragment key={term.label}>
              <T>
                <FormattedMessage
                  id={`ocurrenceFieldNames.${term.label}`}
                  defaultMessage={term.label}
                />
              </T>
              <V>
               <div>{term.value}{" "}
                {term.remarks && (
                  <span className="remarks">{term.remarks}</span>
                )}
                {term.issues &&
                  term.issues.length > 0 &&
                  term.issues.map((i) => (
                    <span className={`issue ${i.severity}`}>
                      <FormattedMessage
                        id={`issueEnum.${i.id}`}
                        defaultMessage={i.id}
                      />
                    </span>
                  ))}
                  </div> 
                  {verbatim && <div>
                    {term.verbatim}
                      </div>}
              </V>
            </React.Fragment>
          ))}
      </Properties>
    </Accordion>
  );
}
