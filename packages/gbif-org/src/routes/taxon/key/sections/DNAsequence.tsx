import { Button } from '@/components/ui/button';
import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import css from './dnaSequence.module.css';

const bases = new Set(['a', 'c', 't', 'g']);

const DNAsequence = ({
  className,
  sequence,
  marker,
  limit = 200,
}: {
  className: string;
  sequence: string;
  marker: string;
  limit: number;
}) => {
  const [shorten, setShorten] = useState(false);
  const [chars, setChars] = useState<string[]>([]);

  useEffect(() => {
    if (sequence) {
      const chars_ = sequence.split('');
      setChars(chars_);
      if (limit && limit < chars_.length) {
        setShorten(true);
      } else {
        setShorten(false);
      }
    }
  }, [sequence, limit]);
  useEffect(() => {}, [shorten]);

  return (
    <div className={cn(css.dnaSequence, className)}>
      <span>
        <FormattedMessage id="taxon.dna" />
        {marker ? `,${marker}` : ''}:{' '}
      </span>
      {(shorten ? chars.slice(0, limit) : chars).map((char, index) => (
        <span
          key={index}
          className={cn(bases.has(char?.toLowerCase()) ? css[char.toLowerCase()] : '')}
        >
          {char.toUpperCase()}
        </span>
      ))}

      <Button
        style={{ blockSize: 18 }}
        variant="ghost"
        size="sm"
        onClick={() => setShorten(!shorten)}
      >
        {shorten ? (
          <>
            {'... '}
            <FormattedMessage id={`taxon.more`} />{' '}
          </>
        ) : (
          <FormattedMessage id={`taxon.less`} />
        )}
      </Button>
    </div>
  );
};

export default DNAsequence;
