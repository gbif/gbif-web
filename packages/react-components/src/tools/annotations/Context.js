import { css, jsx } from '@emotion/react';
import React, { useEffect, useState, useContext } from 'react';
import { MdFilter, MdFilterList, MdMore, MdMoreVert } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { StringParam, useQueryParam } from 'use-query-params';
import { Button, ButtonGroup, Classification, Tooltip, Suggest } from '../../components';
import axios from '../../dataManagement/api/axios';
import SearchContext from '../../search/SearchContext';
import { keyCodes } from '../../utils/util';
import { FilterContext } from '../../widgets/Filter/state';

const suggestStyle = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' };

const BACKBONE_KEY = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';
async function getTaxonSuggestions({ q, axios }) {
  const response = await axios.get(`http://api.gbif.org/v1/species/suggest?datasetKey=${BACKBONE_KEY}&limit=20&q=${q}`);
  return response.data;
}

async function getDatasetSuggestions({ q, axios }) {
  const response = await axios.get(`http://api.gbif.org/v1/dataset/suggest?limit=20&q=${q}`);
  return response.data;
}

const taxonConfig = {
  //What placeholder to show
  // placeholder: 'Search by scientific name',
  placeholderTranslationPath: 'search.placeholders.default',
  // how to get the list of suggestion data
  getSuggestions: getTaxonSuggestions,
  // how to map the results to a single string value
  itemToString: suggestion => suggestion.scientificName,
  // how to display the individual suggestions in the list
  renderSuggestion: function ScientificNameSuggestItem(suggestion) {
    return <div style={{ maxWidth: '100%' }}>
      <div>
        {suggestion.scientificName}
      </div>
    </div>
  }
};

const datasetConfig = {
  //What placeholder to show
  // placeholder: 'Search by scientific name',
  placeholderTranslationPath: 'search.placeholders.default',
  // how to get the list of suggestion data
  getSuggestions: getDatasetSuggestions,
  // how to map the results to a single string value
  itemToString: suggestion => suggestion.title,
  // how to display the individual suggestions in the list
  renderSuggestion: function DatasetSuggestItem(suggestion) {
    return <div style={{ maxWidth: '100%' }}>
      <div>
        {suggestion.title}
      </div>
    </div>
  }
};

function Context({ onChange, ...props }) {
  // const [contextType, setContextType] = useState('TAXON');
  // const [contextKey, setContextKey] = useState('');
  const [contextType = 'TAXON', setContextType] = useQueryParam('type', StringParam);
  const [contextKey, setContextKey] = useQueryParam('key', StringParam);

  const currentFilterContext = useContext(FilterContext);

  const { filters, tableConfig, labelMap } = useContext(SearchContext);
  const testContext = useContext(SearchContext);
  const TaxonPopover = filters?.taxonKey?.Popover;
  const DatasetPopover = filters?.datasetKey?.Popover;
  const TaxonButton = filters?.taxonKey?.Button;
  const DatasetButton = filters?.datasetKey?.Button;
  const TaxonLabel = labelMap.taxonKey;

  return <>
    <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
      <div>
        <ButtonGroup css={css`
        width: 100%;
        border-bottom: 1px solid var(--paperBorderColor);
        >button {
          flex: 1 1 50%!important;
          border-bottom-left-radius: 0!important;
          border-bottom-right-radius: 0!important;
          border: none!important;
        }
      `}>
          <Button appearance={contextType === 'TAXON' ? 'primary' : 'primaryOutline'} truncate onClick={() => {setContextType('TAXON'); setContextKey();}}>Taxon</Button>
          <Button appearance={contextType === 'DATASET' ? 'primary' : 'primaryOutline'} onClick={() => {setContextType('DATASET'); setContextKey();}}>Dataset</Button>
          {/* <TaxonPopover> */}
            {/* <Button style={{ flex: '0 0 auto!important!important' }} appearance="primaryOutline"><MdMoreVert /></Button> */}
          {/* </TaxonPopover> */}
        </ButtonGroup>
      </div>
      {contextType === 'TAXON' && <Suggest
        css={css`
          margin: 0;
          border: none;
          width: 100%;
          input {
            border-radius: 0 0 4px 4px;
            border: none;
          }
        `}
        {...taxonConfig}
        initialValue={async (axios) => (await axios.get(`http://api.gbif.org/v1/species/${contextKey}`)).data?.scientificName}
        onSelect={(item) => {
          setContextKey(item?.key);
        }}
        allowClear={true}
      />}
      {contextType === 'DATASET' && <Suggest
        css={css`
          margin: 0;
          border: none;
          width: 100%;
          input {
            border-radius: 0 0 4px 4px;
            border: none;
          }
        `}
        {...datasetConfig}
        initialValue={async (axios) => (await axios.get(`http://api.gbif.org/v1/dataset/${contextKey}`)).data?.title}
        onSelect={(item) => {
          setContextKey(item?.key);
        }}
        allowClear={true}
      />}
    </div>
    {/* <button><TaxonLabel id="10800638" /></button> */}
    {/* {currentFilterContext?.filter?.must?.taxonKey?.length > 0 && <TaxonButton style={{fontSize: 11}}/>} */}
  </>

}

export { Context };