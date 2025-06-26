import React from 'react';
import { FaGoogle as SocialIconGoogle } from 'react-icons/fa';
import { ConnectedAccountItem } from './ConnectedAccountItem';

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
  return (
    <ConnectedAccountItem
      provider="Google"
      icon={SocialIconGoogle}
      isConnected={isConnected}
      connectionText="Connected to your Google account"
      disconnectionText="Connect your Google account for easy sign-in"
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      isEditing={isEditing}
    />
  );
};