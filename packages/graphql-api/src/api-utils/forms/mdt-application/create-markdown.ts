import { MdtApplicationDTO } from '.';

const humanReadable = (value: string) => value.replace(/_/g, ' ');

const getJsonMarkdown = (data: MdtApplicationDTO) =>
  '```' +
  `json
${JSON.stringify(data, null, 2)}
` +
  '```';

// eslint-disable-next-line import/prefer-default-export
export function createMarkdown(data: MdtApplicationDTO) {
  return `## ${data.installation_name}

Contact name: ${data.person_name}
Contact email: [${data.email}](mailto:${data.email})
Node: [${data.participant.title}](https://www.gbif.org/country/${
    data.participant.country
  }/participation)

**Application type**
*Type*: ${humanReadable(data.type)}

${
  data.type === 'Group_installation'
    ? `*Involved parties*: ${data.group_publisher_description}`
    : ''
}

**Content providers**
${data.content_providers}

**Mode of Operation**
${data.Mode_of_operation}

**Timelines**
${data.timeline}

**Installation name**
${data.installation_name}

**Installation description**
${data.description}

**Domain**
${data.domain}

**Status of application**

* [ ] Content providers clearly defined
* [ ] User group - the community seems well defined

<details>
<summary>JSON details</summary>

${getJsonMarkdown(data)}
</details>
`;
}
