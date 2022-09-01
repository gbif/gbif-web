// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// const useState = () => [1,2];
// const state = 3;
// export const Button = ({ color, ...props }) => {
//   const [state, setState] = useState(10);
//   return <button style={{ background: color || 'yellow', fontSize: 30 }}>{props.children}: {state}</button>
// }
// Button2.displayName = 'Button2';
// Button2.propTypes = {
//   color: PropTypes.string
// };
// export { Example } from './components/Autocomplete/Example';

// export { Autocomplete } from './components/Autocomplete/Autocomplete';


// export { Button } from './components';
export * from './components';
// export { default as OccurrenceSearch } from './search/OccurrenceSearch/Standalone';
// export { default as OccurrenceSearch } from './search/OccurrenceSearch/SSR';
// export { default as CollectionSearch } from './search/CollectionSearch/Standalone';
// export { default as InstitutionSearch } from './search/InstitutionSearch/Standalone';
// export { default as LiteratureSearch } from './search/LiteratureSearch/Standalone';
// export { default as DatasetSearch } from './search/DatasetSearch/Standalone';
// export { default as PublisherSearch } from './search/PublisherSearch/Standalone';
export { default as Collection } from './entities/Collection/Standalone';
export { default as Institution } from './entities/Institution/Standalone';
export { default as Dataset } from './entities/Dataset/Standalone';
// export { default as themeBuilder } from './style/themeBuilder';
export * from './dataContext';

// export  { Example as Filter } from './widgets/Filter/Filter.stories';
// export  { GlobalNav, Example } from './components/Navigation/GlobalNav/GlobalNav';

// export const Button = props => <h1 style={{background: 'pink', color: 'white'}}>test</h1>