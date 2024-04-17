export type CreateIssueArgs = {
  owner: string;
  repo: string;
  title: string;
  body: string;
  token: string;
};

export async function createGitHubIssue(args: CreateIssueArgs): Promise<void> {
  const { owner, repo, title, body, token } = args;
  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
  const issueData = {
    title,
    body,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(issueData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}