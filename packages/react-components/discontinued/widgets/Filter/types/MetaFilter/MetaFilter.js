// TODO: grouping options would be useful 
// See https://codesandbox.io/s/zx1kj58npl for how to do so in Downshift
import React, { useState, useContext } from "react";
import { useIntl, FormattedMessage } from 'react-intl';
import ThemeContext from '../../../../style/themes/ThemeContext';
import get from 'lodash/get';
import PopoverFilter from '../PopoverFilter';
import OccurrenceContext from '../../../../search/SearchContext';
import { Button } from '../../../../components';
import { FilterBox } from '../../utils';
import Suggest from './Suggest';

function getSuggestConfig({ options }) {
  return {
    //What placeholder to show
    placeholder: 'Search for filters',
    // how to get the list of suggestion data
    getSuggestions: ({ q }) => options.filter(x => x.displayName.toLowerCase().indexOf(q.toLowerCase()) === 0 || (x.displayName.toLowerCase().indexOf(q.toLowerCase()) >= 0 && q.length > 1)).map(x => ({ ...x, key: x.filterHandle })),
    // how to map the results to a single string value
    getValue: suggestion => suggestion.displayName,
    // how to display the individual suggestions in the list
    render: function DatasetSuggestItem(suggestion) {
      return <div>{suggestion.displayName}</div>
    },
    delay: 10
  }
};

export const FilterContent = ({ focusRef, ...props }) => {
  const ref = React.useRef();
  const theme = useContext(ThemeContext);
  const { formatMessage } = useIntl();
  const { filters } = useContext(OccurrenceContext);
  const [CurrentFilter, selectedFilter] = useState();
  const [options] = useState(() => Object.keys(filters).map(filterHandle => ({ filterHandle, displayName: filters[filterHandle].displayName })));
  const [suggestConfig] = useState(() => getSuggestConfig({ options })); get
  const [value, setValue] = useState('');

  React.useEffect(() => {
    if (CurrentFilter) {
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  }, [CurrentFilter]);

  return <>
    {!CurrentFilter && <FilterBox>
      {/* <Header>
        Search filters
      </Header> */}
      <>
        <Suggest
          defaultIsOpen={true}
          value={value}
          // placeholder={formatMessage({id: 'search.table.lockColumn'})}
          initSuggestions={options}
          getSuggestions={suggestConfig.getSuggestions}
          onChange={(event, { newValue }) => setValue(newValue)}
          focusRef={focusRef}
          render={suggestConfig.render}
          getValue={suggestConfig.getValue}
          onSuggestionSelected={({ item, value }) => {
            setValue('');
            selectedFilter(() => filters[item.filterHandle].Content);
          }}
          delay={10}
        />
      </>
    </FilterBox>}
    {CurrentFilter && <CurrentFilter {...props} focusRef={ref} />}
  </>
};

FilterContent.propTypes = {
  // onApply: PropTypes.func,
  // onCancel: PropTypes.func,
  // onFilterChange: PropTypes.func,
  // hide: PropTypes.func,
  // focusRef: PropTypes.any,
  // vocabulary: PropTypes.object,
  // initFilter: PropTypes.object,
  // filterHandle: PropTypes.string
};

export function Popover({ config, ...props }) {
  return (
    <PopoverFilter
      {...props}
      content={<FilterContent />}
    />
  );
}

export function Trigger(props) {
  return <Popover modal>
    <Button appearance="primaryOutline">
      <FormattedMessage id="pagination.moreFilters" />
    </Button>
  </Popover>
}