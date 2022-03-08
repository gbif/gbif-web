import React, { useContext } from 'react';
import get from 'lodash/get';
import { Popover as SuggestPopover, FilterContent as SuggestContent } from '../../widgets/Filter/types/SuggestFilter';
import { Popover as RangePopover, FilterContent as RangeContent } from '../../widgets/Filter/types/RangeFilter';
import { Popover as EnumPopover, FilterContent as EnumContent } from '../../widgets/Filter/types/EnumFilter';
import { Popover as SimpleTextPopover, FilterContent as SimpleTextContent } from '../../widgets/Filter/types/SimpleTextFilter';
import { Popover as CustomStandardPopover, FilterContent as CustomStandardContent } from '../../widgets/Filter/types/CustomStandardFilter';
import { Popover as VocabPopover, FilterContent as VocabContent } from '../../widgets/Filter/types/VocabularyFilter';
import { Popover as SearchKeywordPopover, FilterContent as SearchKeywordContent } from '../../widgets/Filter/types/SearchKeywordsFilter';
import { FilterContext } from '../../widgets/Filter/state';
import { TriggerButton } from '../../widgets/Filter/utils/TriggerButton';
import { FormattedMessage } from 'react-intl';
import { prettifyEnum } from '../labelMaker/config2labels';

export function getButton(Popover, { translations, filterHandle, LabelFromID }) {
  return function Trigger(props) {
    const currentFilterContext = useContext(FilterContext);
    return <Popover modal >
      <TriggerButton {...props}
        translations={translations}
        filterHandle={filterHandle}
        DisplayName={LabelFromID}
        mustOptions={get(currentFilterContext.filter, `must.${filterHandle}`, [])}
        mustNotOptions={get(currentFilterContext.filter, `must_not.${filterHandle}`, [])}
      />
    </Popover>
  }
}

function buildSimpleText({ widgetHandle, config }) {
  const conf = {
    filterHandle: config.std.filterHandle || widgetHandle,
    translations: config.std.translations,
    config: config.specific,
    LabelFromID: ({ id }) => id
  }
  const Popover = props => <SimpleTextPopover {...conf} {...props} />;
  return {
    Button: getButton(Popover, conf),
    Popover,
    Content: props => <SimpleTextContent {...conf} {...props} />,
    LabelFromID: config.LabelFromID,
  };
}

function buildKeywordSearch({ labelMap, suggestConfigMap, widgetHandle, config }) {
  const LabelFromID = labelMap[config.std.id2labelHandle || widgetHandle] || (({id}) => typeof id === 'object' ? id.value : id);

  const conf = {
    filterHandle: config.std.filterHandle || widgetHandle,
    translations: config.std.translations,
    // config: config.specific,
    config: {
      suggestConfig: suggestConfigMap[config.specific.suggestHandle || widgetHandle],
      ...config.specific
    },
    LabelFromID
  }
  const Popover = props => <SearchKeywordPopover {...conf} {...props} />;
  return {
    Button: getButton(Popover, conf),
    Popover,
    Content: props => <SearchKeywordContent {...conf} {...props} />,
    LabelFromID
  };
}

export function filterBuilder({ labelMap, suggestConfigMap, filterWidgetConfig, context }) {
  const filters = Object.entries(filterWidgetConfig).reduce((acc, [widgetHandle, { type, config }]) => {
    const builderConfig = { widgetHandle, config, labelMap, suggestConfigMap, context };
    let filter;
    if (type === 'SUGGEST') {
      filter = buildSuggest(builderConfig);
    } else if (type === 'NUMBER_RANGE') {
      filter = buildNumberRange(builderConfig);
    } else if (type === 'ENUM') {
      filter = buildEnum(builderConfig);
    } else if (type === 'SIMPLE_TEXT') {
      filter = buildSimpleText(builderConfig);
    } else if (type === 'CUSTOM_STANDARD') {
      filter = buildCustomStandard(builderConfig);
    } else if (type === 'VOCAB') {
      filter = buildVocab(builderConfig);
    } else if (type === 'KEYWORD_SEARCH') {
      filter = buildKeywordSearch(builderConfig);
    }
    const trNameId = config.std?.translations?.name || `filters.${config?.std?.filterHandle || widgetHandle}.name`;
    acc[widgetHandle] = {
      ...filter,
      displayName: context.formatMessage({ id: trNameId })
    };
    return acc;
  }, {});
  return filters;
}

