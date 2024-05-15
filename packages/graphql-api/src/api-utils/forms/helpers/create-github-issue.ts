import logger from '#/logger';

export type CreateIssueArgs = {
  owner: string;
  repo: string;
  title: string;
  body: string;
  labels?: string[];
};

export async function createGitHubIssue(args: CreateIssueArgs) {
  try {
    const octokit = await useOctokit();
    const response = await octokit.request(
      'POST /repos/{owner}/{repo}/issues',
      args,
    );

    return response.data;
  } catch (error) {
    logger.error({ message: 'Error creating issue', error });
  }
}

async function useOctokit() {
  // @octokit/app is a ESM only package. This is a workaround to use it in a CommonJS project
  const { App } = await import('@octokit/app');

  const INSTALLATION_ID = 50469572;
  const APP_ID = '893111';
  const PRIVATE_KEY = '';

  const app = new App({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
  });

  // A GitHub App can be installed on multiple installations
  // We need to get the GBIF installation to read/write to the different GBIF repositories
  const octokit = await app.getInstallationOctokit(INSTALLATION_ID);

  return octokit;
}
