import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { addDecorator } from '@storybook/react';

import OccurrenceSearch from './OccurrenceSearch';
import Standalone from './Standalone';

export default {
  title: 'Search/OccurrenceSearch',
  component: OccurrenceSearch
};


const labels = {
  elevation: {
    type: 'NUMBER_RANGE',
    path: 'interval.elevation'
  },
}

function getSuggests({client}) {
  return {};
}

const filters = {
  elevation: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'elevation',
        id2labelHandle: 'elevation',
        translations: {
          count: 'filter.elevation.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.elevation.name',// translation path to a title for the popover and the button
          description: 'filter.elevation.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Elevation range or single value'
      }
    }
  }
}

const adapter = {

}

const config = { labels, getSuggests, filters, adapter };

export const Example = () => <OccurrenceSearch config={config} style={{height: 'calc(100vh - 20px)'}}></OccurrenceSearch>;

Example.story = {
  name: 'OccurrenceSearch',
};


// export const StandaloneExample = () => <Standalone style={{height: 'calc(100vh - 20px)'}}></Standalone>;