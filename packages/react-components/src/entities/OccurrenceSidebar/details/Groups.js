
import { jsx } from '@emotion/react';
import React, { useContext } from "react";
import { FormattedMessage, FormattedDate } from "react-intl";
import ThemeContext from "../../../style/themes/ThemeContext";
import specialFields from "./specialFields";
import * as css from "../styles";
import { Accordion, Properties, Tag, Tags } from "../../../components";
import { Classification } from "./TaxonClassification/TaxonClassification"
import { MapPresentation } from "./Map/Map"
import { DynamicProperties } from "./DynamicProperties/DynamicProperties"
import { HyperText } from '../../../components';
import { prettifyEnum } from '../../../utils/labelMaker/config2labels';
import LinksContext from '../../../search/OccurrenceSearch/config/links/LinksContext';
import { occurrenceFields, orderedGroups } from './fields';
import { BsLightningFill } from 'react-icons/bs';

import _ from "lodash";

const { Term: T, Value: V } = Properties;

export function Groups({
  data = {},
  isSpecimen,
  loading,
  error,
  className,
  showAll,
  setActiveImage,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const links = useContext(LinksContext)
  const { occurrence } = data;
  if (loading || !occurrence) return <h1>Loading</h1>;
  const {
    occurrence: { terms },
  } = data;
  const termMap = terms.reduce((map, term) => { map[term.simpleName] = term; return map; }, {});

  return orderedGroups.map(group =>
    getGroup({
      groupName: group,
      // group: groups[group],
      termMap,
      isSpecimen,
      showAll,
      theme,
      occurrence,
      links,
      setActiveImage
    })
  );
}

function getGroup({
  groupName,
  termMap,
  isSpecimen,
  showAll,
  setActiveImage,
  theme,
  occurrence,
  links
}) {
  // if (_.isEmpty(group) || group.filter((term) => showTerm(groupName, term, showAll)).length === 0) {
  //   return null;
  // };
  const fields = occurrenceFields[groupName]
    .filter(nameConfig => {
      // get the data for the field
      const config = typeof nameConfig === 'string' ? { name: nameConfig } : nameConfig;
      let term = termMap[config.name];
      // No need to show fields without values
      if (!term && !config.Component && !config.Value) return false;
      if (config.condition && !config.condition({ occurrence, term, showAll, termMap })) {
        return false;
      }
      return true;
    });

  if (fields.length === 0) return null;

  return (
    <Accordion
      key={groupName}
      css={css.accordion({ theme })}
      // summary={groupName}
      summary={<FormattedMessage id={`occurrenceDetails.groups.${groupName}`} />}
      defaultOpen={true}
    >
      <Properties style={{ fontSize: 13 }}>
        {/* {groupName === "location" && !showAll && group.decimalLatitude && group.decimalLongitude && <>
          <T>
            <FormattedMessage
              id={`occurrenceFieldNames.coordinates`}
              defaultMessage={"Coordinates"}
            />
          </T>
          <V>
            <MapPresentation location={group} />
          </V>

        </>}
        {groupName === "record" && !showAll && group.dynamicProperties?.verbatim && <>
          <T>
            <FormattedMessage
              id={`occurrenceFieldNames.dynamicProperties`}
              defaultMessage={"Dynamic properties"}
            />
          </T>
          <V>
            <DynamicProperties data={group.dynamicProperties.verbatim} />
          </V>

        </>} */}
        {fields
          .map(nameConfig => {
            const config = typeof nameConfig === 'string' ? { name: nameConfig } : nameConfig;
            const name = config.name;
            const fieldName = config.trKey || `occurrenceFieldNames.${name}`;
            let term = termMap[name];
            if (config.Component) {
              return <config.Component key={name} name={name} term={term} occurrence={occurrence} theme={theme} setActiveImage={setActiveImage} termMap={termMap} />
            }
            return <React.Fragment key={name}>
              <T>
                <FormattedMessage
                  id={fieldName}
                  defaultMessage={_.startCase(name)}
                />
              </T>
              <div>
                <V style={{ position: 'relative' }}>
                  {config.Value
                    ? <config.Value key={name} name={name} term={term} occurrence={occurrence} theme={theme} setActiveImage={setActiveImage} termMap={termMap} />
                    : getValue({ term, config })}
                  {term?.issues?.length > 0 && <Tags>
                    {term.issues.map((i) => (
                      <Tag type={i.severity.toLowerCase()} key={i.id}>
                        <FormattedMessage
                          id={`enums.occurrenceIssue.${i.id}`}
                          defaultMessage={prettifyEnum(i.id)}
                        />
                      </Tag>
                    ))}
                  </Tags>}
                  {/* {term?.remarks === 'INFERRED' && <Tag type="light">Inferred</Tag>} */}
                </V>
                {(term?.verbatim && (showAll || (!config.hideVerbatim && term.remarks && term.remarks !== 'INFERRED'))) && <>
                  <V title="Verbatim">
                    <span style={{ opacity: .6 }}>{term.verbatim}</span> <Tags>
                      <Tag type="light">
                        <FormattedMessage id="occurrenceDetails.info.original" />
                      </Tag>
                      {term.value === null && <Tag type="light">
                        <FormattedMessage id="occurrenceDetails.info.excluded" />
                      </Tag>}
                    </Tags>
                  </V>
                </>}
              </div>
            </React.Fragment>
          })
        }
      </Properties>
    </Accordion>
  );
}


function renderAsType({ term, config }) {
  const { value, htmlValue, simpleName } = term;
  if (config.enum) return <FormattedMessage id={`enums.${config.enum}.${value}`} defaultMessage={value} />
  // if (term.simpleName === 'license') debugger;
  if (typeof htmlValue === 'string') return <span dangerouslySetInnerHTML={{ __html: (htmlValue) }} />;
  if (value !== null) return value;
  // if (verbatim) return verbatim;
  return null;

  // switch (renderAsType) {
  //   case 'date':
  //     return <FormattedDate value={value}
  //       year="numeric"
  //       month="long"
  //       day="2-digit" />;
  //   case 'enum':
  //     return value ? <FormattedMessage id={`enums.${label}.${value}`} defaultMessage={value} /> : <span css={css.termRemark()}>{verbatim}</span>
  //   default:
  //     return <HyperText text={value || verbatim} />;
  // }
}

function getValue({ term, config }) {
  return <>
    {renderAsType({ term, config })}{" "}

    {/* {term.issues &&
        term.issues.length > 0 &&
        term.issues.map((i) => (
          <span css={css.issuePill(i)} key={i}>
            <FormattedMessage
              id={`enums.occurrenceIssue.${i.id}`}
              defaultMessage={prettifyEnum(i.id)}
            />
          </span>
        ))} */}
    {/* {term.value && term.verbatim && term.value != term.verbatim && <div css={css.termRemark()}>{term.verbatim}</div>}
    {term.remarks && term.remarks === "INFERRED" && (
      <span css={css.termRemark()}>{term.remarks.toLowerCase()}</span>
    )} */}
  </>
}




