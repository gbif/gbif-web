
import { jsx } from '@emotion/react';
import React from "react";
import {
  Properties,
  Term,
  Value,
} from "../../../../components/Properties/Properties";
import { Accordion } from "../../../../components/Accordion/Accordion";
import get from "lodash/get";
import styles from "./styles";

export const ItemDetailsContainer = ({ padding = 8, ...props }) => {
  return <div css={styles.itemDetails({ padding })} {...props} />;
};

const ItemDetails = ({ item }) => {
  return (
    <ItemDetailsContainer>
      <h2 css={styles.speciesName({ fontSize: 14 })}>
        {get(item, "_source.gbifClassification.usage.name")}
      </h2>
      <Accordion summary="Classification">
        <Properties>
          {get(item, "_source.gbifClassification.classification").map((t) => (
            <React.Fragment key={t.name}>
              <Term>{t.rank.toLowerCase()}</Term>
              <Value>{t.name}</Value>
            </React.Fragment>
          ))}
        </Properties>
      </Accordion>
      <Properties>
        {get(item, `_source.eventDate`) && (
          <>
            <Term>Event Date</Term>
            <Value>
              {new Date(get(item, `_source.eventDate`)).toDateString()}
            </Value>
          </>
        )}

        <Term>Location</Term>
        <Value>
          {get(item, `_source.stateProvince`)
            ? get(item, `_source.stateProvince`) + ", "
            : ""}
          {get(item, `_source.country`)}
        </Value>
        {get(item, `_source.recordedBy`) && (
          <>
            <Term>Recorded by</Term>
            <Value>{get(item, `_source.recordedBy`)}</Value>
          </>
        )}
        {get(item, `_source.datasetTitle`) && (
          <>
            <Term>Dataset</Term>
            <Value>{get(item, `_source.datasetTitle`)}</Value>
          </>
        )}
        {get(item, `_source.publisherTitle`) && (
          <>
            <Term>Publisher</Term>
            <Value>{get(item, `_source.publisherTitle`)}</Value>
          </>
        )}
      </Properties>
    </ItemDetailsContainer>
  );
};

export default ItemDetails;