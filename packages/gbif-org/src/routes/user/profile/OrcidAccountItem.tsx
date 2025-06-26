import React from 'react';
import { FaOrcid as SocialIconOrcid } from 'react-icons/fa';
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
  const connectionText = orcidId
    ? `Connected to ORCID ${orcidId}`
    : 'Connected to your ORCID account';

  return (
    <ConnectedAccountItem
      provider="ORCID"
      icon={SocialIconOrcid}
      isConnected={isConnected}
      connectionText={connectionText}
      disconnectionText="Connect your ORCID for research identification"
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      isEditing={isEditing}
    />
  );
};
