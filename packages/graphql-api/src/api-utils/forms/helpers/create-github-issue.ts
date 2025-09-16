import type { Octokit } from '@octokit/core';
import logger from '#/logger';
import { dynamicImport } from '#/helpers/utils-ts';
import config from '#/config';

export type CreateIssueArgs = {
  owner: string;
  repo: string;
  title: string;
  body: string;
  labels?: string[];
};

export async function createGitHubIssue(args: CreateIssueArgs) {
  try {
    if (!isGithubEnabled()) {
      logger.warn({
        message: 'GitHub integration is disabled. Skipping creating issue.',
        args,
      });
      return;
    }

    const octokit = await useOctokit();
    const response = await octokit.request(
      'POST /repos/{owner}/{repo}/issues',
      args,
    );

    return response.data;
  } catch (error) {
    logger.error({ message: 'Error creating issue', error });
    throw error;
  }
}

function isGithubEnabled() {
  // Respect explicit configuration
  if (typeof config.github.enabled === 'boolean') return config.github.enabled;

  // Enable in production
  return process.env.NODE_ENV === 'production';
}

let octokit: Octokit;
async function useOctokit(): Promise<Octokit> {
  if (octokit) return octokit;

  // @octokit/app is a ESM only package. This is a workaround to use it in a CommonJS project
  const { App } = await dynamicImport<typeof import('@octokit/app')>(
    '@octokit/app',
  );

  // Extract the necessary information from the config file
  const INSTALLATION_ID = parseInt(config.github.installationId);
  const APP_ID = config.github.appId;
  const PRIVATE_KEY = config.github.certificate;

  const app = new App({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
  });

  // A GitHub App can be installed on multiple installations
  // We need to get the GBIF installation to read/write to the different GBIF repositories
  octokit = await app.getInstallationOctokit(INSTALLATION_ID);

  return octokit;
}
