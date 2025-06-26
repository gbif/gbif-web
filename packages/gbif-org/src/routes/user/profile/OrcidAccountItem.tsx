import React from 'react';
import { FaOrcid as SocialIconOrcid } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { ConnectedAccountItem } from './ConnectedAccountItem';

interface OrcidAccountItemProps {
  isConnected: boolean;
  orcidId?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isEditing: boolean;
}

export const OrcidAccountItem: React.FC<OrcidAccountItemProps> = ({
  isConnected,
  orcidId,
  onConnect,
  onDisconnect,
  isEditing,
}) => {
  const { formatMessage } = useIntl();

  const connectionText = orcidId
    ? formatMessage({ id: 'profile.connectedToOrcidId' }, { orcidId })
    : formatMessage({ id: 'profile.connectedToOrcid' });

  return (
    <ConnectedAccountItem
      provider="ORCID"
      icon={SocialIconOrcid}
      isConnected={isConnected}
      connectionText={connectionText}
      disconnectionText={formatMessage({ id: 'profile.connectOrcidForResearch' })}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      isEditing={isEditing}
    />
  );
};
