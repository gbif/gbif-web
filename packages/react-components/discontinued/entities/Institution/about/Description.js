
import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import { useLocalStorage } from 'react-use';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Properties, Property, ResourceLink, ListItem, Image, HyperText, Prose, OptImage, Tooltip } from "../../../components";
import { Card, CardHeader2, GrSciCollMetadata as Metadata, SideBarLoader } from '../../shared';
import { TopTaxa, TopCountries } from '../../shared/stats';
import sortBy from 'lodash/sortBy';
import { MdMailOutline as MailIcon, MdInfo, MdPhone as PhoneIcon } from 'react-icons/md';
import { Quality } from './stats';
import useBelow from '../../../utils/useBelow';
import { ApiContext } from '../../../dataManagement/api';
import LocaleContext from '../../../dataManagement/LocaleProvider/LocaleContext';
import { commonLabels, config2labels } from '../../../utils/labelMaker';

const { Term: T, Value: V, EmptyValue } = Properties;
const Name2Avatar = ListItem.Name2Avatar;

export function Description({
  data = {},
  loading,
  error,
  institution,
  occurrenceSearch,
  className,
  useInlineImage,
  ...props
}) {
  const apiClient = useContext(ApiContext);
  const localeContext = useContext(LocaleContext);
  const labelMap = config2labels(commonLabels, apiClient, localeContext);
  const InstitutionalGovernanceLabel = labelMap['institutionalGovernanceVocabulary'];
  const DisciplinesLabel = labelMap['disciplineVocabulary'];
  const InstitutionTypeVocabulary = labelMap['institutionTypeVocabulary'];

  const [isPinned, setPinState, removePinState] = useLocalStorage('pin_metadata', false);
  const hideSideBar = useBelow(1100);
  const addressesIdentical = JSON.stringify(institution.mailingAddress) === JSON.stringify(institution.address);
  return <div>
    {isPinned && <Metadata entity={institution} isPinned setPinState={() => setPinState(false)} />}
    <div css={css`padding-bottom: 100px; display: flex; margin: 0 -12px;`}>
      <div css={css`flex: 1 1 auto; margin: 0 12px;`}>
        {useInlineImage && institution.featuredImageUrl && <Card style={{ marginTop: 12, marginBottom: 24 }} noPadding>
          <FeaturedImageContent featuredImageLicense={institution.featuredImageLicense} featuredImageUrl={institution.featuredImageUrl} />
        </Card>
        }
        <Card style={{ marginTop: 12, marginBottom: 24 }}>
          <CardHeader2><FormattedMessage id="grscicoll.description" deafultMessage="Description" /></CardHeader2>
          <Prose style={{ marginBottom: 24, maxWidth: '60em', fontSize: '16px' }}>
            {institution.description && <HyperText text={institution.description} sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'h3', 'li', 'ul', 'ol'] }} />}
            {!institution.description && <EmptyValue />}
          </Prose>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            <Property value={institution.code} labelId="grscicoll.code" showEmpty />
            <Property value={institution.numberSpecimens} labelId="institution.numberSpecimens" />
            {occurrenceSearch?.documents?.total > 0 && <Property value={occurrenceSearch?.documents?.total} labelId="grscicoll.specimensViaGbif" formatter={count => {
              return <ResourceLink type="institutionKeySpecimens" id={institution.key}>
                <FormattedNumber value={count} />
              </ResourceLink>
            }} />}
            <Property value={institution.catalogUrls} labelId="grscicoll.catalogUrl" />
            <Property value={institution.apiUrls} labelId="grscicoll.apiUrl" />
            <Property value={institution.disciplines} labelId="institution.disciplines" showEmpty formatter={(val) => <DisciplinesLabel id={val} />} />
            {institution.foundingDate && <Property labelId="grscicoll.foundingDate">
              {institution.foundingDate}
            </Property>}
            {institution.type && <Property labelId="institution.type">
              <FormattedMessage id={`enums.institutionType.${institution.type}`} defaultMessage={institution.type} />
            </Property>}
            <Property value={institution.types} labelId="institution.type" formatter={(val) => <InstitutionTypeVocabulary id={val} />} />
            <Property value={institution.institutionalGovernances} labelId="institution.institutionalGovernance" formatter={(val) => <InstitutionalGovernanceLabel id={val} />} />
          </Properties>
        </Card>

        <Card style={{ marginTop: 24, marginBottom: 24 }}>
          <CardHeader2><FormattedMessage id="grscicoll.contacts" deafultMessage="Contacts" /></CardHeader2>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            <Property value={institution?.email} labelId="grscicoll.email" />
            <Property value={institution?.homepage} labelId="grscicoll.homepage" />
            <Property value={institution?.address?.country} labelId="grscicoll.country" showEmpty formatter={countryCode => <FormattedMessage id={`enums.countryCode.${countryCode}`} />} />
            <Property value={institution?.address?.province} labelId="grscicoll.province" />
            <Property value={institution?.address?.city} labelId="grscicoll.city" />
            <Property value={institution?.address?.postalCode} labelId="grscicoll.postalCode" />
            <Property value={institution?.address?.address} labelId="grscicoll.address" />
            {!addressesIdentical && <>
              <T><FormattedMessage id="grscicoll.mailingAddress" /></T>
              <V>
                <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
                  <Property value={institution?.mailingAddress?.country} labelId="grscicoll.country" showEmpty formatter={countryCode => <FormattedMessage id={`enums.countryCode.${countryCode}`} />} />
                  <Property value={institution?.mailingAddress?.province} labelId="grscicoll.province" />
                  <Property value={institution?.mailingAddress?.city} labelId="grscicoll.city" />
                  <Property value={institution?.mailingAddress?.postalCode} labelId="grscicoll.postalCode" />
                  <Property value={institution?.mailingAddress?.address} labelId="grscicoll.address" />
                </Properties>
              </V>
            </>}
            <Property value={institution?.logoUrl} labelId="grscicoll.logoUrl" formatter={logoUrl => <Image src={logoUrl} h={120} style={{ maxWidth: '100%' }} />} />
          </Properties>
          {institution?.contactPersons?.length > 0 && <div css={css`
            display: flex;
            flex-wrap: wrap;
            padding-top: 24px;
            border-top: 1px solid #eee;
            margin-top: 24px;
            > div {
              flex: 1 1 auto;
              width: 40%;
              max-width: 400px;
              min-width: 300px;
              margin: 12px;
            }
          `}>
            {sortBy(institution.contactPersons, 'position').map(contact => {
              let actions = [];
              if (contact.email?.[0]) actions.push(<a href={`mailto:${contact.email?.[0]}`}><MailIcon />{contact.email?.[0]}</a>);
              if (contact.phone?.[0]) actions.push(<a href={`tel:${contact.phone?.[0]}`}><PhoneIcon />{contact.phone?.[0]}</a>);
              return <ListItem
                key={contact.key}
                isCard
                firstName={contact.firstName}
                lastName={contact.lastName}
                avatar={<Name2Avatar first={contact.firstName} last={contact.lastName} />}
                description={contact.position?.[0]}
                footerActions={actions}>
                {contact.researchPursuits}
              </ListItem>
            })}
          </div>}
        </Card>

        <Card style={{ marginTop: 24, marginBottom: 24 }}>
          <CardHeader2><FormattedMessage id="grscicoll.identifiers" deafultMessage="Identifiers" /></CardHeader2>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            <Property value={institution.code} labelId="grscicoll.code" showEmpty />
            {institution?.alternativeCodes?.length > 0 && <Property value={institution.alternativeCodes} labelId="grscicoll.alternativeCodes">
              <ul css={css`padding: 0; margin: 0; list-style: none;`}>
                {institution.alternativeCodes.map((x, i) => {
                  return <li key={`${i}_${x.code}`} css={css`margin-bottom: 8px;`}>
                    <div>{x.code}</div>
                    <div css={css`color: var(--color400);`}>{x.description}</div>
                  </li>
                })}
              </ul>
            </Property>}
            <Property value={institution.additionalNames} labelId="grscicoll.additionalNames" />
            {institution?.identifiers?.length > 0 && <Property value={institution.identifiers} labelId="grscicoll.identifiers">
              <ul css={css`padding: 0; margin: 0; list-style: none;`}>
                {institution.identifiers.map((x, i) => {
                  let identifier = x.identifier;
                  if (x.type === 'ROR') {
                    identifier = x.identifier;
                  } else if (x.type === 'GRID') {
                    identifier = 'https://grid.ac/institutes/' + x.identifier; // GRID doesn't exists anymore. They left the space and refer to ROR as checked today September 2022
                  } else if (x.type === 'IH_IRN') {
                    identifier = 'http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=' + x.identifier.substr(12);
                  }

                  return <li key={`${i}_${x.identifier}`} css={css`margin-bottom: 8px;`}>
                    <div css={css`color: var(--color400); font-size: 0.9em;`}><FormattedMessage id={`enums.identifierType.${x.type}`} defaultMessage={x.type} /></div>
                    <div><HyperText text={identifier} inline /></div>
                  </li>
                })}
              </ul>
            </Property>}
          </Properties>
        </Card>

        {!isPinned && <Metadata entity={institution} setPinState={() => setPinState(true)} />}
      </div>
      {!hideSideBar && occurrenceSearch?.documents?.total > 0 && <aside css={css`flex: 0 0 280px; margin: 12px;`}>
        {loading && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <SideBarLoader />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <Quality predicate={{
            type: "equals",
            key: "institutionKey",
            value: institution.key
          }} institution={institution} totalOccurrences={occurrenceSearch?.documents?.total} />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <TopTaxa predicate={{
            type: "equals",
            key: "institutionKey",
            value: institution.key
          }} />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <TopCountries predicate={{
            type: "equals",
            key: "institutionKey",
            value: institution.key
          }} />
        </Card>}
      </aside>}
    </div>
  </div>
};

export function FeaturedImageContent({ featuredImageLicense, featuredImageUrl }) {
  if (!featuredImageUrl) return null;

  return <div style={{ position: 'relative' }}>
    <Image src={featuredImageUrl} w={1000} h={667} style={{ width: '100%', display: 'block' }} />
    {featuredImageLicense && <div css={css`position: absolute; bottom: 0; left: 0; padding: 3px 5px; background: '#444'; color: white;`}>
      <Tooltip title={<div><FormattedMessage id="phrases.license" />: <FormattedMessage id={`enums.license.${featuredImageLicense}`} /></div>}><span><MdInfo /></span></Tooltip>
    </div>}
  </div>
}