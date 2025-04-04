import config from '#/config';
import { createSignedGetHeader } from '../auth/authenticatedGet';
import { normalizeString } from './countrySearch';
import { OMNI_SEARCH_TIMEOUT } from './omniSearch';

export type Participant = {
  id: string;
  participationStatus: string;
  participantUrl: string;
  type: string;
  countryCode: string;
  name: string;
  membershipStart: string;
};

let participants: Participant[];

function reduceResults(results: Participant[]) {
  return results.map((x: Participant) => ({
    id: x.id,
    participationStatus: x.participationStatus,
    participantUrl: x.participantUrl, // nor provided by search api
    type: x.type,
    countryCode: x.countryCode,
    name: x.name,
    membershipStart: x.membershipStart,
  }));
}

export async function getParticipants() {
  if (participants) return participants;

  const header = createSignedGetHeader('/directory/participant', config);
  const data = await fetch(`${config.apiv1}/directory/participant?limit=1000`, {
    headers: header,
  }).then((res) => res.json());

  participants = reduceResults(data.results);
  return participants as Participant[];
}

export async function getParticipantByIso(iso: string) {
  const participantResults = await getParticipants();
  const participant = participantResults.find(
    (p) => p.countryCode === iso && p.type === 'COUNTRY',
  );
  if (participant) {
    return participant;
  }
  return undefined;
}

type ResponseType = {
  highlighted?: Participant;
  other?: Participant[];
};

export async function searchParticipants(str: string): Promise<ResponseType> {
  const header = createSignedGetHeader('/directory/participant', config);
  const controller = new AbortController();
  const { signal } = controller;
  setTimeout(() => controller.abort(), OMNI_SEARCH_TIMEOUT);

  const participantResults: Participant[] = await fetch(
    `${config.apiv1}/directory/participant?limit=3&q=${str}`,
    {
      headers: header,
      signal,
    },
  )
    .then((res) => res.json())
    .then((data) => {
      return reduceResults(data.results);
    });

  // remove any with type FORMER
  const filtered = participantResults
    .filter((p) => p.participationStatus !== 'FORMER')
    // only include with type OTHER
    .filter((p) => p.type === 'OTHER');

  if (filtered.length > 0) {
    // if perfect match or query string > 12 characters then accept it as well. no matter how long
    if (str.length >= 12) {
      return {
        highlighted: filtered[0],
      };
    }
    const qNorm = normalizeString(str);
    const match = filtered.find((s) => {
      if (normalizeString(s.name) === qNorm) {
        return true;
      }
      return false;
    });
    if (match) {
      return {
        highlighted: match,
      };
    }
    return {
      other: filtered.slice(0, 2),
    };
  }
  return { highlighted: undefined, other: undefined };
}