function buildSuggest({ widgetHandle, config, labelMap, suggestConfigMap, context }) {
  const LabelFromID = labelMap[config.std.id2labelHandle || widgetHandle] || (({id}) => typeof id === 'object' ? id.value : id);
  const conf = {
    filterHandle: config.std.filterHandle || widgetHandle,
    translations: config.std.translations,
    config: {
      suggestConfig: suggestConfigMap[config.specific.suggestHandle || widgetHandle],
      LabelFromID,
      ...config.specific,
      ...config
    },
    LabelFromID
  }

  const Popover = props => <SuggestPopover {...conf} {...props} />;
  return {
    Button: getButton(Popover, conf),
    Popover,
    Content: props => <SuggestContent {...conf} {...props} />,
    LabelFromID: config.LabelFromID
  };
}


function buildNumberRange({ widgetHandle, config, labelMap, context }) {
  const LabelFromID = labelMap[config.std.id2labelHandle || widgetHandle];
  const conf = {
    filterHandle: config.std.filterHandle || widgetHandle,
    translations: config.std.translations,
    config: config.specific,
    LabelFromID
  }
  const Popover = props => <RangePopover {...conf} {...props} />;
  return {
    Button: getButton(Popover, conf),
    Popover,
    Content: props => <RangeContent {...conf} {...props} />,
    LabelFromID
  };
}

function buildEnum({ widgetHandle, config, labelMap }) {
  const fallbackLabel = ({ id }) => <FormattedMessage
    id={`enums.${config.std.filterHandle || widgetHandle}.${id}`}
    defaultMessage={prettifyEnum(id)}
  />;

  const conf = {
    filterHandle: config.std.filterHandle || widgetHandle,
    translations: config.std.translations,
    config: {
      ...config.specific,
      options: config.specific.hasOptionDescriptions
        ? config.specific.options
        : config.specific.options.map(x => ({ key: x }))
    },
    LabelFromID: labelMap[config.std.id2labelHandle || widgetHandle] || fallbackLabel,
  }
  // if (!labelMap[config.std.id2labelHandle || widgetHandle]) console.warn(`No label handler defined for ${widgetHandle} - using fallback`)
  const Popover = props => <EnumPopover {...conf} {...props} />;
  return {
    Button: getButton(Popover, conf),
    Popover,
    Content: props => <EnumContent {...conf} {...props} />,
    LabelFromID: config.LabelFromID,
  };
}

function buildCustomStandard({ widgetHandle, config, labelMap }) {
  const conf = {
    filterHandle: config.std.filterHandle || widgetHandle,
    translations: config.std.translations,
    config: {
      component: config.specific.component,
      dontWrapInStdFilter: config.specific.dontWrapInStdFilter,
      hasOptionDescriptions: config.specific.hasOptionDescriptions,
      supportsExist: config.specific.supportsExist
    },
    LabelFromID: labelMap[config.std.id2labelHandle || widgetHandle] || config.std.id2label,
  }
  const Popover = props => <CustomStandardPopover {...conf} {...props} />;
  return {
    Button: getButton(Popover, conf),
    Popover,
    Content: props => <CustomStandardContent {...conf} {...props} />,
    LabelFromID: config.LabelFromID,
  };
}

function buildVocab({ widgetHandle, config, labelMap, suggestConfigMap, context }) {
  const conf = {
    filterHandle: config.std.filterHandle || widgetHandle,
    translations: config.std.translations,
    config: {
      suggestConfig: suggestConfigMap[config.specific.suggestHandle || widgetHandle],
      LabelFromID: labelMap[config.specific.id2labelHandle],
      ...config.specific,
      ...config
    },
    LabelFromID: labelMap[config.std.id2labelHandle || widgetHandle] || (({id}) => id),
  }

  const Popover = props => <VocabPopover {...conf} {...props} />;
  return {
    Button: getButton(Popover, conf),
    Popover,
    Content: props => <VocabContent {...conf} {...props} />,
    LabelFromID: config.LabelFromID
  };
}