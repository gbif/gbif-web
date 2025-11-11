import React, { useContext } from 'react';
import { TriggerButton } from '../../../widgets/Filter/utils/TriggerButton';
import { ApiContext } from '../../../dataManagement/api';
import { useIntl, FormattedMessage } from 'react-intl';
import PopoverFilter from '../../../widgets/Filter/types/PopoverFilter';
import { FilterContext } from '../../../widgets/Filter/state';
import get from 'lodash/get';

function Popover(props) {
  return <PopoverFilter {...props} content={<PublisherContent />} />;
}

function PublisherContent(props) {
  const currentFilterContext = useContext(FilterContext);
  const api = useContext(ApiContext);
  const { promise, cancel } = api.v1Get(`/occurrence/search/institutionCode?limit=8&q=test`);
  console.log(api);
  return <div>
    <FormattedMessage id="filterSupport.nullOrNot.isNotNull" />
    <button onClick={e => {
      currentFilterContext.add('publisherKey', 'c8d737e0-2ff8-42e8-b8fc-6b805d26fc5f'); props.hide();
    }}>Add</button>
  </div>
}

export const datasetFilters = {
  publisherKey: {
    Content: PublisherContent,
    Popover: Popover,
    Button: props => {
      const currentFilterContext = useContext(FilterContext);
      return <Popover modal>
        <TriggerButton {...props}
          translations={{
            count: 'filter.publisherKey.count',
            name: 'filter.publisherKey.name'
          }}
          filterHandle='publisherKey'
          DisplayName={props => <span>{props.id}</span>}
          mustOptions={get(currentFilterContext.filter, `must.publisherKey`, [])}
          mustNotOptions={get(currentFilterContext.filter, `must_not.publisherKey`, [])}
        />
      </Popover>
    },
    displayName: 'test'
  }
};