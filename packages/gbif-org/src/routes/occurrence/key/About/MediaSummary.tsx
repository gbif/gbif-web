import { Img } from '@/components/Img';
import { MdVideocam } from 'react-icons/md';
import { MediaGallery, MediaGalleryItem } from '../../media/MediaGallery';

const PLAYABLE_VIDEO_FORMATS = ['video/mp4', 'video/ogg'];

export function MediaSummary({ occurrence }: { occurrence: any }) {
  // Build a unified list: still images first, then playable videos
  const rawImages = (occurrence?.stillImages ?? []).filter((img: any) => img.thumbor);
  const rawVideos = (occurrence?.movingImages ?? []).filter((v: any) =>
    PLAYABLE_VIDEO_FORMATS.includes(v.format)
  );
  const isMultiple = rawImages.length + rawVideos.length > 1;

  const multiStyle = {
    maxWidth: '100%',
    height: '100%',
    maxHeight: 400,
    display: 'block',
    objectFit: 'contain' as const,
  };
  const singleStyle = {
    maxWidth: '100%',
    maxHeight: 400,
    display: 'block',
    margin: 'auto',
    minHeight: 50,
  };

  const items: MediaGalleryItem[] = [
    ...rawImages.map((img: any) => ({
      id: img.identifier ?? img.thumbor,
      content: (
        <Img
          src={img.thumbor}
          style={isMultiple ? multiStyle : singleStyle}
          failedClassName="g-w-full g-h-24"
        />
      ),
      thumbnail: (
        <img
          src={img.smallThumbnail}
          alt=""
          className="g-w-full g-h-full g-object-cover"
          loading="lazy"
        />
      ),
      thumbnailAriaLabel: `Image`,
      info:
        img.creator || img.license ? (
          <>
            {img.creator && (
              <p>
                <span className="g-opacity-70">Creator: </span>
                {img.creator}
              </p>
            )}
            {img.license && (
              <p>
                <span className="g-opacity-70">License: </span>
                {img.license}
              </p>
            )}
          </>
        ) : undefined,
    })),
    ...rawVideos.map((v: any) => ({
      id: v.identifier,
      content: (
        <video
          controls
          style={{ maxWidth: '100%', height: '100%', maxHeight: 400, display: 'block' }}
        >
          <source src={v.identifier} type={v.format} />
          Unable to play
        </video>
      ),
      thumbnail: (
        <div className="g-w-full g-h-full g-bg-neutral-200 g-flex g-items-center g-justify-center g-text-neutral-500">
          <MdVideocam size={22} />
        </div>
      ),
      thumbnailAriaLabel: `Video`,
      info:
        v.creator || v.license ? (
          <>
            {v.creator && (
              <p>
                <span className="g-opacity-70">Creator: </span>
                {v.creator}
              </p>
            )}
            {v.license && (
              <p>
                <span className="g-opacity-70">License: </span>
                {v.license}
              </p>
            )}
          </>
        ) : undefined,
    })),
  ];

  return (
    <MediaGallery
      items={items}
      renderBottomRight={(activeIndex, total) => (
        <span className="g-absolute g-bottom-2 g-end-2 g-bg-neutral-800/70 g-text-white g-text-xs g-rounded g-px-2 g-py-0.5 g-pointer-events-none">
          {activeIndex + 1} / {total}
        </span>
      )}
    />
  );
}
