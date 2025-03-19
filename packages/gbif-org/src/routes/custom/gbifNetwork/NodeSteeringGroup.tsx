import { GbifNetworkParticipantsQuery } from '@/gql/graphql';

export default function NodeSteeringGroup({
  listData,
}: {
  listData: GbifNetworkParticipantsQuery;
}) {
  const committeeMembers = listData.nodeSteeringGroup;
  if (!committeeMembers) {
    return null;
  }

  return (
    <table className="g-w-full">
      <thead>
        <th className="g-text-left">Role</th>
        <th className="g-text-left">Name</th>
        <th className="g-text-left">Participant</th>
        {/* <th>Contact</th> */}
      </thead>
      <tbody>
        {committeeMembers.map((member, i) => (
          <tr key={`${member?.name}${i}`}>
            <td>
              <div className="g-text-gray-900">
                {member.role
                  .split('_')
                  .slice(2)
                  .join(' ')
                  .toLowerCase()
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </div>
            </td>
            <td className="">
              <div>
                <a href={`mailto:${member.email}`}>
                  {member.title} {member.name}
                </a>
                {/* <div className="g-text-gray-500 g-text-xs">
                  {member.contact?.participants[0]?.name}
                </div>
                <div className="g-text-gray-900">{member.email}</div> */}
              </div>
            </td>
            <td>
              <div>{member.contact?.participants[0]?.name ?? member.institutionName}</div>
            </td>
            {/* <td>
              <div>
                <div className="g-text-gray-900">{member.email}</div>
              </div>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
