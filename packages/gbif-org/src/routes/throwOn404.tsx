import React from 'react';

export function ThrowOn404(): React.ReactElement {
  throw new Error('404');
}
