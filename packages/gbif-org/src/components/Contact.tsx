import { FaBuilding, FaUserAlt } from 'react-icons/fa';
import { FormattedMessage } from 'react-intl';
import { MdMailOutline as MailIcon, MdPhone as PhoneIcon } from 'react-icons/md';
import { cn } from '@/utils/shadcn';

export function ContactHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex mb-4">{children}</div>;
}

export function ContactHeaderContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-grow">{children}</div>;
}

export function ContactAvatar({
  firstName,
  lastName,
  organization,
}: {
  firstName?: string | null;
  lastName?: string | null;
  organization?: string | null;
}) {
  const initials = getInitials({ firstName, lastName });
  let content = <FaUserAlt />;
  if (!firstName && !lastName && organization) content = <FaBuilding />;
  if (initials) content = <span className="font-bold">{initials}</span>;
  return (
    <div className="flex-none me-4">
      <IconAvatar>{content}</IconAvatar>
    </div>
  );
}

export function ContactTitle({
  firstName,
  lastName,
  children,
}: {
  firstName?: string | null;
  lastName?: string | null;
  children?: React.ReactNode;
}) {
  if (!firstName && !lastName && !children) {
    return (
      <h4 className="text-lg italics text-slate-400 mt-1 mb-2">
        <FormattedMessage id="phrases.unknown" defaultMessage="Uknown" />
      </h4>
    );
  }
  return (
    <h4 className="text-lg">
      {children}
      {firstName} {lastName}
    </h4>
  );
}

export function ContactDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-slate-400">{children}</div>;
}

export function ContactContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return <div className={cn('text-slate-500', className)}>{children}</div>;
}

export function ContactActions({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function ContactAction({ children }: { children: React.ReactNode }) {
  return <div className="text-slate-400 [&_svg]:me-4 mb-1">{children}</div>;
}

export function ContactTelephone({ tel }: { tel?: string | null }) {
  if (!tel) return null;
  return (
    <ContactAction>
      <a href={`tel:${tel}`} className="flex items-center">
        <PhoneIcon />
        {tel}
      </a>
    </ContactAction>
  );
}

export function ContactEmail({ email }: { email?: string | null }) {
  if (!email) return null;
  return (
    <ContactAction>
      <a href={`mailto:${email}`} className="flex items-center">
        <MailIcon />
        {email}
      </a>
    </ContactAction>
  );
}

export function IconAvatar({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full w-[3rem] h-[3rem] bg-slate-300 flex items-center justify-center">
      {children}
    </div>
  );
}

function getInitials({
  firstName,
  lastName,
}: {
  firstName?: string | null;
  lastName?: string | null;
}) {
  if (typeof firstName !== 'string') return null;
  if (firstName === '') return null;
  const firstLetter = firstName[0];
  const firstCode = firstLetter.charCodeAt(0);
  if (firstCode > 250) return null;

  let secondLetter;
  if (typeof lastName === 'string' && lastName.length > 0) secondLetter = lastName[0];
  if (secondLetter) {
    const secondCode = secondLetter.charCodeAt(0);
    if (secondCode > 250) return null;
  }

  return (
    <>
      {firstLetter} {secondLetter}
    </>
  );
}
