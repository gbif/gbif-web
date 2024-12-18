import { SimpleTooltip } from '@/components/simpleTooltip';
import { truncate } from '@/utils/truncate';
import { useEffect } from 'react';
import { HiOutlineClipboardCopy as CopyToClipboardIcon } from 'react-icons/hi';
import { FormattedMessage } from 'react-intl';
import useLocalStorage from 'use-local-storage';
import { PolygonLabel } from '../displayNames';
import { Option } from '../option';
import { isValidWKT } from './GeometryInput';

export const RecentInput = ({
  onAdd,
  currentlySelected,
}: {
  onAdd: ({ wkt }: { wkt: string[] }) => void;
  currentlySelected: string[];
}) => {
  const [recentGeometries, setRecentGeometries] = useLocalStorage(
    'recentGeometries',
    [] as string[]
  );

  // add the options to the list of recet geometries
  useEffect(() => {
    if (currentlySelected.length > 0) {
      // add the options to the list of recet geometries. But keep the ordering, with the most recent on top. and remove duplicates. And only store the last 20
      const newRecentGeometries = [...new Set([...currentlySelected, ...recentGeometries])].slice(
        0,
        20
      );
      setRecentGeometries(newRecentGeometries);
    }
  }, [currentlySelected]);

  const visibleRecentGeometries = (recentGeometries || []).filter(
    (x) => !currentlySelected.includes(x)
  );

  return (
    <div className="g-text-sm">
      {visibleRecentGeometries && visibleRecentGeometries.length > 0 && (
        <>
          {visibleRecentGeometries.map((concept) => {
            const isValid = isValidWKT(concept);
            return (
              <Option
                className="g-mb-1"
                key={concept}
                helpText={
                  isValid ? (
                    <div className="g-text-slate-400" style={{ fontSize: 12, lineHeight: 1.2 }}>
                      <PolygonLabel id={concept} />
                    </div>
                  ) : (
                    <InvalidWkt />
                  )
                }
                checked={false}
                onClick={() => {
                  onAdd({ wkt: [concept] });
                }}
              >
                <span className="g-break-all">
                  {truncate(concept, 50)} <CopyToClipboard text={concept} />
                </span>
              </Option>
            );
          })}
        </>
      )}
      {visibleRecentGeometries && visibleRecentGeometries.length === 0 && (
        <div className="g-text-sm g-text-slate-500 g-m-2">
          Geometries you have previously used will show here.
        </div>
      )}
    </div>
  );
};

export function CopyToClipboard({ text }: { text: string }) {
  return (
    <SimpleTooltip title={<FormattedMessage id="phrases.copyToClipboard" />}>
      <button
        className="g-relative g-bottom-0.5"
        onClick={() => navigator.clipboard.writeText(text)}
      >
        <CopyToClipboardIcon />
      </button>
    </SimpleTooltip>
  );
}

export function InvalidWkt() {
  return (
    <div style={{ color: 'tomato' }}>
      <FormattedMessage id="filterSupport.location.invalidWkt" />
    </div>
  );
}
