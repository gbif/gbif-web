import { cn } from '@/utils/shadcn';
import React from 'react';
import { MdMail } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Details } from './details';
import EmptyValue from './emptyValue';
import Properties, { Property, Term, Value } from './properties';
import { Card, CardContent } from './ui/largeCard';

interface ContactListProps {
  as?: React.ReactElement;
  contacts?: any[];
  className?: string;
}

export function ContactList({ contacts = [], className, ...props }: ContactListProps) {
  return (
    <ul className={cn('g-p-0 g-m-0 g-list-none', className)} {...props}>
      {contacts.map((c, i, arr) => (
        <li
          className={`${i + 1 !== arr.length ? 'g-border-b' : ''} g-border-slate-200 g-mb-1`}
          key={`${c.key || i}`}
        >
          <Contact contact={c} />
        </li>
      ))}
    </ul>
  );
}

function Contact({ contact, ...props }) {
  const name =
    contact.firstName || contact.lastName
      ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
      : undefined;

  const roles = getRoles(contact);
  const Roles = (
    <>
      {roles.map((r) => (
        <React.Fragment key={r}>
          <FormattedMessage id={`enums.role.${r}`} defaultMessage={r} />
          <br />
        </React.Fragment>
      ))}
    </>
  );

  const userId = contact.userId || [];
  const orcid = userId.find((x) => x.indexOf('orcid.org') != -1);

  const summary = (
    <div className="g-py-2 g-flex g-items-start">
      <div className="g-flex-auto g-w-1/3">
        <div>
          <h4 className="g-font-semibold">
            {name || contact.organization || <EmptyValue id="phrases.unknown" />}
          </h4>
          {/* <div className='gb-discreet'>{roles && Roles}</div> */}
        </div>
      </div>
      <div className="g-flex-auto g-w-2/3 g-text-slate-500 g-flex g-flex-row g-items-start">
        {roles.length > 0 && <div className="g-grow">{Roles}</div>}
        <div className="g-flex g-grow-0 g-justify-end">
          <div className="g-flex g-items-center">
            {orcid && (
              <a
                href={orcid}
                style={{ marginRight: 16, width: 16, height: 16, display: 'inline-block' }}
              >
                <img
                  style={{ pointerEvents: 'none' }}
                  src="https://www.gbif.org/img/orcid_16x16.gif"
                />
              </a>
            )}
            {contact?.email?.length > 0 && (
              <a className="g-text-inherit" href={`mailto:${contact.email[0]}`}>
                <MdMail style={{ pointerEvents: 'none' }} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Details summary={summary} iconClassName="g-py-2">
      <div className="g-mb-2 g-mt-1">
        <Card>
          <CardContent className="g-mt-4 g-pb-4 md:g-pb-4">
            <Properties breakpoint={800} useDefaultTermWidths>
              {['organization', 'position', 'address', 'city', 'province', 'postalCode'].map(
                (f) => (
                  <Field field={f} contact={contact} key={f} />
                )
              )}

              {contact.country && (
                <Field
                  field="country"
                  contact={contact}
                  value={
                    <FormattedMessage
                      id={`enums.countryCode.${contact.country}`}
                      defaultMessage={contact.country}
                    />
                  }
                />
              )}

              {roles.length > 0 && <Field field="roles" contact={contact} value={Roles} />}

              <Property
                labelId="contact.email"
                value={contact.email}
                formatter={(email) => (
                  <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
                    {email}
                  </a>
                )}
              />
              <Property
                labelId="contact.homepage"
                value={contact.homepage}
                formatter={(item) => (
                  <a href={`${item}`} target="_blank" rel="noopener noreferrer">
                    {item}
                  </a>
                )}
              />
              <Property
                labelId="contact.phone"
                value={contact.phone}
                formatter={(item) => (
                  <a href={`tel:${item}`} target="_blank" rel="noopener noreferrer">
                    {item}
                  </a>
                )}
              />
              <Property
                labelId="contact.userId"
                value={contact.userId}
                formatter={(item) => (
                  <a href={`${item}`} target="_blank" rel="noopener noreferrer">
                    {item}
                  </a>
                )}
              />
            </Properties>
          </CardContent>
        </Card>
      </div>
    </Details>
  );
}

function Field({ field, contact = {}, value, ...props }) {
  if (!value && Array.isArray(contact[field]))
    return <ArrayField field={field} contact={contact} {...props} />;
  if (!value && !contact[field]) return null;

  return (
    <>
      <Term>
        <FormattedMessage id={`contact.${field}`} defaultMessage={field} />
      </Term>
      {value && <Value>{value}</Value>}
      {!value && <Value>{contact[field]}</Value>}
    </>
  );
}

function ArrayField({ field, contact = {}, value, ...props }) {
  if (!contact[field] || contact[field]?.length === 0) return null;
  return (
    <>
      <Term>
        <FormattedMessage id={`contact.${field}`} defaultMessage={field} />
      </Term>
      <Value>
        {contact[field].map((v, i, arr) => (
          <React.Fragment key={i}>
            <div>{v}</div>
            {i + 1 !== arr.length && <br />}
          </React.Fragment>
        ))}
      </Value>
    </>
  );
}

function getRoles(contact: any) {
  if (contact.roles) return contact.roles;
  if (contact.type) {
    if (Array.isArray(contact.type)) return contact.type;
    return [contact.type];
  }
  return [];
}
