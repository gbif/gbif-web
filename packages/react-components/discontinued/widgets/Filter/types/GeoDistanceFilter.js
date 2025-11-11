
import { jsx, css } from '@emotion/react';
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage, formatMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import get from 'lodash/get';
import unionBy from 'lodash/unionBy';
import { hash } from '../../../utils/util';
import PopoverFilter from './PopoverFilter';
import { Button, Input, Select } from '../../../components';
import { Option, Filter, SummaryBar, FilterBody, Footer } from '../utils';

/*
FilterContent component to show the header, menu search options. but not the apply and do not scope filter state
FilterPopover sets a tmp filter scope and adds a footer. inserts the content.
problem, the footer depends on the content and state (prose or not)
*/
export const FilterContent = ({ config = {}, translations, labelledById, LabelFromID, hide, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const { formatMessage } = useIntl();
  const { placeholderLat, placeholderLon, placeholderDist } = config;
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterHandle}`, []);
  const [options, setOptions] = useState(initialOptions.filter(x => x.type !== 'isNotNull'));
  const [dist, setDist] = useState('5');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [unit, setUnit] = useState('km');
  const formattedPlaceholderLat = formatMessage({ id: placeholderLat });
  const formattedPlaceholderLon = formatMessage({ id: placeholderLon });
  const formattedPlaceholderDist = formatMessage({ id: placeholderDist });
  const singleSelect = config.singleSelect;

  // units
  const formattedUnitKm = formatMessage({ id: 'intervals.units.name.km' });
  const formattedUnitM = formatMessage({ id: 'intervals.units.name.m' });
  const formattedUnitMi = formatMessage({ id: 'intervals.units.name.mi' });
  const formattedUnitFt = formatMessage({ id: 'intervals.units.name.ft' });

  return <Filter
    labelledById={labelledById}
    title={<FormattedMessage
      id={translations?.name || `filters.${filterHandle}.name`}
      defaultMessage={translations?.name}
    />}
    aboutText={translations.description && <FormattedMessage
      id={translations.description || `filters.${filterHandle}.description`}
      defaultMessage={translations.description}
    />}
    onFilterChange={onFilterChange}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, toggle, setFullField, checkedMap, formId, summaryProps, footerProps }) => {

      // Find a better generic way of handling cases where the UI cannot show a filter
      // if (options.length > 1) {
      //   return <div>Complex filter</div>
      // }

      const submitDisabled = !dist || !lat || !lon || !unit;
      return <>
        <div css={css`
          input, select {
            margin: 4px;
          }
        `} style={{ margin: '10px', zIndex: 10, display: 'inline-block', position: 'relative' }}>
          <div style={{ display: 'flex' }}>
            <Input
              ref={focusRef}
              style={{ flex: '1 1 50%' }}
              value={lat}
              onChange={e => {
                const value = e.target.value;
                if (config.latRegex) {
                  if (e.target.value.match(config.latRegex) !== null) {
                    setLat(value);
                  }
                } else {
                  setLat(value);
                }
              }}
              placeholder={formattedPlaceholderLat}
            />
            <Input
              style={{ flex: '1 1 50%' }}
              value={lon}
              onChange={e => {
                const value = e.target.value;
                if (config.lonRegex) {
                  if (e.target.value.match(config.lonRegex) !== null) {
                    setLon(value);
                  }
                } else {
                  setLon(value);
                }
              }}
              placeholder={formattedPlaceholderLon}
            />
          </div>
          <div style={{ display: 'flex' }}>
            <Input
              style={{ flex: '1 1 50%' }}
              value={dist}
              onChange={e => {
                const value = e.target.value;
                if (config.kmRegex) {
                  if (e.target.value.match(config.kmRegex) !== null) {
                    setDist(value);
                  }
                } else {
                  setDist(value);
                }
              }}
              placeholder={formattedPlaceholderDist}
            />
            <Select value={unit} onChange={e => setUnit(e.target.value)} name="units" style={{ flex: '1 1 50%' }}>
              <option value="km">{formattedUnitKm}</option>
              <option value="m">{formattedUnitM}</option>
              <option value="mi">{formattedUnitMi}</option>
              <option value="ft">{formattedUnitFt}</option>
            </Select>
          </div>
          <Button disabled={submitDisabled} type="submit" onClick={e => {
            const q = {
              type: 'geoDistance',
              distance: `${dist}${unit}`,
              latitude: lat,
              longitude: lon
            }
            setDist('');
            setLat('');
            setLon('');
            const allOptions = unionBy([q], options, hash);
            setOptions(allOptions);
            if (singleSelect) {
              setOptions([q]);
              setFullField(filterHandle, [q], [])
                .then(responseFilter => onApply({ filter: responseFilter, hide }))
                .catch(err => console.log(err));
            } else {
              toggle(filterHandle, q);
            }
          }}>Add</Button>
        </div>

        {options.length > 0 && <>
          <SummaryBar {...summaryProps} style={{ marginTop: 0 }} />
          <FilterBody>
            <form id={formId} onSubmit={e => e.preventDefault()} >
              {options.map((option) => {
                return <Option
                  key={hash(option)}
                  helpVisible={true}
                  label={<LabelFromID id={option} />}
                  helpText={<FormattedMessage
                    id={`intervals.geoDistance.description`}
                    defaultMessage={'Filter name'}
                    values={{ ...option }}
                  />
                  }
                  checked={checkedMap.has(hash(option))}
                  onChange={() => toggle(filterHandle, option)}
                />
              })}
            </form>
          </FilterBody>
          <Footer {...footerProps}
            onApply={() => onApply({ filter, hide })}
            onCancel={() => onCancel({ filter, hide })}
          />
        </>}
      </>
    }
    }
  </Filter>
};

FilterContent.propTypes = {
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  onFilterChange: PropTypes.func,
  hide: PropTypes.func,
  focusRef: PropTypes.any,
  vocabulary: PropTypes.object,
  initFilter: PropTypes.object,
  filterHandle: PropTypes.string
};

export function Popover({ filterHandle, LabelFromID, translations = {}, config, ...props }) {
  return (
    <PopoverFilter
      {...props}
      content={<FilterContent
        filterHandle={filterHandle}
        LabelFromID={LabelFromID}
        translations={translations}
        config={config} />}
    />
  );
}