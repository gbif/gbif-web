import { useEffect, useRef, useState } from 'react';
import { MdBrokenImage, MdImage } from 'react-icons/md';

export function ClientImage({ wrapperProps, onLoad, defaultSize, style = {}, src, ...props }) {
  const imageRef = useRef();
  const [failed, markAsFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(false);

  useEffect(() => {
    markAsFailed(false);
    setLoading(true);
  }, [src]);

  // because we do server side rendering, we need to check if the image is already loaded. Since it could have finished loading before the component was mounted and hence won't trigger the onLoad function during hydration. Luckily there is a complete property on the image element that we can use.
  useEffect(() => {
    setClient(true);
    // const img = imageRef?.current;
    // debugger;
    // if (img?.complete) {
    //   markAsFailed(false);
    //   setLoading(false);
    // }
  }, []);

  return (
    <div style={{ display: 'inline-block', ...style }}>
      {loading && (
        <div
          className="g-animate-pulse g-rounded-md g-bg-slate-50 g-text-slate-400 g-flex g-items-center g-justify-center"
          style={{ width: '100%', height: '100%', ...defaultSize }}
        >
          <MdImage />
        </div>
      )}
      {failed && (
        <div className="gb-image-failed">
          <div
            style={defaultSize}
            className="g-bg-slate-50 g-text-red-400 g-flex g-items-center g-justify-center"
          >
            <MdBrokenImage />
          </div>
        </div>
      )}
      {client && !failed && (
        <img
          className="g-bg-slate-50"
          src={src}
          style={{ maxHeight: '100%', maxWidth: '100%', display: loading ? 'none' : 'block' }}
          ref={imageRef}
          onError={() => {
            markAsFailed(true);
            setLoading(false);
          }}
          onLoad={(e) => {
            setLoading(false);
            onLoad && onLoad(e);
          }}
          {...props}
        />
      )}
    </div>
  );
}
