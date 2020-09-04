import React, { useState, useEffect } from 'react';
import { useQueryParam, stringParam } from './useQueryParam';

export default {
  title: 'State management/useQueryParam'
};

export const UseQueryParamExample = () => {
  const [value, setValue] = useQueryParam('filter');
  console.log(value);
  return <div>
    <h1>Use query params</h1>
    <pre>{value ? value.toString() : 'empty'}</pre>
    <button onClick={() => setValue({test: Math.random()})}>update randomly</button>
    <button onClick={() => setValue(Math.random())}>update randomly</button>
    <button onClick={() => setValue('test ' + Math.random())}>update randomly</button>
    <button onClick={() => setValue([1,2,'3h'])}>update randomly</button>
  </div>
}

export const DefaultQueryParam = () => {
  const [value, setValue] = useQueryParam('paramWithDefault', {defaultValue: 'This is the default'});
  console.log(value);
  return <div>
    <p>Location: {window.location.search}</p>
    <h1>Use query params, but hide the default value</h1>
    <pre>{value ? value.toString() : 'empty'}</pre>
    <button onClick={() => setValue('not default')}>update randomly</button>
    <button onClick={() => setValue('This is the default')}>update randomly</button>
    <button onClick={() => setValue('test ' + Math.random())}>update randomly</button>
  </div>
}

