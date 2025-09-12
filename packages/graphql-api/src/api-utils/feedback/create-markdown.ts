import { FeedbackDTO } from '.';

const quoteLinks = (text: string) =>
  text.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');
const striptags = (text: string) => text.replace(/<\/?[^>]+(>|$)/g, '');

export function createMarkdown({
  form,
  __githubUserName,
  __user,
  __domain,
  __agent,
  __referer,
  width,
  height,
  __timestamp,
  _health,
  datasetKey,
  publishingOrgKey,
  networkKeys,
  mention,
}: FeedbackDTO) {
  const message = `${
    form?.title ? `**${quoteLinks(striptags(form.title))}**` : ''
  }

${form?.description ?? ''}

-----

${__githubUserName ? `Github user: @${__githubUserName}` : ''}
${
  __user
    ? `User: [See in registry](${__domain}/api/feedback/user/${__user}) - [Send email](${__domain}/api/feedback/user/mailto/${__user})`
    : ''
}
${__agent ? `System: ${__agent}` : ''}
${__referer ? `Referer: ${__referer}` : ''}
${width ? `Window size: width ${width} - height ${height}` : ''}

[API log](https://private-logs.gbif.org/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${
    __timestamp?.before
  }',to:'${
    __timestamp?.after
  }'))&_a=(columns:!(_source),filters:!(),index:'3390a910-fcda-11ea-a9ab-4375f2a9d11c',interval:auto,query:(language:kuery,query:''),sort:!()))
[Site log](https://private-logs.gbif.org/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${
    __timestamp?.before
  }',to:'${
    __timestamp?.after
  }'))&_a=(columns:!(_source),filters:!(),index:'5c73f360-fce3-11ea-a9ab-4375f2a9d11c',interval:auto,query:(language:kuery,query:''),sort:!()))

${_health ? `System health at time of feedback: ${_health}` : ''}
${datasetKey ? `datasetKey: ${datasetKey}` : ''}
${publishingOrgKey ? `publishingOrgKey: ${publishingOrgKey}` : ''}
${networkKeys ? `Network keys: ${networkKeys.join(' ')}` : ''}
${
  mention
    ? `Node handles: ${mention.map((handle) => `@${handle}`).join(' ')}`
    : ''
}
`;
  return message;
}

export default createMarkdown;
