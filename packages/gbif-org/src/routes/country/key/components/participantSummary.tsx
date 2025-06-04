import Properties, { Property } from '@/components/properties';
import { Button } from '@/components/ui/button';
import { ParticipantSummaryFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { notNull } from '@/utils/notNull';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaMastodon,
  FaPinterestP,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { FiInstagram } from 'react-icons/fi';
import { IoLogoVimeo } from 'react-icons/io5';
import { MdOutlineRssFeed } from 'react-icons/md';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

type Props = {
  participant: ParticipantSummaryFragment;
  className?: string;
  showSocialLinksSection?: boolean;
};

export function ParticipantSummary({ participant, className, showSocialLinksSection }: Props) {
  const headOfDelegation = participant.headOfDelegation?.[0];
  const participantNodeManager = participant.participantNodeManager?.[0];
  const rssFeed = participant.participant?.rssFeeds?.[0];
  const newsletter = participant.participant?.newsletters?.[0];
  const linksToSocialMedia = participant.participant?.linksToSocialMedia?.filter(notNull);

  return (
    <div className={className}>
      <Properties className={'[&_a]:g-text-primary-500'}>
        <Property
          labelId="participant.memberStatus"
          value={participant.participationStatus}
          formatter={(value) => (
            <FormattedMessage id={`enums.participationStatus.${value}`} defaultMessage={value} />
          )}
        />
        <Property
          labelId="participant.gbifParticipantSince"
          value={participant.participant?.membershipStart}
          formatter={(v) => <FormattedDate value={v} year="numeric" />}
        />
        <Property
          labelId="participant.gbifRegion"
          value={participant.gbifRegion}
          formatter={(v) => <FormattedMessage id={`enums.region.${v}`} defaultMessage={v} />}
        />
        {headOfDelegation && (
          <Property
            labelId="participant.headOfDelegation"
            value={`${headOfDelegation.firstName} ${headOfDelegation.lastName}`}
            formatter={(v) => <Link to={`#contact${headOfDelegation.key}`}>{v}</Link>}
          />
        )}
        <Property
          labelId="participant.nodeName"
          value={participant.title}
          formatter={(v) => <Link to={`#nodeAddress`}>{v}</Link>}
        />
        <Property
          labelId="participant.nodeEstablished"
          value={participant.participant?.nodeEstablishmentDate}
          formatter={(v) => <FormattedDate value={v} year="numeric" />}
        />
        {/* TODO: Why is this not the same as portal16? */}
        <Property
          labelId="participant.website"
          value={participant.homepage}
          formatter={(v) => <a href={v}>{v}</a>}
        />
        {participantNodeManager && (
          <Property
            labelId="participant.participantNodeManager"
            value={`${participantNodeManager.firstName} ${participantNodeManager.lastName}`}
            formatter={(v) => <Link to={`#contact${participantNodeManager.key}`}>{v}</Link>}
          />
        )}
      </Properties>
      {showSocialLinksSection && (rssFeed || newsletter || linksToSocialMedia?.length) && (
        <div className="g-flex g-gap-2 g-pt-6 g-flex-wrap">
          {linksToSocialMedia?.map((link) => (
            <SocialLink
              url={link.url}
              label={link.label}
              Icon={getSocialMediaIcon(link.url)}
              key={link.url}
            />
          ))}
          {rssFeed && (
            <SocialLink url={rssFeed.url} label={rssFeed.label} Icon={MdOutlineRssFeed} />
          )}
          {newsletter && <SocialLink url={newsletter.url} label={newsletter.label} />}
        </div>
      )}
    </div>
  );
}

fragmentManager.register(/* GraphQL */ `
  fragment ParticipantSummary on Node {
    title
    gbifRegion
    homepage
    participationStatus
    participant {
      membershipStart
      nodeEstablishmentDate
      participantUrl
      rssFeeds {
        label
        url
      }
      newsletters {
        label
        url
      }
      linksToSocialMedia {
        label
        url
      }
    }
    headOfDelegation: contacts(type: "HEAD_OF_DELEGATION") {
      key
      firstName
      lastName
    }
    participantNodeManager: contacts(type: "NODE_MANAGER") {
      key
      firstName
      lastName
    }
  }
`);

type SocialLinkProps = {
  url: string;
  label: string;
  Icon?: React.ElementType;
};

function SocialLink({ url, label, Icon }: SocialLinkProps) {
  return (
    <Button
      asChild
      variant="secondary"
      className="g-flex g-items-center g-gap-2 g-whitespace-nowrap"
    >
      <a href={url}>
        {Icon && <Icon />}
        {label}
      </a>
    </Button>
  );
}

const getSocialMediaIcon = (url: string) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('facebook.com')) return FaFacebookF;
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return FaTwitter;
  if (lowerUrl.includes('linkedin.com')) return FaLinkedinIn;
  if (lowerUrl.includes('youtube.com')) return FaYoutube;
  if (lowerUrl.includes('vimeo.com')) return IoLogoVimeo;
  if (lowerUrl.includes('instagram.com')) return FiInstagram;
  if (lowerUrl.includes('mastodon') || lowerUrl.includes('biodiversity.social')) return FaMastodon;
  if (lowerUrl.includes('pinterest.com')) return FaPinterestP;
  return;
};
