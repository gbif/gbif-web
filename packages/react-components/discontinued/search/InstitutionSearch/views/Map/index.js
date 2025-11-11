import React, { useContext } from "react";

function MapWrapper() {
  const theme = useContext(ThemeContext);
  const currentFilterContext = useContext(FilterContext);

  return <div style={{
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "row",
  }}>
    <Map popUpRef={popUpRef} filterHash={currentFilterContext.filterHash} {...props} theme={theme} style={{ width: '100%', height: '100%' }} />
  </div>
}

export default MapWrapper;