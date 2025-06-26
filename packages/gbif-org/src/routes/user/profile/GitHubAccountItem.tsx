import React from 'react';
import { FaGithub as SocialIconGithub } from 'react-icons/fa';
import { ConnectedAccountItem } from './ConnectedAccountItem';

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
  const connectionText = githubUserName
    ? `Connected to ${githubUserName}`
    : 'Connected to your GitHub account';

  return (
    <ConnectedAccountItem
      provider="GitHub"
      icon={SocialIconGithub}
      isConnected={isConnected}
      connectionText={connectionText}
      disconnectionText="Connect your GitHub account for easy sign-in"
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      isEditing={isEditing}
    />
  );
};
