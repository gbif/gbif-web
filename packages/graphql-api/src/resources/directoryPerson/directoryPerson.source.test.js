/* eslint-env mocha */
import assert from 'assert';
import {
  reduceAmbassador,
  reduceAwardWinner,
  reduceDirectoryContact,
  reduceMentor,
  reducePersonRole,
  reduceTranslator,
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
  certifications: [{ key: 9, title: 'Cert', level: 'A', year: 2021, createdBy: 'staff@x' }],
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

  it('reduces translators to the shown fields', () => {
    assert.deepStrictEqual(reduceTranslator(fullPerson), {
      firstName: 'Ada',
      surname: 'Lovelace',
      countryCode: 'DK',
      orcidId: '0000-0001',
      languages: ['en'],
      certifications: [{ year: 2021 }],
    });
  });

  it('reduces ambassadors to the shown fields', () => {
    assert.deepStrictEqual(reduceAmbassador(fullPerson), {
      firstName: 'Ada',
      surname: 'Lovelace',
      email: 'ada@example.org',
      orcidId: '0000-0001',
      institutionName: 'Institute',
      countryCode: 'DK',
      areasExpertise: ['TAXONOMY'],
    });
  });

  it('reduces mentors to the shown fields', () => {
    assert.deepStrictEqual(reduceMentor(fullPerson), {
      firstName: 'Ada',
      surname: 'Lovelace',
      email: 'ada@example.org',
      countryCode: 'DK',
      areasExpertise: ['TAXONOMY'],
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
      roles: [
        { role: 'AWARD_WINNER', term: cleanTerm },
        { role: 'INVOICE_CONTACT', term: cleanTerm },
      ],
      participants: [{ participantId: 5 }],
    });
  });

  it('handles people without roles, terms or participants', () => {
    const contact = reduceDirectoryContact({ id: 2 });
    assert.deepStrictEqual(contact, { id: 2, roles: [], participants: [] });
    assert.deepStrictEqual(reduceAwardWinner({ roles: [{ role: 'AWARD_WINNER' }] }).roles, [
      { award: undefined, term: undefined },
    ]);
  });
});
