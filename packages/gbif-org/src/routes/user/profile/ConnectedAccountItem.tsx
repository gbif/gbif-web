import { Button } from '@/components/ui/button';
import React from 'react';
import { MdLink as Link, MdLinkOff as Unlink } from 'react-icons/md';
import { useIntl } from 'react-intl';

interface ConnectedAccountItemProps {
  provider: string;
  icon: React.ComponentType<{ className?: string }>;
  isConnected: boolean;
  connectionText: string;
  disconnectionText: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isEditing: boolean;
  buttonStyle?: string;
}

export const ConnectedAccountItem: React.FC<ConnectedAccountItemProps> = ({
  provider,
  icon: Icon,
  isConnected,
  connectionText,
  disconnectionText,
  onConnect,
  onDisconnect,
  isEditing,
}) => {
  const { formatMessage } = useIntl();
  return (
    <div className="g-flex g-items-center g-justify-between g-p-4 g-space-x-2 g-border g-border-gray-200 g-rounded-lg">
      <div className="g-flex g-items-center g-space-x-3">
        <div className="g-w-10 g-h-10 g-bg-gray-50 g-rounded-lg g-flex g-items-center g-justify-center">
          <Icon className="g-w-5 g-h-5 g-text-gray-700" />
        </div>
        <div>
          <h4 className="g-font-medium g-text-gray-900">{provider}</h4>
          <p className="g-text-sm g-text-gray-500">
            {isConnected ? connectionText : disconnectionText}
          </p>
        </div>
      </div>
      <div>
        {isConnected ? (
          <div className="g-flex g-items-center g-space-x-2">
            {isEditing && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDisconnect}
                className="g-flex g-items-center g-space-x-2 g-whitespace-nowrap"
              >
                <Unlink className="g-w-4 g-h-4" />
                <span>{formatMessage({ id: 'profile.connect.disconnect' })}</span>
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={onConnect}
            className={`g-flex g-items-center g-space-x-2 g-whitespace-nowrap`}
          >
            <Link className="g-w-4 g-h-4" />
            <span>{formatMessage({ id: 'profile.connect.connect' })}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
