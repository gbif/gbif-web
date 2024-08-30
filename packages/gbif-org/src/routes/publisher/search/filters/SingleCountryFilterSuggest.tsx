import { SearchSuggest } from './searchSuggest';
import useFetchGet from '@/hooks/useFetchGet';
import React, { useState } from 'react';
import { FilterButton } from './filterButton';

export type CountryOption = {
  key: string;
  title: string;
};

type Props = {
  selected?: CountryOption | null;
  setSelected(value: CountryOption | null | undefined): void;
  noSelectionPlaceholder?: React.ReactNode;
  className?: string;
};

export function SingleCountryFilterSuggest({
  selected,
  setSelected,
  noSelectionPlaceholder,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { load, data: results } = useFetchGet<Array<CountryOption>>({
    lazyLoad: true,
  });
  const [isInputHidden, setIsInputHidden] = useState(false);

  const handleClearClick = () => {
    setSelected(null);
    setIsInputHidden(false);
  };

  const handleSelection = (value: CountryOption) => {
    setSelected(value);
    setIsInputHidden(true);
  }

  const searchOrganizations = React.useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm);
      // load({
      //   // CORS issue and secondly shouldn't be loaded from here. Perhaps graphql or alternatively from the enum and translation file
      //   endpoint: `https://www.gbif.org/api/country/suggest.json?lang=en`,
      //   keepDataWhileLoading: true,
      // });
    },
    [load]
  );

  const filteredData =
    searchTerm !== ''
      ? dump?.filter((x) => x.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : dump;
  // map array to object with key: title
  const countryMap = dump.reduce((acc, cur) => {
    acc[cur.key] = cur.title;
    return acc;
  }, {});

  return <FilterButton
    onClear={handleClearClick}
    onOpen={() => {
      setIsInputHidden(false);
      setOpen(true);
    }}
    isInputHidden={isInputHidden}
    selectedLabel={<span>{countryMap[selected?.key]}</span>}
    className={className}
  >
    <SearchSuggest
      open={open}
      setOpen={setOpen}
      className={className}
      setSelected={handleSelection}
      selected={selected ? {key: selected?.key, title: countryMap[selected?.key]} : undefined}
      search={searchOrganizations}
      results={filteredData ?? []}
      labelSelector={(value) => value.title}
      keySelector={(value) => value.key}
      noSearchResultsPlaceholder={<span>No countries found</span>}
      noSelectionPlaceholder={noSelectionPlaceholder ?? <span>Country</span>}
      searchInputPlaceholder="Search countries..."
    />
  </FilterButton>;

  // return (
  //   <SearchSuggest
  //     className={className}
  //     setSelected={setSelected}
  //     selected={selected}
  //     search={searchOrganizations}
  //     results={filteredData ?? []}
  //     labelSelector={(value) => value.title}
  //     keySelector={(value) => value.key}
  //     noSearchResultsPlaceholder={<span>No countries found</span>}
  //     noSelectionPlaceholder={noSelectionPlaceholder ?? <span>Country</span>}
  //     searchInputPlaceholder="Search countries..."
  //   />
  // );
}

