import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';
import { MdMail, MdPhone } from 'react-icons/md';
import { Properties } from '../Properties/Properties';
import { Accordion } from '../Accordion/Accordion';
import { HyperText } from '../HyperText/HyperText';
import { FormattedMessage } from "react-intl";

const { Term: T, Value: V } = Properties;

export function ContactList({
  contacts = [],
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'contactList', {/*modifiers goes here*/ }, className);

  return <ul css={styles.contactList({ theme })} {...props}>
    {contacts.map((c, i) => <li key={`${c.key || i}`}><Contact contact={c} /></li>)}
  </ul>
};

function Contact({ contact, ...props }) {
  const theme = useContext(ThemeContext);
  const name = (contact.firstName || contact.lastName) ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim() : undefined;

  let roles = contact.roles || (contact.type ? [contact.type] : undefined);
  const Roles = <>{roles.map((r) => <React.Fragment key={r}><FormattedMessage id={`enums.role.${r}`} defaultMessage={r} /><br /></React.Fragment>)}</>;

  const userId = contact.userId || [];
  const orcid = userId.find(x => x.indexOf('orcid.org') != -1)

  const summary = <div css={styles.contactListItem({ theme })}>
    <div>
      <div>
        <h4>{name || contact.organization}</h4>
        {/* <div className="gb-discreet">{roles && Roles}</div> */}
      </div>
    </div>
    <div className="gb-discreet">{roles && Roles}</div>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div>
        {orcid && <a href={orcid} style={{ marginRight: 16, width: 16, height: 16, display: 'inline-block' }}><img style={{pointerEvents: 'none'}} src="https://www.gbif.org/img/orcid_16x16.gif" /></a>}
        {contact?.email?.length > 0 && <a href={`mailto:${contact.email[0]}`}><MdMail style={{pointerEvents: 'none'}}/></a>}
      </div>
    </div>
  </div>;

  return <Accordion summary={summary} >
    <div style={{ marginLeft: 8, marginBottom: 32 }}>
      <Properties>
        {['organization', 'position', 'address', 'city', 'province', 'postalCode']
          .map(f => <Field field={f} contact={contact} key={f} />)
        }

        {contact.country && <Field field="country" contact={contact} value={<FormattedMessage id={`enums.countryCode.${contact.country}`} defaultMessage={contact.country} />} />}

        {roles && <Field field="roles" contact={contact} value={Roles} />}

        {['homepage', 'email', 'phone', 'userId']
          .map(f => <ArrayField isHyperText field={f} contact={contact} key={f} />)
        }
      </Properties>
    </div>
  </Accordion>
}

function Field({ field, contact = {}, value, ...props }) {
  if (!value && Array.isArray(contact[field])) return <ArrayField field={field} contact={contact} {...props} />
  if (!value && !contact[field]) return null;

  return <>
    <T>
      <FormattedMessage id={`contact.${field}`} defaultMessage={field} />
    </T>
    {value && <V>
      {value}
    </V>}
    {!value && <V>
      {contact[field]}
    </V>}
  </>
}

function ArrayField({ field, contact = {}, value, ...props }) {
  if (!contact[field] || contact[field]?.length === 0) return null;
  return <>
    <T>
      <FormattedMessage id={`contact.${field}`} defaultMessage={field} />
    </T>
    <V>
      {contact[field].map((v, i) => <React.Fragment key={i}><HyperText text={v} /><br /></React.Fragment>)}
    </V>
  </>
}

// function Contact({ contact, ...props }) {
//   const theme = useContext(ThemeContext);
//   const name = (contact.firstName || contact.lastName) ? `${contact.firstName} ${contact.lastName}`.trim() : undefined;

//   return <details css={styles.contactListItem({ theme })}>
//     <summary>
//       <div className="gb-contactListImage" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/b/b4/Insigne_musei_Bergense.png)' }}></div>
//       <div>
//         <h4>{name || contact.organization}</h4>
//         <div className="gb-discreet">Data administrator, Metadata author, Data administrator, Metadata author</div>
//       </div>
//       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <span>
//           <span style={{ marginRight: 16, background: 'tomato', borderRadius: '50%', width: 16, height: 16, display: 'inline-block' }}></span>
//           <span style={{ marginRight: 16, background: 'pink', borderRadius: '50%', width: 16, height: 16, display: 'inline-block' }}></span>
//           <span style={{ marginRight: 16, background: 'deepskyblue', borderRadius: '50%', width: 16, height: 16, display: 'inline-block' }}></span>
//         </span>
//         <a href="mailto:jdoe@gmail.com">jdoe@gmail.com</a>
//       </div>
//       <div className="gb-expandRow"><MdExpandMore /></div>
//     </summary>
//     <div style={{ marginLeft: 56, marginTop: 16 }}>
//       <Properties>
//         <T>Organization</T>
//         <V>Norsk institutt for naturforskning</V>
//         <T>Address</T>
//         <V>Postboks 5685 Sluppen</V>
//         <T>City</T>
//         <V>Trondheim</V>
//         <T>Country</T>
//         <V>Norway</V>
//       </Properties>
//     </div>
//   </details>
// }

// export const ContactAccordion = uncontrollable(AccordionControlled, {
//   open: 'onToggle'
// });

ContactList.propTypes = {
  as: PropTypes.element
};
