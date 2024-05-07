import json2md from 'json2md';
import { HostedPortalApplicationDTO } from '.';

export function createMarkdown(data: HostedPortalApplicationDTO) {
  const humanReadable = (value: string) => value.replace(/_/g, ' ');

  const nodeContact = `${
    data.nodeContact.type === 'Node_manager_contacted'
      ? `${data.nodeContact.nodeManager} - `
      : ''
  }${humanReadable(data.nodeContact.type)}`;

  // Constructing the json2md data structure
  const markdownData = [
    { h2: data.hostedPortalName },
    { p: `Contact name: ${data.primaryContact.name}` },
    { p: `Contact email: ${data.primaryContact.email}` },
    { p: `**Application type**` },
    { ul: [
        `Type: ${humanReadable(data.applicationType.type)}`,
        data.applicationType.type === 'Other_type_of_portal' ? `Involved parties: ${data.applicationType.publisherDescription}` : null,
        data.applicationType.type === 'National_portal' ? `Participant: [${data.applicationType.participantNode.name}](https://www.gbif.org/country/${data.applicationType.participantNode.countryCode}/participation)` : null
      ].filter(v => v) },
    { p: `Node contact: ${nodeContact}` },
    { p: '**Data scope**' },
    { p: data.dataScope },
    { p: '**User group**' },
    { p: data.userGroup },
    { p: '**Timelines**' },
    { p: data.timelines ?? 'Not specified' },
    { p: '**Languages**' },
    { p: data.languages },
    { p: '**Experience**' },
    { p: humanReadable(data.experience) },
    { p: '**Portal name**' },
    { p: data.hostedPortalName },
    { p: '**Terms accepted**' },
    { p: data.termsAccepted ? 'Yes' : 'No' },
    { p: '**Status of application**' },
    { ul: [
        'The node manager has been contacted',
        'Data scope clearly defined',
        'User group - the community seems well defined',
        'Any GrSciColl issues has been addressed'
      ] },
    { blockquote: 'JSON details' },
    { code: { language: "json", content: JSON.stringify(data, null, 2) } }
  ];

  return json2md(markdownData);
}
