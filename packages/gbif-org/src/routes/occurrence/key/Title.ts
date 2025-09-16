const getTitle = ({ occurrence, termMap }) => {
  return (
    occurrence.verbatimScientificName ||
    termMap?.genus?.verbatim ||
    termMap?.family?.verbatim ||
    termMap?.order?.verbatim ||
    termMap?.class?.verbatim ||
    termMap?.phylum?.verbatim ||
    termMap?.kingdom?.verbatim ||
    'No title provided'
  );
};

export default getTitle;
