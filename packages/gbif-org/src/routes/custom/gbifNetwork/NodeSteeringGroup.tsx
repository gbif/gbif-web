import { GbifNetworkParticipantsQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';

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
        <th className="g-text-left">
          <FormattedMessage id="gbifNetwork.role" />
        </th>
        <th className="g-text-left">
          <FormattedMessage id="gbifNetwork.name" />
        </th>
        <th className="g-text-left">
          <FormattedMessage id="gbifNetwork.participant" />
        </th>
        {/* <th>Contact</th> */}
      </thead>
      <tbody>
        {committeeMembers.map((member, i) => (
          <tr key={`${member?.name}${i}`}>
            <td>
              <div className="g-text-gray-900">
                <FormattedMessage id={`enums.gbifRole.${member.role}`} />
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
