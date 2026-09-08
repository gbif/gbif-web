import { useUser } from '@/contexts/UserContext';
import { useMemo } from 'react';

export type VolatileContributor = {
  email?: Array<string | null> | null;
  userId?: Array<string | null> | null;
} | null;

// "Trusted" mirrors the check the dataset About page uses to decide whether to show the
// registry-management links: the logged-in user is a contact on the dataset (matched by email
// or ORCID) or holds the REGISTRY_ADMIN role. `isLoading` is exposed separately because the
// logged-in user is only known client-side (fetched after mount) — callers that gate whole
// sections/pages on this should wait for `isLoading` to settle rather than treating the initial
// `isTrusted: false` as final, or they'll flash/redirect trusted users away before their
// identity has loaded.
export function useIsTrustedDatasetContact(
  volatileContributors?: VolatileContributor[] | null
): { isTrusted: boolean; isLoading: boolean } {
  const { user, isLoading } = useUser();

  const isTrusted = useMemo(() => {
    if (!user || !volatileContributors) return false;
    const matchingEmail = volatileContributors.some((contact) =>
      contact?.email?.some((email) => email === user.email)
    );
    const matchingOrcid = volatileContributors.some((contact) =>
      contact?.userId?.some((identifier) => identifier === user.orcid)
    );
    const isAdmin = user?.roles?.includes('REGISTRY_ADMIN');
    return matchingEmail || matchingOrcid || isAdmin || false;
  }, [user, volatileContributors]);

  return { isTrusted, isLoading };
}
