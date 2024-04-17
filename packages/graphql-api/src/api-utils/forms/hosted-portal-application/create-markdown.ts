import { Inputs } from '.';

export function createMarkdown(data: Inputs) {
  const humanReadable = (value: string) => value.replace(/_/g, ' ');

  const nodeContact = `${
    data.nodeContact.type === 'Node_manager_contacted'
      ? `${data.nodeContact.nodeManager} - `
      : ''
  }${humanReadable(data.nodeContact.type)}`;

  return [
    `## ${data.hostedPortalName}`,
    `Contact name: ${data.primaryContact.name}`,
    `Contact email: ${data.primaryContact.email}`,
    '  ',
    '**Application type**  ',
    `*Type*: ${humanReadable(data.applicationType.type)}`,
    '  ',
    data.applicationType.type === 'Other_type_of_portal' &&
      `*Involved parties*: ${data.applicationType.publisherDescription}`,
    data.applicationType.type === 'National_portal' &&
      `*Participant*: [${data.applicationType.participantNode.name}](https://www.gbif.org/country/${data.applicationType.participantNode.countryCode}/participation)`,
    '  ',
    `*Node contact*: ${nodeContact}`,
    '  ',
    '**Data scope**  ',
    data.dataScope,
    '  ',
    '**User group**  ',
    data.userGroup,
    '  ',
    '**Timelines**  ',
    data.timelines ?? 'Not specified',
    '  ',
    '**Languages**  ',
    data.languages,
    '  ',
    '**Experience**  ',
    humanReadable(data.experience),
    '  ',
    '**Portal name**  ',
    data.hostedPortalName,
    '  ',
    '**Terms accepted**  ',
    data.termsAccepted ? 'Yes' : 'No',
    '  ',
    '**Status of application**  ',
    '* [ ] The node manager has been contacted',
    '* [ ] Data scope clearly defined',
    '* [ ] User group - the community seems well defined',
    '* [ ] Any GrSciColl issues has been addressed',
    '<details>',
    '<summary>JSON details</summary>',
    '',
    '```json',
    JSON.stringify(data, null, 2),
    '```',
    '</details>',
  ]
    .filter((v) => typeof v === 'string')
    .join('\n');
}
