import json2md from 'json2md';
import config from '#/config';
import { CreatePublisherDTO } from '.';
import { authenticatedRequest } from '../helpers/gbifAuthRequest';

const notNull = <T>(value: T | null | undefined): value is T => value != null;

export async function createPublisher(dto: CreatePublisherDTO) {
  // Make sure the selected node is a voting member, if not, redirect the request to the GBIF secretariat
  if (dto.endorsingNode !== 'other') {
    const node = await getNode(dto.endorsingNode);
    if (node.participationStatus === 'OBSERVER') {
      dto.endorsingNode = 'other';
    }
  }

  // All null and undefined value will be removed later when stringifying the object
  const org = {
    endorsingNodeKey:
      dto.endorsingNode === 'other'
        ? config.participantNodeManagersCommitteeNodeKey
        : dto.endorsingNode,
    title: dto.organizationDetails.name,
    description: dto.organizationDetails.description,
    language: 'ENGLISH',
    phone: dto.organizationDetails.phone ? [dto.organizationDetails.phone] : [],
    homepage: dto.organizationDetails.homePage
      ? [dto.organizationDetails.homePage]
      : [],
    logoUrl: dto.organizationDetails.logo,
    email: dto.organizationDetails.email
      ? [dto.organizationDetails.email]
      : undefined,
    address: dto.organizationAddress.address
      ? [dto.organizationAddress.address]
      : [],
    city: dto.organizationAddress.city,
    postalCode: dto.organizationAddress.postalCode,
    province: dto.organizationAddress.province,
    country: dto.organizationAddress.country,
    latitude: dto.organizationAddress.coordinates.lat,
    longitude: dto.organizationAddress.coordinates.lon,
    contacts: [dto.mainContact, dto.administrativeContact, dto.technicalContact]
      .filter(notNull)
      .map((contact) => ({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email != '' ? [contact.email] : [],
        phone: contact.phone != '' ? [contact.phone] : undefined,
      })),
    comments: [{ content: createComments(dto) }],
  };

  const options = {
    method: 'POST',
    body: org,
    url: `${config.apiv1}/organization/`,
    canonicalPath: 'organization/',
  };

  return authenticatedRequest(options).then((res) => {
    if (res.statusCode !== 201) {
      throw res;
    }

    return res.body;
  });
}

async function getNode(key: string) {
  try {
    const response = await fetch(`${config.apiv1}/node/${key}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch node ${key}`);
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch node ${key}`);
  }
}

function createComments(dto: CreatePublisherDTO): string {
  const markdownJson: Array<Record<string, string | string[]>> = [];

  // Gbif projects
  markdownJson.push({
    p: `Is associated with a GBIF-funded project: ${dto.gbifProjects.type}`,
  });
  if (dto.gbifProjects.type === 'yes' && dto.gbifProjects.projectIdentifier) {
    markdownJson.push({
      p: `Project identifier: ${dto.gbifProjects.projectIdentifier}`,
    });
  }

  // What and how
  const dataTypes = [
    { selected: dto.whatAndHow.resourceMetadata, label: 'Resource metadata' },
    { selected: dto.whatAndHow.checklistData, label: 'Checklist data' },
    {
      selected: dto.whatAndHow.occurrenceOnlyData,
      label: 'Occurrence-only data',
    },
    {
      selected: dto.whatAndHow.samplingEventData,
      label: 'Sampling event data',
    },
  ];
  const selectedDataTypeLabels = dataTypes
    .filter((dt) => dt.selected)
    .map((dt) => dt.label);
  if (selectedDataTypeLabels.length > 0) {
    markdownJson.push({ p: 'Expects to publish:' });
    markdownJson.push({
      ul: selectedDataTypeLabels,
    });
  }

  markdownJson.push({ p: 'Expected data content:' });
  markdownJson.push({ blockquote: dto.whatAndHow.description });

  markdownJson.push({
    p: `Will run a server which exposes data: ${dto.whatAndHow.serverCapable}`,
  });
  markdownJson.push({
    p: `Plans to run publishing software (e.g. an IPT): ${dto.whatAndHow.toolPlanned}`,
  });
  markdownJson.push({
    p: `Needs help for data publishing: ${dto.whatAndHow.doYouNeedHelpPublishing}`,
  });

  return json2md(markdownJson);
}
