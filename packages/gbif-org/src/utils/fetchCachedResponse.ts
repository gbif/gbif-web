type FetchCachedResponseOptions = {
  route: string;
  preview?: boolean;
  locale?: string;
};

const baseUrl = `${import.meta.env.PUBLIC_BASE_URL}/unstable-api/cached-response`;

export function fetchCachedResponse({ route, preview, locale }: FetchCachedResponseOptions) {
  const url = new URL(`${baseUrl}${route.startsWith('/') ? route : `/${route}`}`);

  if (preview) url.searchParams.set('preview', 'true');
  if (locale) url.searchParams.set('locale', locale);

  return fetch(url, preview ? { cache: 'no-cache' } : undefined);
}
