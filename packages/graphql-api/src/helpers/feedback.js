/* eslint-disable no-use-before-define */
import _ from 'lodash';

// get types of available feedback for the occurrence
export default async function getFeedbackOptions({ occurrence, dataSources }) {
  const dataset = await dataSources.datasetAPI.getDatasetByKey({
    key: occurrence.datasetKey,
  });
  // const installation = await dataSources.installationAPI.getInstallationByKey({
  //   key: occurrence.installationKey,
  // });
  return getFeedback({
    occurrence,
    dataset,
  });
}

function getFeedback({ dataset, occurrence }) {
  // there will always be the option to provde feedback to the GBIF github repository
  const gbifGithub = `https://github.com/gbif/portal-feedback/issues/new?body=Occurrence%20key%3A%20${occurrence.key}`;

  const publisherFeedbackSystem = getFeedbackSystem({ config, occurrence });

  const datasetContactEmail = getContact(dataset);
  // look for a dataset contact we can use
  return {
    gbifGithub,
    publisherFeedbackSystem,
    datasetContactEmail,
  };
}

function getFeedbackSystem({ config, occurrence }) {
  const templateConfig =
    config.publisher[occurrence.publishingOrgKey] ??
    config.hostingOrganization[occurrence.hostingOrganizationKey] ??
    config.installation[occurrence.installationKey];
  if (templateConfig) {
    // given the urlTemplate in the config, replace all keys with data from the occurrence
    return {
      value: replaceKeys(templateConfig.url, templateConfig.keys, occurrence),
      title: templateConfig.name,
    };
  }
  return null;
}

function replaceKeys(template, keys, occurrence) {
  let url = template;
  keys.forEach((key) => {
    url = url.replace(`{{${key}}}`, occurrence[key]);
  });
  return url;
}

function getContact(dataset) {
  const contacts = dataset?.contacts || [];
  const adminContacts = contacts.filter(function (contact) {
    return (
      (contact.type === 'ADMINISTRATIVE_POINT_OF_CONTACT' ||
        contact.type === 'NODE_MANAGER') &&
      !_.isEmpty(contact.email)
    );
  });

  if (adminContacts.length > 0) {
    // get first contact name and mail
    const firstContact = {
      firstName: adminContacts[0].firstName,
      lastName: adminContacts[0].lastName,
      organization: adminContacts[0].organization,
      email: adminContacts[0].email[0],
    };
    const name = firstContact.firstName
      ? `${firstContact.firstName} ${firstContact.lastName}`
      : firstContact.organization;
    return {
      value: `${firstContact.email}`,
      title: name ?? firstContact.email,
    };
  }
  return null;
}

const config = {
  publisher: {
    '28eb1a3f-1c15-4a95-931a-4af90ecb574d': {
      url: '{{references}}',
      keys: ['references'],
      name: 'iNaturalist',
    },
    // issue on https://github.com/gbif/portal-feedback/issues/3088
    'da86174a-a605-43a4-a5e8-53d484152cd3': {
      url: '{{references}}',
      keys: ['references'],
      name: 'Pl@ntNet',
    },
    'ccc2e3ec-98ba-4e74-878d-7dcf0f57baba': {
      url: '{{occurrenceID}}',
      keys: ['occurrenceID'],
      name: 'Danish Mycological Society',
    },
    // issue on https://github.com/gbif/portal16/issues/1471
    '7ce8aef0-9e92-11dc-8738-b8a03c50a862': {
      url: 'https://github.com/plazi/community/issues/new?body=Please%20leave%20your%20comment%20here...%0A%0A**Context**%0A%5BGBIF%20occurrence%5D(https%3A%2F%2Fwww.gbif.org%2Foccurrence%2F{{key}})%0A%5BPlazi%20reference%5D({{references}})',
      keys: ['references', 'key'],
      name: 'Plazi',
    },
  },
  hostingOrganization: {
    '96710dc8-fecb-440d-ae3e-c34ae8a9616f': {
      // issue https://github.com/gbif/portal-feedback/issues/5226
      url: '{{references}}',
      keys: ['references'],
      name: 'Symbiota',
    },
  },
  installation: {
    '2c733a9d-363d-4d66-9aef-3e0f7bc44bec': {
      // should still be here as Symbiota is many things https://github.com/gbif/portal-feedback/issues/5226#issuecomment-1983043344
      url: '{{references}}',
      keys: ['references'],
      name: 'Symbiota',
    },
  },
};
