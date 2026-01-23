export const optionStyles = {
  optionCard:
    'g-bg-white g-flex g-items-start g-p-4 g-rounded g-border g-border-gray-200 g-cursor-pointer',
  optionLabel: 'g-ml-3 g-flex-1',
  optionTitle: 'g-font-medium g-text-slate-900',
  optionDescription: 'g-text-sm g-text-slate-500 g-mt-0.5',
  optionLink:
    'g-text-sm g-text-primary-500 g-mt-0.5 g-underline g-inline-flex g-items-center g-gap-1',
};

// Size estimation constants from portal16
const EST_KB_DWCA = 0.355350332594235;
const EST_KB_CSV = 0.1161948717948717;
const EST_KB_SPECIES_LIST = 0.00002323897;
const UNZIP_FACTOR = 4.52617;

// Helper function to format file sizes
export const formatFileSize = (bytes: number): string => {
  if (bytes < 0) return 'Unknown';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Calculate estimated ZIPPED download size based on format and record count
// This matches portal16's logic: size * totalRecords gives zipped size
export const getEstimatedSizeInBytes = (type: string, totalRecords: number): number => {
  if (totalRecords === 0) return -1;

  let sizeKb: number;
  switch (type) {
    case 'SIMPLE_CSV':
      sizeKb = EST_KB_CSV * totalRecords;
      break;
    case 'DWCA':
      sizeKb = EST_KB_DWCA * totalRecords;
      break;
    case 'SPECIES_LIST':
      // Species list is much smaller as it's just unique species. Below are based on a few random downloads. But it varies a lot depending on the filters. Better would be to use cardinality instead of occurrence counts.
      sizeKb = Math.max(EST_KB_SPECIES_LIST * totalRecords, 5000);
      break;
    default:
      sizeKb = -1;
  }

  return sizeKb * 1024; // Convert to bytes
};

// Calculate estimated UNZIPPED size (disk space needed after extraction)
// This matches portal16's spaceRequiredForUnzip calculation
export const getEstimatedUnzippedSizeInBytes = (type: string, totalRecords: number): number => {
  const zippedSize = getEstimatedSizeInBytes(type, totalRecords);
  if (zippedSize < 0) return -1;
  return zippedSize * UNZIP_FACTOR;
};