const dump = [
  {
    key: 'AF',
    title: 'Afghanistan',
  },
  {
    key: 'AX',
    title: 'Åland Islands',
  },
  {
    key: 'AL',
    title: 'Albania',
  },
  {
    key: 'DZ',
    title: 'Algeria',
  },
  {
    key: 'AS',
    title: 'American Samoa',
  },
  {
    key: 'AD',
    title: 'Andorra',
  },
  {
    key: 'AO',
    title: 'Angola',
  },
  {
    key: 'AI',
    title: 'Anguilla',
  },
  {
    key: 'AQ',
    title: 'Antarctica',
  },
  {
    key: 'AG',
    title: 'Antigua and Barbuda',
  },
  {
    key: 'AR',
    title: 'Argentina',
  },
  {
    key: 'AM',
    title: 'Armenia',
  },
  {
    key: 'AW',
    title: 'Aruba',
  },
  {
    key: 'AU',
    title: 'Australia',
  },
  {
    key: 'AT',
    title: 'Austria',
  },
  {
    key: 'AZ',
    title: 'Azerbaijan',
  },
  {
    key: 'BS',
    title: 'Bahamas',
  },
  {
    key: 'BH',
    title: 'Bahrain',
  },
  {
    key: 'BD',
    title: 'Bangladesh',
  },
  {
    key: 'BB',
    title: 'Barbados',
  },
  {
    key: 'BY',
    title: 'Belarus',
  },
  {
    key: 'BE',
    title: 'Belgium',
  },
  {
    key: 'BZ',
    title: 'Belize',
  },
  {
    key: 'BJ',
    title: 'Benin',
  },
  {
    key: 'BM',
    title: 'Bermuda',
  },
  {
    key: 'BT',
    title: 'Bhutan',
  },
  {
    key: 'BO',
    title: 'Bolivia (Plurinational State of)',
  },
  {
    key: 'BQ',
    title: 'Bonaire, Sint Eustatius and Saba',
  },
  {
    key: 'BA',
    title: 'Bosnia and Herzegovina',
  },
  {
    key: 'BW',
    title: 'Botswana',
  },
  {
    key: 'BV',
    title: 'Bouvet Island',
  },
  {
    key: 'BR',
    title: 'Brazil',
  },
  {
    key: 'IO',
    title: 'British Indian Ocean Territory',
  },
  {
    key: 'BN',
    title: 'Brunei Darussalam',
  },
  {
    key: 'BG',
    title: 'Bulgaria',
  },
  {
    key: 'BF',
    title: 'Burkina Faso',
  },
  {
    key: 'BI',
    title: 'Burundi',
  },
  {
    key: 'KH',
    title: 'Cambodia',
  },
  {
    key: 'CM',
    title: 'Cameroon',
  },
  {
    key: 'CA',
    title: 'Canada',
  },
  {
    key: 'CV',
    title: 'Cabo Verde',
  },
  {
    key: 'KY',
    title: 'Cayman Islands',
  },
  {
    key: 'CF',
    title: 'Central African Republic',
  },
  {
    key: 'TD',
    title: 'Chad',
  },
  {
    key: 'CL',
    title: 'Chile',
  },
  {
    key: 'CN',
    title: 'China',
  },
  {
    key: 'CX',
    title: 'Christmas Island',
  },
  {
    key: 'CC',
    title: 'Cocos (Keeling) Islands',
  },
  {
    key: 'CO',
    title: 'Colombia',
  },
  {
    key: 'KM',
    title: 'Comoros',
  },
  {
    key: 'CD',
    title: 'Congo, Democratic Republic of the',
  },
  {
    key: 'CG',
    title: 'Congo',
  },
  {
    key: 'CK',
    title: 'Cook Islands',
  },
  {
    key: 'CR',
    title: 'Costa Rica',
  },
  {
    key: 'CI',
    title: 'Côte d’Ivoire',
  },
  {
    key: 'HR',
    title: 'Croatia',
  },
  {
    key: 'CU',
    title: 'Cuba',
  },
  {
    key: 'CW',
    title: 'Curaçao',
  },
  {
    key: 'CY',
    title: 'Cyprus',
  },
  {
    key: 'CZ',
    title: 'Czechia',
  },
  {
    key: 'DK',
    title: 'Denmark',
  },
  {
    key: 'DJ',
    title: 'Djibouti',
  },
  {
    key: 'DM',
    title: 'Dominica',
  },
  {
    key: 'DO',
    title: 'Dominican Republic',
  },
  {
    key: 'EC',
    title: 'Ecuador',
  },
  {
    key: 'EG',
    title: 'Egypt',
  },
  {
    key: 'SV',
    title: 'El Salvador',
  },
  {
    key: 'GQ',
    title: 'Equatorial Guinea',
  },
  {
    key: 'ER',
    title: 'Eritrea',
  },
  {
    key: 'EE',
    title: 'Estonia',
  },
  {
    key: 'ET',
    title: 'Ethiopia',
  },
  {
    key: 'FK',
    title: 'Falkland Islands (Malvinas)',
  },
  {
    key: 'FO',
    title: 'Faroe Islands',
  },
  {
    key: 'FJ',
    title: 'Fiji',
  },
  {
    key: 'FI',
    title: 'Finland',
  },
  {
    key: 'FR',
    title: 'France',
  },
  {
    key: 'GF',
    title: 'French Guiana',
  },
  {
    key: 'PF',
    title: 'French Polynesia',
  },
  {
    key: 'TF',
    title: 'French Southern Territories',
  },
  {
    key: 'GA',
    title: 'Gabon',
  },
  {
    key: 'GM',
    title: 'Gambia',
  },
  {
    key: 'GE',
    title: 'Georgia',
  },
  {
    key: 'DE',
    title: 'Germany',
  },
  {
    key: 'GH',
    title: 'Ghana',
  },
  {
    key: 'GI',
    title: 'Gibraltar',
  },
  {
    key: 'GR',
    title: 'Greece',
  },
  {
    key: 'GL',
    title: 'Greenland',
  },
  {
    key: 'GD',
    title: 'Grenada',
  },
  {
    key: 'GP',
    title: 'Guadeloupe',
  },
  {
    key: 'GU',
    title: 'Guam',
  },
  {
    key: 'GT',
    title: 'Guatemala',
  },
  {
    key: 'GG',
    title: 'Guernsey',
  },
  {
    key: 'GN',
    title: 'Guinea',
  },
  {
    key: 'GW',
    title: 'Guinea-Bissau',
  },
  {
    key: 'GY',
    title: 'Guyana',
  },
  {
    key: 'HT',
    title: 'Haiti',
  },
  {
    key: 'HM',
    title: 'Heard Island and McDonald Islands',
  },
  {
    key: 'VA',
    title: 'Holy See',
  },
  {
    key: 'HN',
    title: 'Honduras',
  },
  {
    key: 'HK',
    title: 'Hong Kong',
  },
  {
    key: 'HU',
    title: 'Hungary',
  },
  {
    key: 'IS',
    title: 'Iceland',
  },
  {
    key: 'IN',
    title: 'India',
  },
  {
    key: 'ID',
    title: 'Indonesia',
  },
  {
    key: 'IR',
    title: 'Iran (Islamic Republic of)',
  },
  {
    key: 'IQ',
    title: 'Iraq',
  },
  {
    key: 'IE',
    title: 'Ireland',
  },
  {
    key: 'IM',
    title: 'Isle of Man',
  },
  {
    key: 'IL',
    title: 'Israel',
  },
  {
    key: 'IT',
    title: 'Italy',
  },
  {
    key: 'JM',
    title: 'Jamaica',
  },
  {
    key: 'JP',
    title: 'Japan',
  },
  {
    key: 'JE',
    title: 'Jersey',
  },
  {
    key: 'JO',
    title: 'Jordan',
  },
  {
    key: 'KZ',
    title: 'Kazakhstan',
  },
  {
    key: 'KE',
    title: 'Kenya',
  },
  {
    key: 'KI',
    title: 'Kiribati',
  },
  {
    key: 'KP',
    title: "Korea (the Democratic People's Republic of)",
  },
  {
    key: 'KR',
    title: 'Korea, Republic of',
  },
  {
    key: 'KW',
    title: 'Kuwait',
  },
  {
    key: 'KG',
    title: 'Kyrgyzstan',
  },
  {
    key: 'LA',
    title: 'Lao People’s Democratic Republic',
  },
  {
    key: 'LV',
    title: 'Latvia',
  },
  {
    key: 'LB',
    title: 'Lebanon',
  },
  {
    key: 'LS',
    title: 'Lesotho',
  },
  {
    key: 'LR',
    title: 'Liberia',
  },
  {
    key: 'LY',
    title: 'Libya',
  },
  {
    key: 'LI',
    title: 'Liechtenstein',
  },
  {
    key: 'LT',
    title: 'Lithuania',
  },
  {
    key: 'LU',
    title: 'Luxembourg',
  },
  {
    key: 'MO',
    title: 'Macao',
  },
  {
    key: 'MK',
    title: 'North Macedonia',
  },
  {
    key: 'MG',
    title: 'Madagascar',
  },
  {
    key: 'MW',
    title: 'Malawi',
  },
  {
    key: 'MY',
    title: 'Malaysia',
  },
  {
    key: 'MV',
    title: 'Maldives',
  },
  {
    key: 'ML',
    title: 'Mali',
  },
  {
    key: 'MT',
    title: 'Malta',
  },
  {
    key: 'MH',
    title: 'Marshall Islands',
  },
  {
    key: 'MQ',
    title: 'Martinique',
  },
  {
    key: 'MR',
    title: 'Mauritania',
  },
  {
    key: 'MU',
    title: 'Mauritius',
  },
  {
    key: 'YT',
    title: 'Mayotte',
  },
  {
    key: 'MX',
    title: 'Mexico',
  },
  {
    key: 'FM',
    title: 'Micronesia (Federated States of)',
  },
  {
    key: 'MD',
    title: 'Moldova, Republic of',
  },
  {
    key: 'MC',
    title: 'Monaco',
  },
  {
    key: 'MN',
    title: 'Mongolia',
  },
  {
    key: 'ME',
    title: 'Montenegro',
  },
  {
    key: 'MS',
    title: 'Montserrat',
  },
  {
    key: 'MA',
    title: 'Morocco',
  },
  {
    key: 'MZ',
    title: 'Mozambique',
  },
  {
    key: 'MM',
    title: 'Myanmar',
  },
  {
    key: 'NA',
    title: 'Namibia',
  },
  {
    key: 'NR',
    title: 'Nauru',
  },
  {
    key: 'NP',
    title: 'Nepal',
  },
  {
    key: 'NL',
    title: 'Netherlands (Kingdom of the)',
  },
  {
    key: 'NC',
    title: 'New Caledonia',
  },
  {
    key: 'NZ',
    title: 'New Zealand',
  },
  {
    key: 'NI',
    title: 'Nicaragua',
  },
  {
    key: 'NE',
    title: 'Niger',
  },
  {
    key: 'NG',
    title: 'Nigeria',
  },
  {
    key: 'NU',
    title: 'Niue',
  },
  {
    key: 'NF',
    title: 'Norfolk Island',
  },
  {
    key: 'MP',
    title: 'Northern Mariana Islands',
  },
  {
    key: 'NO',
    title: 'Norway',
  },
  {
    key: 'OM',
    title: 'Oman',
  },
  {
    key: 'PK',
    title: 'Pakistan',
  },
  {
    key: 'PW',
    title: 'Palau',
  },
  {
    key: 'PS',
    title: 'Palestine, State of',
  },
  {
    key: 'PA',
    title: 'Panama',
  },
  {
    key: 'PG',
    title: 'Papua New Guinea',
  },
  {
    key: 'PY',
    title: 'Paraguay',
  },
  {
    key: 'PE',
    title: 'Peru',
  },
  {
    key: 'PH',
    title: 'Philippines',
  },
  {
    key: 'PN',
    title: 'Pitcairn',
  },
  {
    key: 'PL',
    title: 'Poland',
  },
  {
    key: 'PT',
    title: 'Portugal',
  },
  {
    key: 'PR',
    title: 'Puerto Rico',
  },
  {
    key: 'QA',
    title: 'Qatar',
  },
  {
    key: 'RE',
    title: 'Réunion',
  },
  {
    key: 'RO',
    title: 'Romania',
  },
  {
    key: 'RU',
    title: 'Russian Federation',
  },
  {
    key: 'RW',
    title: 'Rwanda',
  },
  {
    key: 'BL',
    title: 'Saint Barthélemy',
  },
  {
    key: 'SH',
    title: 'Saint Helena, Ascension and Tristan da Cunha',
  },
  {
    key: 'KN',
    title: 'Saint Kitts and Nevis',
  },
  {
    key: 'LC',
    title: 'Saint Lucia',
  },
  {
    key: 'MF',
    title: 'Saint Martin (French part)',
  },
  {
    key: 'PM',
    title: 'Saint Pierre and Miquelon',
  },
  {
    key: 'VC',
    title: 'Saint Vincent and the Grenadines',
  },
  {
    key: 'WS',
    title: 'Samoa',
  },
  {
    key: 'SM',
    title: 'San Marino',
  },
  {
    key: 'ST',
    title: 'Sao Tome and Principe',
  },
  {
    key: 'SA',
    title: 'Saudi Arabia',
  },
  {
    key: 'SN',
    title: 'Senegal',
  },
  {
    key: 'RS',
    title: 'Serbia',
  },
  {
    key: 'SC',
    title: 'Seychelles',
  },
  {
    key: 'SL',
    title: 'Sierra Leone',
  },
  {
    key: 'SG',
    title: 'Singapore',
  },
  {
    key: 'SX',
    title: 'Sint Maarten (Dutch part)',
  },
  {
    key: 'SK',
    title: 'Slovakia',
  },
  {
    key: 'SI',
    title: 'Slovenia',
  },
  {
    key: 'SB',
    title: 'Solomon Islands',
  },
  {
    key: 'SO',
    title: 'Somalia',
  },
  {
    key: 'ZA',
    title: 'South Africa',
  },
  {
    key: 'GS',
    title: 'South Georgia and the South Sandwich Islands',
  },
  {
    key: 'SS',
    title: 'South Sudan',
  },
  {
    key: 'ES',
    title: 'Spain',
  },
  {
    key: 'LK',
    title: 'Sri Lanka',
  },
  {
    key: 'SD',
    title: 'Sudan',
  },
  {
    key: 'SR',
    title: 'Suriname',
  },
  {
    key: 'SJ',
    title: 'Svalbard and Jan Mayen',
  },
  {
    key: 'SZ',
    title: 'Eswatini',
  },
  {
    key: 'SE',
    title: 'Sweden',
  },
  {
    key: 'CH',
    title: 'Switzerland',
  },
  {
    key: 'SY',
    title: 'Syrian Arab Republic',
  },
  {
    key: 'TW',
    title: 'Chinese Taipei',
  },
  {
    key: 'TJ',
    title: 'Tajikistan',
  },
  {
    key: 'TZ',
    title: 'Tanzania, United Republic of',
  },
  {
    key: 'TH',
    title: 'Thailand',
  },
  {
    key: 'TL',
    title: 'Timor-Leste',
  },
  {
    key: 'TG',
    title: 'Togo',
  },
  {
    key: 'TK',
    title: 'Tokelau',
  },
  {
    key: 'TO',
    title: 'Tonga',
  },
  {
    key: 'TT',
    title: 'Trinidad and Tobago',
  },
  {
    key: 'TN',
    title: 'Tunisia',
  },
  {
    key: 'TR',
    title: 'Türkiye',
  },
  {
    key: 'TM',
    title: 'Turkmenistan',
  },
  {
    key: 'TC',
    title: 'Turks and Caicos Islands',
  },
  {
    key: 'TV',
    title: 'Tuvalu',
  },
  {
    key: 'UG',
    title: 'Uganda',
  },
  {
    key: 'UA',
    title: 'Ukraine',
  },
  {
    key: 'AE',
    title: 'United Arab Emirates',
  },
  {
    key: 'GB',
    title: 'United Kingdom of Great Britain and Northern Ireland',
  },
  {
    key: 'US',
    title: 'United States of America',
  },
  {
    key: 'UM',
    title: 'United States Minor Outlying Islands',
  },
  {
    key: 'UY',
    title: 'Uruguay',
  },
  {
    key: 'UZ',
    title: 'Uzbekistan',
  },
  {
    key: 'VU',
    title: 'Vanuatu',
  },
  {
    key: 'VE',
    title: 'Venezuela (Bolivarian Republic of)',
  },
  {
    key: 'VN',
    title: 'Viet Nam',
  },
  {
    key: 'VG',
    title: 'Virgin Islands (British)',
  },
  {
    key: 'VI',
    title: 'Virgin Islands (U.S.)',
  },
  {
    key: 'WF',
    title: 'Wallis and Futuna',
  },
  {
    key: 'EH',
    title: 'Western Sahara',
  },
  {
    key: 'YE',
    title: 'Yemen',
  },
  {
    key: 'ZM',
    title: 'Zambia',
  },
  {
    key: 'ZW',
    title: 'Zimbabwe',
  },
  {
    key: 'XK',
    title: 'Kosovo',
  },
  {
    key: 'XZ',
    title: 'International waters',
  },
  {
    key: 'ZZ',
    title: 'Unknown country',
  },
];
