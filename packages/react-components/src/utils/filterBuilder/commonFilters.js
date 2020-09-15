import React from 'react';
import { Input } from '../../components';
import basisofRecord from '../../locales/enums/basisOfRecord.json';
import mediaTypes from '../../locales/enums/mediaTypes.json';
import occurrenceIssue from '../../locales/enums/occurrenceIssue.json';
import typeStatus from '../../locales/enums/typeStatus.json';
import license from '../../locales/enums/license.json';
import month from '../../locales/enums/month.json';
import continent from '../../locales/enums/continent.json';
import protocol from '../../locales/enums/protocol.json';
import establishmentMeans from '../../locales/enums/establishmentMeans.json';
import occurrenceStatus from '../../locales/enums/occurrenceStatus.json';
// -- Add imports above this line (required by plopfile.js) --

export const commonFilters = {
  taxonKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'taxonKey',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'canonicalName',
        translations: {
          count: 'filter.taxonKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.taxonKey.name',// translation path to a title for the popover and the button
          description: 'filter.taxonKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'taxonKey',
        id2labelHandle: 'taxonKey',
      }
    }
  },
  countryCode: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filter.countryCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.countryCode.name',// translation path to a title for the popover and the button
          description: 'filter.countryCode.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
      }
    }
  },
  publishingCountryCode: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filter.publishingCountryCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.publishingCountryCode.name',// translation path to a title for the popover and the button
          description: 'filter.publishingCountryCode.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
        id2labelHandle: 'countryCode',
      }
    }
  },
  datasetKey: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filter.datasetKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.datasetKey.name',// translation path to a title for the popover and the button
          description: 'filter.datasetKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'datasetKey',
      }
    }
  },
  publisherKey: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filter.publisherKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.publisherKey.name',// translation path to a title for the popover and the button
          description: 'filter.publisherKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'publisherKey',
      }
    }
  },
  institutionCode: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filter.institutionCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.institutionCode.name',// translation path to a title for the popover and the button
          description: 'filter.institutionCode.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'institutionCode',
      }
    }
  },
  catalogNumber: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filter.catalogNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.catalogNumber.name',// translation path to a title for the popover and the button
          description: 'filter.catalogNumber.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'catalogNumber'
      }
    }
  },
  hostKey: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'publisherKey',
        translations: {
          count: 'filter.hostKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.hostKey.name',// translation path to a title for the popover and the button
          description: 'filter.hostKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'publisherKey',
        id2labelHandle: 'publisherKey',
      }
    }
  },
  year: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'year',
        id2labelHandle: 'year',
        translations: {
          count: 'filter.year.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.year.name',// translation path to a title for the popover and the button
          description: 'filter.year.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
        supportsExist: true,
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/
      }
    }
  },
  basisOfRecord: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'basisOfRecord',
        id2labelHandle: 'basisOfRecord',
        translations: {
          count: 'filter.basisOfRecord.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.basisOfRecord.name',// translation path to a title for the popover and the button
          description: 'filter.basisOfRecord.description', // translation path for the filter description
        }
      },
      specific: {
        options: Object.keys(basisofRecord),
      }
    }
  },
  typeStatus: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'typeStatus',
        id2labelHandle: 'typeStatus',
        translations: {
          count: 'filter.typeStatus.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.typeStatus.name',// translation path to a title for the popover and the button
          description: 'filter.typeStatus.description', // translation path for the filter description
        }
      },
      specific: {
        options: Object.keys(typeStatus),
      }
    }
  },
  occurrenceIssue: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'occurrenceIssue',
        id2labelHandle: 'occurrenceIssue',
        translations: {
          count: 'filter.occurrenceIssue.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.occurrenceIssue.name',// translation path to a title for the popover and the button
          description: 'filter.occurrenceIssue.description', // translation path for the filter description
        }
      },
      specific: {
        options: Object.keys(occurrenceIssue),
        supportsNegation: true,
        supportsExist: true
      }
    }
  },
  mediaTypes: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'mediaTypes',
        id2labelHandle: 'mediaTypes',
        translations: {
          count: 'filter.mediaTypes.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.mediaTypes.name',// translation path to a title for the popover and the button
          description: 'filter.mediaTypes.description', // translation path for the filter description
        }
      },
      specific: {
        options: Object.keys(mediaTypes),
      }
    }
  },
  sampleSizeUnit: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'sampleSizeUnit',
        translations: {
          count: 'filter.sampleSizeUnit.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.sampleSizeUnit.name',// translation path to a title for the popover and the button
          description: 'filter.sampleSizeUnit.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'E.g. DNA sequence reads'
      }
    }
  },
  license: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'license',
        id2labelHandle: 'license',
        translations: {
          count: 'filter.license.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.license.name',// translation path to a title for the popover and the button
          description: 'filter.license.description', // translation path for the filter description
        }
      },
      specific: {
        options: Object.keys(license),
      }
    }
  },
  coordinateUncertainty: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'coordinateUncertainty',
        id2labelHandle: 'coordinateUncertainty',
        translations: {
          count: 'filter.coordinateUncertainty.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.coordinateUncertainty.name',// translation path to a title for the popover and the button
          description: 'filter.coordinateUncertainty.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/
      }
    }
  },
  depth: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'depth',
        id2labelHandle: 'depth',
        translations: {
          count: 'filter.depth.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.depth.name',// translation path to a title for the popover and the button
          description: 'filter.depth.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/
      }
    }
  },
  organismQuantity: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'organismQuantity',
        id2labelHandle: 'organismQuantity',
        translations: {
          count: 'filter.organismQuantity.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.organismQuantity.name',// translation path to a title for the popover and the button
          description: 'filter.organismQuantity.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
      }
    }
  },
  sampleSizeValue: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'sampleSizeValue',
        id2labelHandle: 'sampleSizeValue',
        translations: {
          count: 'filter.sampleSizeValue.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.sampleSizeValue.name',// translation path to a title for the popover and the button
          description: 'filter.sampleSizeValue.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
      }
    }
  },
  relativeOrganismQuantity: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'relativeOrganismQuantity',
        id2labelHandle: 'relativeOrganismQuantity',
        translations: {
          count: 'filter.relativeOrganismQuantity.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.relativeOrganismQuantity.name',// translation path to a title for the popover and the button
          description: 'filter.relativeOrganismQuantity.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
        regex: /^[0-9,\.]{0,10}$/
      }
    }
  },
  month: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'month',
        id2labelHandle: 'month',
        translations: {
          count: 'filter.month.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.month.name',// translation path to a title for the popover and the button
          description: 'filter.month.description', // translation path for the filter description
        }
      },
      specific: {
        options: Object.keys(month),
        supportsExist: true,
      }
    }
  },
  continent: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'continent',
        id2labelHandle: 'continent',
        translations: {
          count: 'filter.continent.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.continent.name',// translation path to a title for the popover and the button
          description: 'filter.continent.description', // translation path for the filter description
        }
      },
      specific: {
        options: Object.keys(continent),
      }
    }
  },
  protocol: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'protocol',
        id2labelHandle: 'protocol',
        translations: {
          count: 'filter.protocol.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.protocol.name',// translation path to a title for the popover and the button
          description: 'filter.protocol.description', // translation path for the filter description
        }
      },
      specific: {
        options: Object.keys(protocol),
      }
    }
  },
  establishmentMeans: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'establishmentMeans',
        id2labelHandle: 'establishmentMeans',
        translations: {
          count: 'filter.establishmentMeans.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.establishmentMeans.name',// translation path to a title for the popover and the button
          description: 'filter.establishmentMeans.description', // translation path for the filter description
        }
      },
      specific: {
        options: Object.keys(establishmentMeans),
      }
    }
  },
  catalogNumber: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'catalogNumber',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'catalogNumber',
        translations: {
          count: 'filter.catalogNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.catalogNumber.name',// translation path to a title for the popover and the button
          description: 'filter.catalogNumber.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'catalogNumber',
        id2labelHandle: 'catalogNumber',
      }
    }
  },
  recordedBy: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'recordedBy',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'recordedBy',
        translations: {
          count: 'filter.recordedBy.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.recordedBy.name',// translation path to a title for the popover and the button
          description: 'filter.recordedBy.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'recordedBy',
        id2labelHandle: 'recordedBy',
      }
    }
  },
  recordNumber: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'recordNumber',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'recordNumber',
        translations: {
          count: 'filter.recordNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.recordNumber.name',// translation path to a title for the popover and the button
          description: 'filter.recordNumber.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'recordNumber',
        id2labelHandle: 'recordNumber',
      }
    }
  },
  collectionCode: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'collectionCode',
        id2labelHandle: 'collectionCode',
        translations: {
          count: 'filter.collectionCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.collectionCode.name',// translation path to a title for the popover and the button
          description: 'filter.collectionCode.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'E.g. DNA sequence reads'
      }
    }
  },
  recordedById: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'recordedById',
        id2labelHandle: 'recordedById',
        translations: {
          count: 'filter.recordedById.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.recordedById.name',// translation path to a title for the popover and the button
          description: 'filter.recordedById.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'E.g. https://orcid.org/0000-1111-2222-3333'
      }
    }
  },
  identifiedById: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'identifiedById',
        id2labelHandle: 'identifiedById',
        translations: {
          count: 'filter.identifiedById.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.identifiedById.name',// translation path to a title for the popover and the button
          description: 'filter.identifiedById.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'E.g. https://orcid.org/0000-1111-2222-3333'
      }
    }
  },
  occurrenceId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'occurrenceId',
        id2labelHandle: 'occurrenceId',
        translations: {
          count: 'filter.occurrenceId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.occurrenceId.name',// translation path to a title for the popover and the button
          description: 'filter.occurrenceId.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'ID of the original record'
      }
    }
  },
  organismId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'organismId',
        id2labelHandle: 'organismId',
        translations: {
          count: 'filter.organismId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.organismId.name',// translation path to a title for the popover and the button
          description: 'filter.organismId.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'E.g. DNA sequence reads'
      }
    }
  },
  locality: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'locality',
        id2labelHandle: 'locality',
        translations: {
          count: 'filter.locality.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.locality.name',// translation path to a title for the popover and the button
          description: 'filter.locality.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'E.g. DNA sequence reads'
      }
    }
  },
  waterBody: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'waterBody',
        id2labelHandle: 'waterBody',
        translations: {
          count: 'filter.waterBody.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.waterBody.name',// translation path to a title for the popover and the button
          description: 'filter.waterBody.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'E.g. DNA sequence reads'
      }
    }
  },
  stateProvince: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'stateProvince',
        id2labelHandle: 'stateProvince',
        translations: {
          count: 'filter.stateProvince.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.stateProvince.name',// translation path to a title for the popover and the button
          description: 'filter.stateProvince.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'E.g. DNA sequence reads'
      }
    }
  },
  eventId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'eventId',
        id2labelHandle: 'eventId',
        translations: {
          count: 'filter.eventId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.eventId.name',// translation path to a title for the popover and the button
          description: 'filter.eventId.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Enter the ID',
        supportsExist: true
      }
    }
  },
  samplingProtocol: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'samplingProtocol',
        id2labelHandle: 'samplingProtocol',
        translations: {
          count: 'filter.samplingProtocol.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.samplingProtocol.name',// translation path to a title for the popover and the button
          description: 'filter.samplingProtocol.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'E.g. DNA sequence reads'
      }
    }
  },
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
        placeholder: 'Range or single value',
      }
    }
  },
  occurrenceStatus: {
      type: 'ENUM',
      config: {
        std: {
          filterHandle: 'occurrenceStatus',
          id2labelHandle: 'occurrenceStatus',
          translations: {
            count: 'filter.occurrenceStatus.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'filter.occurrenceStatus.name',// translation path to a title for the popover and the button
            description: 'filter.occurrenceStatus.description', // translation path for the filter description
          }
        },
        specific: {
          options: Object.keys(occurrenceStatus),
        }
      }
    },
  // -- Add filters above this line (required by plopfile.js) --
  q: {
    type: 'CUSTOM_STANDARD',
    config: {
      std: {
        filterHandle: 'q',// if nothing else provided, then this is the filterName used
        translations: {
          count: 'filter.q.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.q.name',// translation path to a title for the popover and the button
          description: 'filter.q.description', // translation path for the filter description
        },
      },
      specific: {
        description: 'filter.q.description',
        component: ({ standardComponents, summaryProps, filterHandle, setFullField, toggle, focusRef, footerProps, onApply, filter, onCancel, hide, ...props }) => {
          const { Footer, SummaryBar, FilterBody } = standardComponents;
          return <>
            <div style={{ margin: '10px' }} >
              <Input
                ref={focusRef}
                value={filter?.must?.q?.length ? filter.must.q[0] : ''}
                onChange={e => {
                  setFullField('q', [e.target.value])
                }}
                onKeyPress={e => e.which === 13 ? onApply({ filter, hide }) : null}
              />
            </div>
            <Footer {...footerProps}
              onApply={() => onApply({ filter, hide })}
              onCancel={() => onCancel({ filter, hide })}
            />
          </>
        },
      }
    }
  },
  // sampleSize: {
  //   type: 'CUSTOM_STANDARD',
  //   config: {
  //     std: {
  //       filterHandle: 'sampleSize',// if nothing else provided, then this is the filterName used
  //       translations: {
  //         count: 'filter.sampleSize.count', // translation path to display names with counts. e.g. "3 scientific names"
  //         name: 'filter.sampleSize.name',// translation path to a title for the popover and the button
  //         description: 'filter.sampleSize.description', // translation path for the filter description
  //       },
  //     },
  //     specific: {
  //       component: ({ standardComponents, summaryProps, filterHandle, setFullField, toggle, focusRef, footerProps, onApply, filter, onCancel, hide, ...props }) => {
  //         const { Footer, SummaryBar, FilterBody } = standardComponents;
  //         return <>
  //           <div style={{ margin: '10px' }} >
  //             <Input
  //               placeholder=""
  //               ref={focusRef}
  //               value={filter?.must?.q?.length ? filter.must.q[0] : ''}
  //               onChange={e => {
  //                 setFullField('q', [e.target.value])
  //               }}
  //               onKeyPress={e => e.which === 13 ? onApply({ filter, hide }) : null}
  //             />
  //           </div>
  //           <Footer {...footerProps}
  //             onApply={() => onApply({ filter, hide })}
  //             onCancel={() => onCancel({ filter, hide })}
  //           />
  //         </>
  //       },
  //     }
  //   }
  // },
  // evenMoreFreedom: {
  //   type: 'CUSTOM_STANDARD',
  //   config: {
  //     std: {
  //       filterHandle: 'taxonKey',// if nothing else provided, then this is the filterName used
  //       // id2labelHandle: 'canonicalName',
  //       id2label: ({ id }) => `taxonKey: ${id}`, // just define the label here. With no chance to reuse it elsewhere
  //       translations: {
  //         count: '{num, plural, one {random taxon} other {# random taxa}}', // Should really point to the translation file, but as it falls back to the string it can be used as the main entry
  //         name: 'Randomizer',// translation path to a title for the popover and the button - in this case the path does not exist and so it falls back to the string provided
  //         description: 'filter.random.description', // translation path for the filter description
  //       },
  //     },
  //     specific: {
  //       dontWrapInStdFilter: true,
  //       component: ({ FilterContext, filter, ...props }) => {
  //         return <FilterContext.Consumer>
  //           {({ setFullField, filter }) => {
  //             return <div style={{ padding: 20, background: 'pink', maxHeight: '100%', overflow: 'auto' }}>
  //               <button style={{ background: 'yellow', display: 'block', width: '100%' }}
  //                 onClick={() => setFullField('taxonKey', [Math.floor(Math.random() * 100)])}>I feel lucky - choose random taxonKey between 0 and 100</button>
  //               <pre>{JSON.stringify(filter, null, 2)}</pre>
  //             </div>
  //           }}
  //         </FilterContext.Consumer>
  //       },
  //     }
  //   }
  // },
}