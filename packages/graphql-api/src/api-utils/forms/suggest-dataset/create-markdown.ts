import json2md from 'json2md';
import { SuggestDatasetDTO } from '.';

// Map enum values to human-readable format for GitHub issues
const licenseMap: Record<string, string> = {
  CC0_1_0: 'CC0 1.0',
  CC_BY_4_0: 'CC BY 4.0',
  CC_BY_NC_4_0: 'CC BY-NC 4.0',
  UNSPECIFIED: 'Unspecified',
  UNSUPPORTED: 'Not an open license',
};

const datasetTypeMap: Record<string, string> = {
  undefined: 'Unknown',
  OCCURRENCE: 'Occurrence',
  CHECKLIST: 'Checklist',
  SAMPLING_EVENT: 'Sampling event',
  METADATA: 'Metadata',
};

export function createMarkdown(data: SuggestDatasetDTO): string {
  const markdownJson: Parameters<typeof json2md>[0] = [];

  markdownJson.push({ h1: data.title });

  if (data.datasetLink)
    markdownJson.push({ p: `Dataset link: ${data.datasetLink}` });

  markdownJson.push({ p: `Region: ${data.region}` });

  markdownJson.push({ p: `Taxon: ${data.taxon}` });

  markdownJson.push({ p: `Type: ${datasetTypeMap[data.type] || data.type}` });

  if (data.datasetImportance)
    markdownJson.push({
      p: `Why is this important: ${data.datasetImportance}`,
    });

  if (data.priority) markdownJson.push({ p: `Priority: ${data.priority}` });

  markdownJson.push({
    p: `License: ${licenseMap[data.license] || data.license}`,
  });

  if (data.datasetBibliographicDoi)
    markdownJson.push({
      p: `Bibliographic reference: ${data.datasetBibliographicDoi}`,
    });

  if (data.comments) markdownJson.push({ p: `Comments: ${data.comments}` });

  if (data.datasetHolderContact)
    markdownJson.push({
      p: `Dataholders contact information: ${data.datasetHolderContact}`,
    });

  if (data.userContact)
    markdownJson.push({ p: `Users contact info: ${data.userContact}` });

  return json2md(markdownJson);
}
