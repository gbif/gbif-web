import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { BudgetCommitteeTable } from './tabels/budgetCommittee';
import { ExecutiveCommitteeTable } from './tabels/executiveCommittee';
import { NodeManagersCommitteeTable } from './tabels/nodeManagersCommittee';
import { NodeSteeringGroupTable } from './tabels/nodeSterringGroup';
import { ScienceCommitteeTable } from './tabels/scienceCommittee';
import { FilterButtonGroup } from '@/components/filterButtonGroup';
import { useStringParam } from '@/hooks/useParam';
import { FormattedMessage, useIntl } from 'react-intl';
import { SecretariatTable } from './tabels/secretariatTable';
import { VotingParticipantsTable } from './tabels/votingParticipants';
import { AssociateCountryParticipantsTable } from './tabels/associateCountryParticipants';
import { AssociateParticipantsTable } from './tabels/associateParticipants';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { SearchInputPresentation } from '@/routes/omniSearch/SearchInput';
import { useState } from 'react';
import { DirectoryContactDialog } from './directoryContactDialog';

const GROUPS = [
  'voting',
  'associateCountries',
  'associateParticipants',
  'executiveCommittee',
  'scienceCommittee',
  'budgetCommittee',
  'nsg',
  'nodesCommittee',
  'secretariat',
];

const GROUP_OPTIONS = GROUPS.map((group) => ({
  key: group,
  label: <FormattedMessage id={`directory.group.${group}.title`} />,
}));

export function DirectoryTab() {
  const intl = useIntl();
  const [group = 'all', setGroup] = useStringParam({
    key: 'group',
    defaultValue: 'all',
    hideDefault: true,
  });

  const [q, setQ] = useState('');

  const [personId, setPersonId] = useStringParam({
    key: 'personId',
    defaultValue: '',
    hideDefault: true,
  });

  return (
    <ArticleContainer className="g-bg-slate-100">
      <DirectoryContactDialog personId={personId} onClose={() => setPersonId(undefined)} />

      <ArticleTextContainer>
        <div className="g-mb-4">
          <SearchInputPresentation
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={intl.formatMessage({ id: 'phrases.search' })}
          />
        </div>

        <FilterButtonGroup
          className="g-mb-8"
          options={GROUP_OPTIONS}
          selectedValue={group === 'all' ? null : group}
          onSelect={(val) => setGroup(val ?? 'all')}
          allLabel={<FormattedMessage id="phrases.all" />}
          clearLabel={<FormattedMessage id="phrases.clear" />}
          activeProps={{ variant: 'default' }}
          inactiveProps={{
            variant: 'plain',
            className: 'g-bg-slate-200 g-border g-border-slate-300',
          }}
          clearProps={{ variant: 'destructive' }}
        />

        <div className="g-space-y-8 g-pb-8">
          {/* Voting participants */}
          {(group === 'all' || group === 'voting') && (
            <VotingParticipantsTable q={q} onPersonClick={setPersonId} />
          )}

          {/* Associate country participants */}
          {(group === 'all' || group === 'associateCountries') && (
            <AssociateCountryParticipantsTable q={q} onPersonClick={setPersonId} />
          )}

          {/* Other associate participants */}
          {(group === 'all' || group === 'associateParticipants') && (
            <AssociateParticipantsTable q={q} onPersonClick={setPersonId} />
          )}

          {/* Executive committee */}
          {(group === 'all' || group === 'executiveCommittee') && (
            <ExecutiveCommitteeTable q={q} onPersonClick={setPersonId} />
          )}

          {/* Science committee */}
          {(group === 'all' || group === 'scienceCommittee') && (
            <ScienceCommitteeTable q={q} onPersonClick={setPersonId} />
          )}

          {/* Budget committee */}
          {(group === 'all' || group === 'budgetCommittee') && (
            <BudgetCommitteeTable q={q} onPersonClick={setPersonId} />
          )}

          {/* Node Steering Group */}
          {(group === 'all' || group === 'nsg') && (
            <NodeSteeringGroupTable q={q} onPersonClick={setPersonId} />
          )}

          {/* Node Managers Committee */}
          {(group === 'all' || group === 'nodesCommittee') && (
            <NodeManagersCommitteeTable q={q} onPersonClick={setPersonId} />
          )}

          {/* GBIF Secretariat */}
          {(group === 'all' || group === 'secretariat') && (
            <SecretariatTable q={q} onPersonClick={setPersonId} />
          )}
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
