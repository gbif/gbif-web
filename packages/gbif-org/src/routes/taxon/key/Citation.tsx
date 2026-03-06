import { HyperText } from '@/components/hyperText';

const Citation = ({ taxon }) => {
  return (
    <HyperText
      className="prose-links"
      text={`${taxon.formattedName || taxon.scientificName} in ${taxon.dataset.citation.text}`}
    />
  );
};

export default Citation;
