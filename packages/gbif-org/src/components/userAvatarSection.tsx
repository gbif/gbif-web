import { JazzIcon } from '@/components/JazzIcon';
import { useConfig } from '@/config/config';
import { useUser } from '@/contexts/UserContext';
import { DynamicLink } from '@/reactRouterPlugins';

export function UserAvatarSection({ children }: { children: React.ReactNode }) {
  const { isGBIFOrg } = useConfig();
  const { user } = useUser();

  if (!isGBIFOrg || !user) return null;

  return (
    <div className="g-flex g-gap-4 g-mb-8">
      <DynamicLink
        pageId="user-profile"
        className="g-w-16 g-h-16 g-flex-none g-rounded-full g-hidden md:g-block"
      >
        {user.photo ? (
          <img
            src={user.photo}
            alt={`${user.firstName} ${user.lastName}`}
            className="g-w-full g-h-full g-object-cover g-rounded-lg"
          />
        ) : (
          <JazzIcon
            seed={user.userName ?? user.email ?? 'unknown'}
            className="g-rounded-lg g-block"
          />
        )}
      </DynamicLink>
      <div className="g-flex-grow">{children}</div>
    </div>
  );
}
