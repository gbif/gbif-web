import { jsx } from '@emotion/react';
import React, {useState} from "react";

export function Logo({
  url,
  style = { maxHeight: "64px", maxWidth: "100px"},
  ...props
}) {
    const [error, setError] = useState(true)
    const [loading, setLoading] = useState(true)

    return (loading || !error) ?  
    <img
      style={style}
      src={url}
      onLoad={() => {
        setError(false)
        setLoading(false)
      }}
      onError={() => {
        setError(true)
        setLoading(false)
      }}
    /> : null
}

