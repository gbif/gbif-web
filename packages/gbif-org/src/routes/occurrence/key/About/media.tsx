import React, { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { RiExternalLinkLine } from 'react-icons/ri';
import { MdFileDownload } from 'react-icons/md';
import Properties, { Term as T, Value as V } from '@/components/Properties';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { OccurrenceMediaDetailsFragment, OccurrenceQuery, Term } from '@/gql/graphql';
import { BasicField } from '../properties';

const supportedFormats = [
  'audio/ogg',
  'audio/x-wav',
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
  'audio/mp4',
];

export function Media({
  occurrence,
  termMap,
  loading = false,
  error,
  className,
  ...props
}: {
  occurrence: OccurrenceQuery['occurrence'];
  termMap: { [key: string]: Term };
  loading?: boolean;
  error?: any;
  className?: string;
}) {
  if (loading || !occurrence) return <h2>Loading</h2>; //TODO replace with proper skeleton loader

  return (
    <div className="mb-4">
      <CardHeader>
        <CardTitle>Media</CardTitle>
      </CardHeader>
      <ul className="grid grid-cols-2 gap-4">
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
      {occurrence.stillImages?.map((media: OccurrenceMediaDetailsFragment | null) => (
        <li>
          <Card className="overflow-hidden">
            <figure>
              <a
                target="_blank"
                href={`https://www.gbif.org/tools/zoom/simple.html?src=${encodeURIComponent(
                  media.identifier
                )}`}
              >
                <img src={media.identifier} />
              </a>
            </figure>
            <Caption media={media} />
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
      {occurrence.sounds?.map((media: OccurrenceMediaDetailsFragment | null, i) => {
        const knownFormat = supportedFormats.includes(media.format);
        return (
          <li key={i}>
            <Card className="overflow-hidden">
              <div>
                {knownFormat && (
                  <>
                    <audio controls>
                      <source src={media.identifier} type={media.format} />
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
              <Caption media={media} />
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
      {occurrence.movingImages?.map((media: OccurrenceMediaDetailsFragment | null, i) => {
        if (!media) return null;
        const mediaFormat = media.format;
        const knownFormat = mediaFormat && ['video/mp4', 'video/ogg'].includes(mediaFormat);
        return (
          <li key={i}>
            <Card className="overflow-hidden">
              <div>
                {knownFormat && media.identifier && (
                  <>
                    <video controls>
                      <source src={media.identifier} type={mediaFormat} />
                      Unable to play
                    </video>
                    {(termMap?.references?.value || media.identifier) && (
                      <div>
                        <a href={termMap?.references?.value || media.identifier}>
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
              <Caption media={media} />
            </Card>
          </li>
        );
      })}
    </>
  );
}

function Caption({ media, ...props }: { media: OccurrenceMediaDetailsFragment }) {
  return (
    <figcaption className="px-4 py-2">
      <Properties style={{ fontSize: '85%' }}>
        {[
          'description',
          'format',
          'identifier',
          'created',
          'creator',
          'license',
          'publisher',
          'references',
          'rightsholder',
        ]
          .filter((x) => media[x])
          .map((x) => (
            <React.Fragment key={x}>
              <BasicField label={`occurrenceFieldNames.${x}`}>
                {media[x]}
              </BasicField>
            </React.Fragment>
          ))}
      </Properties>
    </figcaption>
  );
}
