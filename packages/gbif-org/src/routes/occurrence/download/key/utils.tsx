import { DownloadKeyQuery } from '@/gql/graphql';

export function downloadCompleted(download: DownloadKeyQuery['download']) {
  return download?.status === 'SUCCEEDED' || download?.status === 'FILE_ERASED';
}
