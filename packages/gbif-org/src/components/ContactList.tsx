import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { MdMail, MdPhone } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import EmptyValue from './EmptyValue';
import { Details } from './Details';
import Properties, { Term, Value } from './Properties';
import { Card, CardContent } from './ui/largeCard';
import { cn } from '@/utils/shadcn';

export function ContactList({ contacts = [], className, ...props }) {
  return (
    <ul className={cn('p-0 m-0 list-none', className)} {...props}>
      {contacts.map((c, i, arr) => (
        <li
          className={`${i + 1 !== arr.length ? 'border-b' : ''} border-slate-200 mb-1`}
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

  let roles = contact.roles || (contact.type ? [contact.type] : []);
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
    <div className="py-2 flex items-start">
      <div className="flex-auto w-1/3">
        <div>
          <h4 className="font-semibold">
            {name || contact.organization || <EmptyValue id="phrases.unknown" />}
          </h4>
          {/* <div className="gb-discreet">{roles && Roles}</div> */}
        </div>
      </div>
      <div className="flex-auto w-1/3 text-slate-500">{roles && Roles}</div>
      <div className="flex-auto w-1/3 flex justify-end">
        <div className="flex items-center">
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
            <a href={`mailto:${contact.email[0]}`}>
              <MdMail style={{ pointerEvents: 'none' }} />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Details summary={summary} iconClassName="py-2">
      <div className="mb-2 mt-1">
        <Card>
          <CardContent className="mt-4 pb-4 md:pb-4">
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

              {roles && <Field field="roles" contact={contact} value={Roles} />}

              {['homepage', 'email', 'phone', 'userId'].map((f) => (
                <ArrayField isHyperText field={f} contact={contact} key={f} />
              ))}
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

ContactList.propTypes = {
  as: PropTypes.element,
};
