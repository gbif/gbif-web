import Properties from '@/components/properties';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { OccurrenceMediaDetailsFragment, OccurrenceQuery, Term } from '@/gql/graphql';
import { truncateMiddle } from '@/utils/truncateString';
import { useEffect, useState } from 'react';
import { MdFileDownload } from 'react-icons/md';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FormattedMessage } from 'react-intl';
import { BasicField } from '../properties';

const supportedFormats = [
  'audio/ogg',
  'audio/x-wav',
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
  'audio/mp4',
] as const;

export function Media({
  occurrence,
  termMap,
  loading = false,
  error,
  className,
  updateToc = () => {},
  ...props
}: {
  occurrence: OccurrenceQuery['occurrence'];
  termMap: { [key: string]: Term };
  loading?: boolean;
  error?: any;
  updateToc: (id: string, visible: boolean) => void;
  className?: string;
}) {
  const sectionName = 'multimedia';
  const [visible, setVisible] = useState<boolean | undefined>();
  useEffect(() => {
    if (typeof visible === 'boolean') updateToc(sectionName, visible);
  }, [visible]);

  if (loading || !occurrence) return <h2>Loading</h2>; //TODO replace with proper skeleton loader
  if (
    occurrence.stillImageCount === 0 &&
    occurrence.soundCount === 0 &&
    occurrence.movingImageCount === 0
  ) {
    if (visible) setVisible(false);
    return null;
  } else {
    if (!visible) setVisible(true);
  }

  return (
    <div className="g-mb-4 g-scroll-mt-24" id="multimedia">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="occurrenceDetails.extensions.multimedia.name" />
        </CardTitle>
      </CardHeader>
      <ul className="g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-4">
        <Sounds {...{ occurrence, termMap }} />
        <MovingImages {...{ occurrence, termMap }} />
        <Images occurrence={occurrence} />
      </ul>
    </div>
  );
}

function Images({ occurrence, ...props }: { occurrence: OccurrenceQuery['occurrence'] }) {
  if (!occurrence) return null;
  return (
    <>
      {occurrence.stillImages?.map((media: OccurrenceMediaDetailsFragment, index) => (
        <li key={`${media?.identifier}_${index}`}>
          <Card className="g-overflow-hidden">
            {media.identifier && (
              <figure>
                <a
                  target="_blank"
                  href={`https://www.gbif.org/tools/zoom/simple.html?src=${encodeURIComponent(
                    media.identifier
                  )}`}
                >
                  <img src={media.thumbor} />
                </a>
              </figure>
            )}
            <Caption media={media} occurrence={occurrence} />
          </Card>
        </li>
      ))}
    </>
  );
}

function Sounds({
  occurrence,
  termMap,
  ...props
}: {
  occurrence: OccurrenceQuery['occurrence'];
  termMap: { [key: string]: Term };
}) {
  if (!occurrence) return null;
  return (
    <>
      {occurrence.sounds?.map((media: OccurrenceMediaDetailsFragment, index) => {
        const format = media.format;
        const knownFormat = format && supportedFormats.includes(format); // typescript issues
        return (
          <li key={`${media?.identifier}_${index}`}>
            <Card className="g-overflow-hidden">
              <div>
                {knownFormat && media.identifier && (
                  <>
                    <audio controls>
                      <source src={media.identifier} type={format} />
                      Unable to play
                    </audio>
                    {
                      <CardContent>
                        <a href={termMap?.references?.value || media.identifier}>
                          If it isn't working try the publishers site instead <RiExternalLinkLine />
                        </a>
                      </CardContent>
                    }
                  </>
                )}
              </div>
              <Caption media={media} occurrence={occurrence} />
            </Card>
          </li>
        );
      })}
    </>
  );
}

function MovingImages({
  occurrence,
  termMap,
  ...props
}: {
  occurrence: OccurrenceQuery['occurrence'];
  termMap: { [key: string]: Term };
}) {
  if (!occurrence) return null;
  return (
    <>
      {occurrence.movingImages?.map((media: OccurrenceMediaDetailsFragment, index) => {
        if (!media) return null;
        const format = media.format;
        const knownFormat = format && ['video/mp4', 'video/ogg'].includes(format);
        return (
          <li key={`${media?.identifier}_${index}`}>
            <Card className="g-overflow-hidden">
              <div>
                {knownFormat && media.identifier && (
                  <>
                    <video controls className="g-w-full">
                      <source src={media.identifier} type={format} />
                      Unable to play
                    </video>
                    {(termMap?.references?.value || media.identifier) && (
                      <div>
                        <a
                          href={termMap?.references?.value || media.identifier}
                          className="g-px-2 g-py-1 g-bg-slate-300 g-block"
                        >
                          If it isn't working try the publishers site instead <RiExternalLinkLine />
                        </a>
                      </div>
                    )}
                  </>
                )}
                {!knownFormat && media.identifier && (
                  <a href={media.identifier}>
                    <div className="gb-download-icon">
                      <MdFileDownload />
                    </div>
                    <div>Download media file</div>
                  </a>
                )}
              </div>
              <Caption media={media} occurrence={occurrence} />
            </Card>
          </li>
        );
      })}
    </>
  );
}

function Caption({
  media,
  occurrence,
  ...props
}: {
  media: OccurrenceMediaDetailsFragment;
  occurrence: OccurrenceQuery['occurrence'];
}) {
  return (
    <figcaption className="g-px-4 g-py-2 [&_a]:g-underline">
      {!media.identifier && (
        <div className="g-bg-slate-200 g-rounded g-text-slate-800 g-px-2 g-py-1 g-mb-2">
          Identifier missing
        </div>
      )}
      <Properties style={{ fontSize: '85%' }} dense>
        {media.description && (
          <BasicField label={`occurrenceFieldNames.description`}>{media.description}</BasicField>
        )}
        {media.format && (
          <BasicField label={`occurrenceFieldNames.format`}>{media.format}</BasicField>
        )}
        {media.identifier && (
          <BasicField label={`occurrenceFieldNames.identifier`}>
            <a href={media.identifier}>{truncateMiddle(media.identifier, 40)}</a>
          </BasicField>
        )}
        {media.references && (
          <BasicField label={`occurrenceFieldNames.references`}>
            <a href={media.references}>{truncateMiddle(media.references, 40)}</a>
          </BasicField>
        )}
        {media.creator && (
          <BasicField label={`occurrenceFieldNames.creator`}>{media.creator}</BasicField>
        )}
        {media.publisher && (
          <BasicField label={`occurrenceFieldNames.publisher`}>{media.publisher}</BasicField>
        )}
        {media.rightsHolder && (
          <BasicField label={`occurrenceFieldNames.rightsHolder`}>{media.rightsHolder}</BasicField>
        )}
        {media.license && (
          <BasicField label={`occurrenceFieldNames.license`}>{media.license}</BasicField>
        )}
        {media.created && (
          <BasicField label={`occurrenceFieldNames.created`}>{media.created}</BasicField>
        )}
      </Properties>
    </figcaption>
  );
}
