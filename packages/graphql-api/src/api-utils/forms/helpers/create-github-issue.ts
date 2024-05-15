import logger from '#/logger';
import type { Octokit } from '@octokit/core';
import { dynamicImport } from '#/helpers/utils';

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
    throw error;
  }
}

let octokit: Octokit;
async function useOctokit(): Promise<Octokit> {
  if (octokit) return octokit;

  // @octokit/app is a ESM only package. This is a workaround to use it in a CommonJS project
  const { App } = await dynamicImport('@octokit/app');

  const INSTALLATION_ID = 50469572;
  const APP_ID = "893111";
  const PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA6nEPeOdkwOsZ1MMXJWBE7m1GpzlmkjE/DOetiSv9548fZEae\nP2sO7Otnwct6P9AvJakQM9SHq+QBAj5F1HVrkmqk2zrUfJqbbN15T7a26DLUsmLu\nrdHXjuBYivGg1YL8RWPSNDTzABe7+yxULAL6uein/4+mBqVnHXbwEjUuFm2mnLLO\nQi8b8df3h5QdazEReZhDx5+gtaD7tpDlzoQbRJAq+hHOz8o243wAy9BDQl1CyYLG\nNHGdxKk0m8nc9djs1fiatDP+dzHNBV1plVWMtvxqSlq9tG3iRskdJgh1ImZKi8Fs\nR8Xg8ujXxhDuVo3RQWm/nomSPrY8FesGz2SOVwIDAQABAoIBAF+lCovn0yoFgD9V\n7C56bQTcnhOBDoCcCL4KErlAslBzCnqNeOgklC1CCM1+Zvx7wZBavdp3XXZaCbNR\nlomL8fwE+AbcpG3FYZ1zaZeE0nA+tJmmVPui/Y8zpcvhsh0JWEQy6kIUTAMAq9dY\nCWr/OCz6ZveTMkfJ2RyjNmQnQAsznv2THtA0HzPlVL+OuEPRyH8yz299DCKTJxa+\ngdOOSNu86aCfvVknx8D3AP1+1xmpIiKEii2OmCGGtOT9qHPOBXYbgbf59klCfqn7\nmNaykeLQ/BRr27ums2W0LqcOK9x4xCToFe3/ci7lUYXBT7wiI1HqpzWvOjoadgpL\n1QPAHRECgYEA9XlYs8zJO3M7yppufjrxqEXWVi99O/GXVJXQzlfHnHWE8194bWrp\nuyABKF12TRhmxvNBkHd9J9Q6moMZLTfiaerUeD9CxiA8FGWb14LKS79rG1lntZly\n02SUB+HcCA0xz+X16AA4qGeTnItWD72UNa/raypwh1sAbk+IGvepi48CgYEA9H6b\nmbkXj6oVeMdQCicB8pcj9TaBb6fngzRYGrzeycJ5cC0Kl68SA7VSNex2RylWlmGo\nFXrX7lJCP2hHnlmRMs4th3JU18HQ7RlB1eqQw2P71BL8+AFfqNd38KtaSjl/Mcvo\n7B3oUDNAAn0fcpItnQXupmj8p32qXsSFQ01sDLkCgYApzPgl5gF+dikAXzvhkvgD\nx6CwHHYe9wzmAn0EJj5/jiONrfw75bDXhKOt0/yJNFaMGnBXwYE2fxVbqmdnI9US\nZEK6F0uvoV2Zu5PGJyd7rqT2i0r1yaOcC8yJaxSk6lpJJMezMhZz1u90AOYu2AGd\nAs/798YhxoVUQ4bR0Mq2UQKBgQC7i+MQKEtKiM2vuDRNlV6JGCcdEpJ3c/TDUIPE\n/txnKCa/Rc26TTEkZxKJCrowHCWvdXnaAEFjLvZibTuC3HHk5wNFww4R8zqwpY86\n6JPjTe7+3xHtrCAVBDOdCdRY24IWULR7avWpj6aqQhC9ciRLLyHBxQcJ8/ucdmND\nHUClAQKBgESLS7y21DYK86Xk745cyd2QIaUbpruHmFddbh4+DJ8zGNyfbZL2Abb8\n6rdRNnP+RkQNv05tgKHQ3r4NvE1qKY9fcLKKimnPQmsbcHRtamm4CwjSf2KiNKPe\nMgOQyxEV2kUWx8vSMPJazWiKlmoVSB9UaKclgjgV+2ybNF0OHSGT\n-----END RSA PRIVATE KEY-----\n";

  const app = new App({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
  });

  // A GitHub App can be installed on multiple installations
  // We need to get the GBIF installation to read/write to the different GBIF repositories
  octokit = await app.getInstallationOctokit(INSTALLATION_ID);

  return octokit;
}
