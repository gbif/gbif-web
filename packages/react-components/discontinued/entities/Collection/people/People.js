
import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as styles from './styles';
import * as cssCollection from '../styles';
import { ListItem } from "../../../components";
import { Collectors } from './collectors';
import { join } from '../../../utils/util';
import { MdMailOutline as MailIcon, MdPhone as PhoneIcon } from 'react-icons/md';

import sortBy from 'lodash/sortBy';
import {
  Switch,
  Route,
  NavLink,
  useRouteMatch,
} from "react-router-dom";

const Name2Avatar = ListItem.Name2Avatar;

export function People({
  collection,
  recordedByCardinality,
  className,
  ...props
}) {
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);

  const test = 'collection';
  return <div css={styles.people({ theme })}>
    <nav css={styles.nav({ theme })}>
      <ul>
        <li>
          <NavLink to={url} exact activeClassName="isActive" css={styles.navItem({ theme })}>Staff<span css={cssCollection.tabCountChip()}>{collection.contactPersons?.length}</span></NavLink>
        </li>
        <li>
          <NavLink to={join(url, '/agents')} activeClassName="isActive" css={styles.navItem({ theme })}>Collectors and identifiers<span css={cssCollection.tabCountChip()}>{recordedByCardinality}</span></NavLink>
        </li>
      </ul>
    </nav>
    <div style={{ width: '100%', margin: 24 }}>
      <Switch>


        <Route path={join(path, '/agents')}>
          <Collectors id={collection.key} />
        </Route>

        <Route path={path}>
          {collection?.contactPerons?.length === 0 && <div>
            There is no staff associated with this record. You can change that. <a herf="">Learn more</a>
          </div>}

          {collection?.contactPersons?.length > 0 && <div css={css`
            display: flex;
            flex-wrap: wrap;
            margin-top: -12px;
            > div {
              flex: 1 1 auto;
              width: calc(50% - 24px);
              max-width: 400px;
              min-width: 300px;
              margin: 12px;
            }
          `}>
            {sortBy(collection.contactPersons, 'position').map(contact => {
              let actions = [];
              if (contact.email?.[0]) actions.push(<a href={`mailto:${contact.email?.[0]}`}><MailIcon />{contact.email?.[0]}</a>);
              if (contact.phone?.[0]) actions.push(<a href={`tel:${contact.phone?.[0]}`}><PhoneIcon />{contact.phone?.[0]}</a>);
              return <ListItem
                key={contact.key}
                isCard
                title={`${contact.firstName || ''} ${contact.lastName || ''}`}
                avatar={<Name2Avatar first={contact.firstName} last={contact.lastName} />}
                description={contact.position?.[0]}
                footerActions={actions}>
                {contact.researchPursuits}
              </ListItem>
            })}
          </div>}

          {/* <div css={css.staffList({ theme })}>
            {sortBy(collection.contactPersons, 'position').map(contact => {
              return <article css={css.person({ theme })}>
                <div css={css.staffDesc({ theme })}>
                  <a href={`staff/${contact.key}`}><h4>{contact.firstName} {contact.lastName}</h4></a>
                  <div css={css.staffPosition({ theme })}>{contact.position}</div>
                  {contact.researchPursuits && <div>Research pursuits: {contact.researchPursuits}</div>}
                </div>
                <div css={css.staffContact({ theme })}>
                  <div>
                    {contact.email && <div>{contact.email}</div>}
                    {contact.phone && <div>{contact.phone}</div>}
                    {contact.fax && <div>{contact.fax}</div>}
                  </div>
                </div>
              </article>
            })}
          </div> */}
          
        </Route>
      </Switch>
    </div>
  </div>
};
