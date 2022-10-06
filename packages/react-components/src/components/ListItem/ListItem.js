import { jsx, css } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';
import { FaUserAlt } from 'react-icons/fa';
import { FormattedMessage } from 'react-intl';

export function ListItem({
  as: Div = 'div',
  avatar,
  title,
  firstName,
  lastName,
  description,
  content,
  footerActions,
  children,
  className,
  isCard,
  ...props
}) {
  let cardTitle;
  if (title) {
    cardTitle = title;
  } else if (firstName) {
    cardTitle = firstName;
    if (lastName) cardTitle += ` ${lastName}`;
  }
  const { classNames } = getClasses('gbif', 'listItem', {/*modifiers goes here*/ }, className);
  return <Div css={isCard ? styles.listItemCard : styles.listItem} {...classNames} {...props}>
    <div css={styles.header}>
      {avatar && <div css={styles.avatar}>{avatar}</div>}
      <div css={styles.titleWrapper}>
        <h4 css={styles.headline}>{cardTitle || <FormattedMessage id="phrases.unknown" defaultMessage="Uknown" />}</h4>
        {description && <div css={styles.description}>{description}</div>}
      </div>
    </div>
    <div css={css`margin-bottom: 8px;`}>
      {content && <div css={styles.content}>{content}</div>}
      {children}
    </div>
    {footerActions && <div css={styles.footerActions}>{footerActions.map((action, i) => <div key={i} css={styles.action}>{action}</div>)}</div>}
  </Div>
};

ListItem.propTypes = {
  as: PropTypes.element
};

export function IconAvatar(props) {
  return <div css={styles.nameAvatar} {...props}><FaUserAlt /></div>
};

function Name2Avatar({first, last, ...props}) {
  if (typeof first !== 'string') return <IconAvatar {...props}/>
  if (first === '') return <IconAvatar {...props}/>
  const firstLetter = first[0];
  const firstCode = firstLetter.charCodeAt();
  if (firstCode > 250) return <IconAvatar {...props}/>;

  let secondLetter;
  if (typeof last === 'string' && last.length > 0) secondLetter = last[0];
  if (secondLetter) {
    const secondCode = secondLetter.charCodeAt();
    if (secondCode > 250) return <IconAvatar {...props}/>;
  }

  return <div css={styles.nameAvatar} {...props}>{firstLetter}{secondLetter}</div>
}
Name2Avatar.propTypes = {
  first: PropTypes.string,
  last: PropTypes.string,
};

ListItem.Name2Avatar = Name2Avatar;