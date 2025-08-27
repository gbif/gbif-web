import {
  NodeContacts,
  NodeData,
  NodePublishers,
  ParticipantNodeDescription,
} from '@/routes/participant/key/about';
import { useNodeKeyLoaderData } from '.';

export function NodeKeyAbout() {
  const { data } = useNodeKeyLoaderData();
  const { node } = data;
  if (!node) throw new Error('Node data is not available');

  return (
    <div>
      <ParticipantNodeDescription participant={node.participant} node={node} />
      <NodeContacts node={node} />
      <NodePublishers nodeKey={node?.key} />
      <NodeData nodeKey={node?.key} />
    </div>
  );
}
