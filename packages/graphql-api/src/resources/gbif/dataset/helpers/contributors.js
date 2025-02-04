import {
  cloneDeep, get, intersection, isArray,
  isEmpty, isNil, remove, union, uniqWith
} from 'lodash';

/**
 * The same person can appear multiple times in the list of dataset contacts
 * OrcIds and mail address is considered primary identifiers. If no such is provided, people will be grouped based on their first and last name. And if no name, then on organization.
 * Downside: two different people with the same name, where neither have an email address or an userId (orcId) will appear as one (despite organisation could possible separate them).
 * @param contact
 */
function getContactIdentifiers(contact) {
  let identifiers = [];
  if (isArray(contact.userId)) {
    identifiers = identifiers.concat(contact.userId);
  }
  if (!isEmpty(contact.email)) {
    let emailIdentifier = contact.email;
    emailIdentifier += !isEmpty(contact.firstName) ? contact.firstName : '';
    emailIdentifier += !isEmpty(contact.lastName) ? contact.lastName : '';
    identifiers = identifiers.concat(emailIdentifier);
  }
  if (identifiers.length === 0) {
    if (contact.firstName && contact.lastName) {
      identifiers.push(`${contact.firstName} ${contact.lastName}`);
    } else if (contact.organization) {
      identifiers.push(contact.organization);
    }
  }

  return identifiers;
}

function hasDisplayName(contact) {
  return contact.firstName || contact.lastName || contact.organization;
}

/**
 * Remove contacts that have too little information to be useful. A contact is considered incomplete if there is no identification means (see function getContactIdentifiers)
 * @param contacts
 * @return {*}
 */
function removeContactsWithoutIdentifierOrName(contacts) {
  return contacts.filter((e) => {
    return getContactIdentifiers(e).length > 0 || hasDisplayName(e);
  });
}

/**
 * two contacts are the same if they share an identifier
 * @param a
 * @param b
 * @return {boolean}
 */
function isSameAuthor(a, b) {
  const identifierA = getContactIdentifiers(a);
  const identifierB = getContactIdentifiers(b);
  for (let i = 0; i < identifierA.length; i += 1) {
    if (identifierB.indexOf(identifierA[i]) > -1) {
      return true;
    }
  }
  return false;
}

/**
 * Currently a very careful extend without the risk of merging to persons too much. In case of a wrong match or scathered info across several entries, information will get lost.
 * Merging with oneself should not change anything
 * @param a
 * @param b
 * @return the extended contact (NOT a copy)
 */
function extendContact(_a, _b) {
  const a = _a;
  const b = _b;
  a.primary = a.primary || b.primary;
  if (!a.roles) {
    a.roles = a.type ? [a.type] : [];
  }
  a.roles = b.type ? union(a.roles, [b.type]) : a.roles;
  return a;
}

/**
 * get index of that contact in the list. compared using their identifiers
 * @param list
 * @param contact
 * @return {number}
 */
function indexInList(list, contact) {
  for (let i = 0; i < list.length; i += 1) {
    if (isSameAuthor(list[i], contact)) {
      return i;
    }
  }
  return -1;
}

/**
 * remove duplicates, considering the first apperance the primary if there is differences. the first apperance is extended using function extendContact()
 * @param contacts
 * @return {Array} new array withhout duplicates and contacts with insufficient info
 */
function getUniqueContacts(contacts) {
  if (!isArray(contacts)) {
    return [];
  }
  const trimmedContacts = removeContactsWithoutIdentifierOrName(contacts);
  const mergedContacts = [];

  trimmedContacts.forEach((e) => {
    const index = indexInList(mergedContacts, e);
    if (index > -1) {
      // merge
      extendContact(mergedContacts[index], e);
    } else {
      // add
      const cloned = cloneDeep(e);
      if (!cloned.roles) {
        cloned.roles = cloned.type ? [cloned.type] : [];
      }
      mergedContacts.push(cloned);
    }
  });
  return mergedContacts;
}

function cleanContacts(contacts) {
  // remove contacts with insuffient contact details
  let trimmedContacts = removeContactsWithoutIdentifierOrName(contacts);
  // assign IDs based on their identifiers
  const ids = [];
  trimmedContacts.forEach((e) => {
    const i = indexInList(ids, e);
    if (i === -1) {
      // new contact found - assign new ID
      e._id = ids.length;
      ids.push(e);
    } else {
      // that contact has been seen before. assign existing ID
      e._id = i;
    }
  });

  // remove duplicates (same person same role shouldn't appear twice)
  trimmedContacts = uniqWith(trimmedContacts, (a, b) => {
    return a.type === b.type && a._id === b._id;
  });

  return trimmedContacts;
}

function getRoleOrder(roles) {
  if (roles.indexOf('ORIGINATOR') !== -1) return 0;
  if (roles.indexOf('METADATA_AUTHOR') !== -1) return 1;
  if (roles.indexOf('ADMINISTRATIVE_POINT_OF_CONTACT') !== -1) return 3;
  return 2;
}

function getFirstWithEmail(contacts) {
  if (isArray(contacts)) {
    for (let i = 0; i < contacts.length; i += 1) {
      if (get(contacts[i], 'email.length', 0) > 0) {
        return contacts[i];
      }
    }
  }
  return false;
}

function getContributors(contacts) {
  if (!isArray(contacts)) {
    return [];
  }
  // remove empty values from address array - the API returns [null]
  contacts.forEach((contact) => {
    if (contact.address) {
      remove(contact.address, isNil);
    }
  });
  const trimmedContacts = cleanContacts(contacts);

  const personsOnly = trimmedContacts.filter((e) => {
    return e.firstName || e.lastName;
  });
  const originators = personsOnly.filter((e) => {
    return e.type === 'ORIGINATOR';
  });
  const administrativeContacts = personsOnly.filter((e) => {
    return (
      e.type === 'ADMINISTRATIVE_POINT_OF_CONTACT' &&
      indexInList(originators, e) === -1
    );
  });

  // get unique
  const uniqueContacts = getUniqueContacts(trimmedContacts);
  // sort based on role, then order the are delivered in
  uniqueContacts.sort((a, b) => {
    const x = getRoleOrder(a.roles) - getRoleOrder(b.roles);
    return x === 0 ? a._id - b._id : x;
  });

  // mark contacts that are to be highlighted in header
  uniqueContacts.forEach((e) => {
    if (!e.firstName && !e.lastName) {
      return;
    }
    e._person = true;
    if (
      intersection(e.roles, [
        'ORIGINATOR',
        'ADMINISTRATIVE_POINT_OF_CONTACT',
        'METADATA_AUTHOR',
      ]).length > 0
    ) {
      e._highlighted = true;
    }
  });

  // assign primary contact
  let primaryContact = getFirstWithEmail(administrativeContacts);

  if (!primaryContact) {
    primaryContact = getFirstWithEmail(uniqueContacts);
  } else {
    primaryContact = uniqueContacts.find((e) => {
      return isSameAuthor(e, primaryContact);
    });
  }
  if (primaryContact) {
    primaryContact._primaryContact = true;
    // primaryContact.roles.push('_PRIMARY_CONTACT');
  }

  return uniqueContacts;
}

export { getContributors, getContactIdentifiers };
