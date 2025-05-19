import { cn } from '@/utils/shadcn';
import { FaBuilding, FaUserAlt } from 'react-icons/fa';
import { MdMailOutline as MailIcon, MdPhone as PhoneIcon } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function ContactHeader({ children }: { children: React.ReactNode }) {
  return <div className="g-flex g-mb-4">{children}</div>;
}

export function ContactHeaderContent({ children }: { children: React.ReactNode }) {
  return <div className="g-flex-grow">{children}</div>;
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
  if (initials) content = <span className="g-font-bold">{initials}</span>;
  return (
    <div className="g-flex-none g-me-4">
      <IconAvatar>{content}</IconAvatar>
    </div>
  );
}

export function ContactTitle({
  title,
  firstName,
  lastName,
  children,
}: {
  title?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  children?: React.ReactNode;
}) {
  if (!firstName && !lastName && !children) {
    return (
      <h4 className="g-text-base g-italics g-text-slate-400 g-mt-1 g-mb-2">
        <FormattedMessage id="phrases.unknown" defaultMessage="Unknown" />
      </h4>
    );
  }

  const name = [title, firstName, lastName].filter(Boolean).join(' ');
  return (
    <h4 className="g-text-base">
      {children}
      {name}
    </h4>
  );
}

export function ContactDescription({ children }: { children: React.ReactNode }) {
  return <div className="g-text-slate-400">{children}</div>;
}

export function ContactContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return <div className={cn('g-text-slate-500', className)}>{children}</div>;
}

export function ContactActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function ContactAction({ children }: { children: React.ReactNode }) {
  return <div className="g-text-slate-500 [&_svg]:g-me-4 g-mb-1">{children}</div>;
}

export function ContactTelephone({ tel }: { tel?: string | null }) {
  if (!tel) return null;
  return (
    <ContactAction>
      <a href={`tel:${tel}`} className="g-flex g-items-center g-text-inherit">
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
      <a href={`mailto:${email}`} className="g-flex g-items-center g-text-inherit">
        <MailIcon />
        {email}
      </a>
    </ContactAction>
  );
}

export function IconAvatar({ children }: { children: React.ReactNode }) {
  return (
    <div className="g-rounded-full g-w-[3rem] g-h-[3rem] g-bg-slate-300 g-flex g-items-center g-justify-center">
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
      {firstLetter}
      {secondLetter}
    </>
  );
}
