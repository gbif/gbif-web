
import React from 'react';

export default function DocsWrapper(props){ 
  return <div style={{
    padding: '20px',
    background: 'linear-gradient(45deg, #eff2f6 25%, transparent 25%, transparent 75%, #eff2f6 75%, #eff2f6 0),linear-gradient(45deg, #eff2f6 25%, transparent 5%, transparent 75%, #eff2f6 75%, #eff2f6 0), #fff',
    backgroundPosition: '0 0, 10px 10px',
    backgroundSize: '20px 20px',
    backgroundClip: 'border-box',
    backgroundOrigin: 'padding-box'
  }} {...props}/>
}
