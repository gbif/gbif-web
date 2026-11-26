/* eslint-env mocha */
import assert from 'assert';
import {
  reduceAwardWinner,
  reduceDirectoryContact,
  reducePersonRole,
  reduceVolunteer,
  reduceVolunteerContact,
} from './directoryPerson.source';

const term = { start: '2020-01-01', end: '2022-01-01', createdBy: 'staff@x' };

const fullPerson = {
  id: 1,
  title: 'Dr',
  firstName: 'Ada',
  surname: 'Lovelace',
  orcidId: '0000-0001',
  jobTitle: 'Analyst',
  institutionName: 'Institute',
  email: 'ada@example.org',
  secondaryEmail: 'ada2@example.org',
  phone: '+45 1234',
  skype: 'ada',
  fax: '+45 5678',
  address: 'Street 1',
  countryCode: 'DK',
  languages: ['en'],
  areasExpertise: ['TAXONOMY'],
  dataExpertise: ['DATA_MOBILISATION'],
  thematicExpertise: ['MARINE'],
  badges: [{ key: 9, title: 'Cert', year: 2021, createdBy: 'staff@x', created: '2021-01-01' }],
  profileDescriptions: [{ description: 'bio', createdBy: 'staff@x', modifiedBy: 'staff@x' }],
  participants: [{ participantId: 5, name: 'internal' }],
  roles: [
    { role: 'AWARD_WINNER', award: 'GRA', term, programme: 'p' },
    { role: 'INVOICE_CONTACT', term },
    { role: 'NOT_A_GBIF_ROLE', term },
  ],
  created: '2020-01-01',
  createdBy: 'staff@x',
  modified: '2021-01-01',
  modifiedBy: 'staff@x',
};

const activeTerm = { start: '2020-01-01' };
const cleanTerm = { start: '2020-01-01', end: '2022-01-01' };

describe('directory person reducers', () => {
  it('keeps only list fields on role search entries', () => {
    assert.deepStrictEqual(
      reducePersonRole({
        relationshipId: 3,
        personId: 1,
        role: 'MENTOR',
        award: 'X',
        programme: 'p',
        term,
      }),
      { personId: 1, award: 'X', term: cleanTerm },
    );
  });

  it('reduces volunteers to the shown fields', () => {
    assert.deepStrictEqual(reduceVolunteer(fullPerson), {
      firstName: 'Ada',
      surname: 'Lovelace',
      email: 'ada@example.org',
      orcidId: '0000-0001',
      institutionName: 'Institute',
      countryCode: 'DK',
      languages: ['en'],
      badges: [{ title: 'Cert', year: 2021 }],
    });
  });

  it('reduces award winners to the shown fields and award roles', () => {
    assert.deepStrictEqual(reduceAwardWinner(fullPerson), {
      firstName: 'Ada',
      surname: 'Lovelace',
      countryCode: 'DK',
      orcidId: '0000-0001',
      roles: [{ award: 'GRA', term: cleanTerm }],
    });
  });

  it('reduces directory contacts to the dialog fields', () => {
    assert.deepStrictEqual(reduceDirectoryContact(fullPerson), {
      id: 1,
      firstName: 'Ada',
      surname: 'Lovelace',
      orcidId: '0000-0001',
      jobTitle: 'Analyst',
      institutionName: 'Institute',
      email: 'ada@example.org',
      phone: '+45 1234',
      address: 'Street 1',
      countryCode: 'DK',
      languages: ['en'],
      dataExpertise: ['DATA_MOBILISATION'],
      thematicExpertise: ['MARINE'],
      badges: [{ title: 'Cert', year: 2021 }],
      roles: [{ role: 'AWARD_WINNER', term: cleanTerm }],
      participants: [{ participantId: 5 }],
    });
  });

  it('limits the contact of volunteers to the fields of the volunteer policy', () => {
    const person = {
      ...fullPerson,
      roles: [
        { role: 'TRANSLATOR', term: activeTerm },
        { role: 'INVOICE_CONTACT', term },
        { role: 'MENTOR', term: activeTerm },
      ],
    };
    assert.deepStrictEqual(reduceVolunteerContact(person), {
      id: 1,
      firstName: 'Ada',
      surname: 'Lovelace',
      orcidId: '0000-0001',
      institutionName: 'Institute',
      email: 'ada@example.org',
      countryCode: 'DK',
      languages: ['en'],
      dataExpertise: ['DATA_MOBILISATION'],
      thematicExpertise: ['MARINE'],
      badges: [{ title: 'Cert', year: 2021 }],
      roles: [
        { role: 'TRANSLATOR', term: activeTerm },
        { role: 'MENTOR', term: activeTerm },
      ],
      participants: [],
      restricted: true,
    });
  });

  it('leaves ended volunteer roles out of the volunteer contact', () => {
    const roles = [
      { role: 'TRANSLATOR', term: { start: '2020-01-01' } },
      { role: 'AMBASSADOR', term: { start: '2010-01-01', end: '2012-01-01' } },
    ];
    assert.deepStrictEqual(
      reduceVolunteerContact({ id: 1, roles }).roles.map((r) => r.role),
      ['TRANSLATOR'],
    );
  });

  it('handles people without roles, terms or participants', () => {
    const contact = reduceDirectoryContact({ id: 2 });
    assert.deepStrictEqual(contact, { id: 2, badges: undefined, roles: [], participants: [] });
    assert.deepStrictEqual(reduceAwardWinner({ roles: [{ role: 'AWARD_WINNER' }] }).roles, [
      { award: undefined, term: undefined },
    ]);
  });
});
