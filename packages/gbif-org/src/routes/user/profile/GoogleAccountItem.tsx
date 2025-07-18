import React from 'react';
import { FaGoogle as SocialIconGoogle } from 'react-icons/fa';
import { ConnectedAccountItem } from './ConnectedAccountItem';
import { useIntl } from 'react-intl';

interface GoogleAccountItemProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  isEditing: boolean;
}

export const GoogleAccountItem: React.FC<GoogleAccountItemProps> = ({
  isConnected,
  onConnect,
  onDisconnect,
  isEditing,
}) => {
  const { formatMessage } = useIntl();
  
  return (
    <ConnectedAccountItem
      provider="Google"
      icon={SocialIconGoogle}
      isConnected={isConnected}
      connectionText={formatMessage({ id: 'profile.connectedToGoogle' })}
      disconnectionText={formatMessage({ id: 'profile.connectGoogleForSignIn' })}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      isEditing={isEditing}
    />
  );
};