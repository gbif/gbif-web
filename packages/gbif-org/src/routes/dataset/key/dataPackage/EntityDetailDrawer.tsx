import { Drawer } from '@/components/drawer/drawer';
import { useStringParam } from '@/hooks/useParam';
import GenericDetail from './GenericDetail';

interface EventDetailProps {
  id: string;
  resourceType: string;
}

function EventDetail({ id, resourceType }: EventDetailProps) {
  return (
    <div className="g-p-6">
      <h2 className="g-text-xl g-font-bold g-mb-4">Event Details</h2>
      <p className="g-text-gray-700">Event: {id}</p>
      <p className="g-text-sm g-text-gray-500 g-mt-2">Resource: {resourceType}</p>
    </div>
  );
}

export default function EntityDetailDrawer() {
  const [entity, setEntity] = useStringParam({ key: 'entity' });

  // Parse entity string (format: resourceName__id)
  const entityParts = entity ? entity.split('__') : null;
  const resourceType = entityParts?.[0];
  const entityId = entityParts?.[1];

  const isOpen = Boolean(entity && resourceType && entityId);

  const handleClose = () => {
    setEntity(undefined);
  };

  return (
    <Drawer
      isOpen={isOpen}
      close={handleClose}
      screenReaderTitle="Resource Entity Details"
      screenReaderDescription="Details about the selected resource entity"
    >
      {resourceType && entityId && (
        <>
          {resourceType === 'event' ? (
            // <EventDetail id={entityId} resourceType={resourceType} />
            <GenericDetail id={entityId} resourceType={resourceType} />
          ) : (
            <GenericDetail id={entityId} resourceType={resourceType} />
          )}
        </>
      )}
    </Drawer>
  );
}
