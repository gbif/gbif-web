import React from 'react';
import { useLocation } from "react-router-dom";

export default function AddressBar({style}) {
  const location = useLocation();
  return <div style={{whiteSpace: 'nowrap', overflow: 'auto', padding: 12, background: '#555', color: 'white', fontSize: 12, ...style}}>
    {location.pathname}{location.search}{location.hash}
  </div>
}