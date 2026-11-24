// TEMPORARY demo page for the volunteers list (gbif/gbif-web#2211). Remove before merging.
// Mock data stands in for the directory API, and the settings objects for the Contentful block settings.
import { Dialog } from '@/components/ui/dialog';
import { DirectoryVolunteersQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { DirectoryContactDialogView, PreparedData } from '../contact-us/directoryContactDialog';
import {
  VolunteersListSettings,
  VolunteersTable,
} from '@/routes/resource/key/composition/blocks/customComponents/volunteersList';
import { useState } from 'react';

type Person = NonNullable<
  NonNullable<DirectoryVolunteersQuery['directoryVolunteers']>['results'][number]
>;
const cert = (title: string, ...years: number[]) => years.map((year) => ({ title, year }));

const PEOPLE: Record<string, Person['Person'] & { institution: string }> = {
  '1': {
    firstName: 'Ana',
    surname: 'Souza',
    countryCode: 'BR',
    languages: ['pt', 'es', 'en'],
    institution: 'Museu Goeldi',
    certifications: cert('Translator', 2026, 2024, 2019),
  },
  '2': {
    firstName: 'Mikkel',
    surname: 'Jensen',
    countryCode: 'DK',
    languages: ['da', 'en'],
    institution: 'Natural History Museum of Denmark',
    certifications: cert('Translator', 2022, 2018),
  },
  '3': {
    firstName: 'Léa',
    surname: 'Martin',
    countryCode: 'FR',
    languages: ['fr'],
    institution: 'MNHN',
    certifications: [],
  },
  '4': {
    firstName: 'Wei',
    surname: 'Zhang',
    countryCode: 'CN',
    languages: ['zh', 'en'],
    institution: 'Chinese Academy of Sciences',
    certifications: [...cert('Translator', 2025), ...cert('Reviewer', 2025)],
  },
  '5': {
    firstName: 'Omar',
    surname: 'Haddad',
    countryCode: 'MA',
    languages: ['ar', 'fr'],
    institution: 'Université Mohammed V',
    certifications: cert('Translator', 2021, 2023),
  },
  '6': {
    firstName: 'Sofia',
    surname: 'Ríos',
    countryCode: 'CO',
    languages: ['es'],
    institution: 'Instituto Humboldt',
    certifications: [...cert('Mentor', 2025, 2023, 2020), ...cert('Trainer', 2022)],
  },
  '7': {
    firstName: 'Tom',
    surname: 'Becker',
    countryCode: 'DE',
    languages: ['de', 'en'],
    institution: 'Senckenberg',
    certifications: cert('Mentor', 2019),
  },
  '8': {
    firstName: 'Aiko',
    surname: 'Tanaka',
    countryCode: 'JP',
    languages: ['ja', 'en'],
    institution: 'NIES',
    certifications: cert('Trainer', 2026, 2025, 2024, 2021),
  },
  '9': {
    firstName: 'Kwame',
    surname: 'Mensah',
    countryCode: 'GH',
    languages: ['en'],
    institution: 'University of Ghana',
    certifications: cert('Trainer', 2020),
  },
  '10': {
    firstName: 'Elena',
    surname: 'Petrova',
    countryCode: 'RU',
    languages: ['ru', 'en'],
    institution: 'Moscow State University',
    certifications: [],
  },
  '11': {
    firstName: 'Priya',
    surname: 'Nair',
    countryCode: 'IN',
    languages: ['en'],
    institution: 'IISc',
    certifications: cert('Ambassador', 2024),
  },
  '12': {
    firstName: 'Lars',
    surname: 'Nilsson',
    countryCode: 'SE',
    languages: ['sv', 'en'],
    institution: 'Swedish Museum of Natural History',
    certifications: [],
  },
};

const result = (ids: string[]): DirectoryVolunteersQuery =>
  ({
    directoryVolunteers: {
      results: ids.map((id) => ({ personId: Number(id), Person: PEOPLE[id] })),
    },
  }) as DirectoryVolunteersQuery;

const SCENARIOS: {
  title: string;
  description: string;
  settings: VolunteersListSettings;
  ids: string[];
}[] = [
  {
    title: 'Translators',
    description: 'All with the role; badge years of type "Translator" from the last 5 years',
    settings: { role: 'TRANSLATOR', badgeType: 'Translator', badgeMaxAgeYears: 5 },
    ids: ['1', '2', '3', '4', '5'],
  },
  {
    title: 'Translators, only with a recent badge',
    description: 'Same, but onlyWithBadges hides people without a badge in the last 5 years',
    settings: {
      role: 'TRANSLATOR',
      badgeType: 'Translator',
      badgeMaxAgeYears: 5,
      onlyWithBadges: true,
    },
    ids: ['1', '2', '3', '4', '5'],
  },
  {
    title: 'Mentors',
    description: 'Badge type differs from the role title: "Mentor", no age limit',
    settings: { role: 'MENTOR', badgeType: 'Mentor' },
    ids: ['6', '7', '4'],
  },
  {
    title: 'Trainers',
    description: 'Badge type "Trainer", last 3 years, only with badges',
    settings: { role: 'TRAINER', badgeType: 'Trainer', badgeMaxAgeYears: 3, onlyWithBadges: true },
    ids: ['6', '8', '9'],
  },
  {
    title: 'Reviewers',
    description: 'No badgeType configured: the badge column stays empty',
    settings: { role: 'REVIEWER' },
    ids: ['4', '10', '12'],
  },
  {
    title: 'Ambassadors',
    description: 'Role only, plus a custom tablestyle',
    settings: {
      role: 'AMBASSADOR',
      badgeType: 'Ambassador',
      badgeMaxAgeYears: 5,
      tablestyle: '"maxWidth": "900px"',
    },
    ids: ['11', '12', '1'],
  },
];

function toPrepared(id: string): PreparedData {
  const p = PEOPLE[id]!;
  return {
    id,
    name: `${p.firstName} ${p.surname}`,
    institutionName: p.institution,
    email: `${p.firstName}.${p.surname}@example.org`.toLowerCase(),
    orcidId: `https://orcid.org/0000-0002-0000-${id.padStart(4, '0')}`,
    countryCode: p.countryCode ?? undefined,
    languages: (p.languages ?? []).filter((l): l is string => !!l),
    badges: (p.certifications ?? []).map((c) => ({
      title: c?.title ?? undefined,
      year: c?.year ?? undefined,
    })),
    roles: [{ role: 'TRANSLATOR', termStart: '2021-03-01' }],
  };
}

function VolunteersDemoPage() {
  const [personId, setPersonId] = useState<string | undefined>();
  return (
    <div className="g-bg-slate-100 g-min-h-screen g-py-8">
      <div className="g-max-w-6xl g-m-auto g-px-4">
        <h1 className="g-text-2xl g-font-bold">Volunteers list: demo (temporary)</h1>
        <p className="g-text-slate-600 g-mt-2">
          Mock data standing in for the directory API. Each block shows the Contentful settings
          used. Click a row for the popup.
        </p>
        {SCENARIOS.map((s) => (
          <section key={s.title} className="g-mt-10">
            <h2 className="g-text-lg g-font-semibold">{s.title}</h2>
            <p className="g-text-sm g-text-slate-600">{s.description}</p>
            <pre className="g-bg-slate-800 g-text-slate-100 g-text-xs g-p-3 g-rounded g-mt-2 g-overflow-auto">
              {`componentType: volunteersList\nsettings: ${JSON.stringify(s.settings, null, 2)}`}
            </pre>
            <VolunteersTable
              className="g-px-0"
              title={s.title}
              settings={s.settings}
              data={result(s.ids)}
              onSelectPerson={setPersonId}
            />
          </section>
        ))}
      </div>
      <Dialog open={!!personId} onOpenChange={(open) => !open && setPersonId(undefined)}>
        {personId && PEOPLE[personId] && (
          <DirectoryContactDialogView person={toPrepared(personId)} />
        )}
      </Dialog>
    </div>
  );
}

export const volunteersDemoRoute: RouteObjectWithPlugins = {
  id: 'volunteersDemo',
  path: 'volunteers-demo',
  element: <VolunteersDemoPage />,
};
