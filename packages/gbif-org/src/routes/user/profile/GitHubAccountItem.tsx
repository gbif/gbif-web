import React from 'react';
import { FaGithub as SocialIconGithub } from 'react-icons/fa';
import { ConnectedAccountItem } from './ConnectedAccountItem';
import { useIntl } from 'react-intl';

interface GitHubAccountItemProps {
  isConnected: boolean;
  githubUserName?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isEditing: boolean;
}

export const GitHubAccountItem: React.FC<GitHubAccountItemProps> = ({
  isConnected,
  githubUserName,
  onConnect,
  onDisconnect,
  isEditing,
}) => {
  const { formatMessage } = useIntl();
  
  const connectionText = githubUserName
    ? formatMessage({ id: 'profile.connectedToGithubUser' }, { username: githubUserName })
    : formatMessage({ id: 'profile.connectedToGithub' });

  return (
    <ConnectedAccountItem
      provider="GitHub"
      icon={SocialIconGithub}
      isConnected={isConnected}
      connectionText={connectionText}
      disconnectionText={formatMessage({ id: 'profile.connectGithubForSignIn' })}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      isEditing={isEditing}
    />
  );
};