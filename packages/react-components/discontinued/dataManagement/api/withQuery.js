import React from 'react';
import useQuery from './useQuery';

const OCCURRENCES = `
query table($predicate: Predicate, $size: Int = 20){
  occurrenceSearch(predicate: $predicate, size: $size) {
    documents(size: $size) {
      total
      results {
        gbifId
        gbifClassification{
          acceptedUsage {
            rank
            formattedName
          }
        }
      }
    }
  }
}
`;

export function hocify(useHook) {
  function hoc(InputComponent, options) {
    function WrapperComponent(props) {
      const result = useHook(OCCURRENCES, { lazyLoad: true });
      
      return <InputComponent {...result} {...props} />
    }
      
    return WrapperComponent;
  }
    
  return hoc;
}

// export const withQuery = hocify(useQuery);
