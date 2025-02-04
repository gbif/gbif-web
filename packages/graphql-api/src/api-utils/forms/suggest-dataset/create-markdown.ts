import json2md from 'json2md';
import { SuggestDatasetDTO } from '.';

export function createMarkdown(data: SuggestDatasetDTO): string {
  const markdownJson: Parameters<typeof json2md>[0] = [];

  markdownJson.push({ h1: data.title });

  if (data.datasetLink)
    markdownJson.push({ p: `Dataset link: ${data.datasetLink}` });

  markdownJson.push({ p: `Region: ${data.region}` });

  markdownJson.push({ p: `Taxon: ${data.taxon}` });

  markdownJson.push({ p: `Type: ${data.type}` });

  if (data.datasetImportance)
    markdownJson.push({
      p: `Why is this important: ${data.datasetImportance}`,
    });

  if (data.priority) markdownJson.push({ p: `Priority: ${data.priority}` });

  markdownJson.push({ p: `License: ${data.license}` });

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
