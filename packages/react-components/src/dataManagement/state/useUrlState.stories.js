import React, { useState, useEffect } from 'react';
import { useUrlState, stringParam } from './useUrlState';

export default {
  title: 'State management/useUrlState'
};

export const saveStateToUrl = () => {
  const [value, setValue] = useUrlState({param: 'filter'});
  console.log(value);
  return <div>
    <h1>Use query params</h1>
    <p>Location: <br />{window.location.search}</p>
    <pre>Value for param "filter": {value ? value.toString() : 'empty'}</pre>
    <button onClick={() => setValue({test: Math.random()})}>update randomly</button>
    <button onClick={() => setValue(Math.random())}>update randomly</button>
    <button onClick={() => setValue('test ' + Math.random())}>update randomly</button>
    <button onClick={() => setValue([1,2,'3h'])}>update randomly</button>
  </div>
}

export const DefaultQueryParam = () => {
  const [value, setValue] = useUrlState({param: 'paramWithDefault', defaultValue: 'This is the default'});
  console.log(value);
  return <div>
    <h1>Use query params, but hide the default value</h1>
    <p>Location: <br />{window.location.search}</p>
    <pre>Value for param "paramWithDefault": {value ? value.toString() : 'empty'}</pre>
    <button onClick={() => setValue('not default')}>update randomly</button>
    <button onClick={() => setValue('This is the default')}>update randomly</button>
    <button onClick={() => setValue('test ' + Math.random())}>update randomly</button>
  </div>
}

