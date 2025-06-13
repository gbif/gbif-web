import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

export const RangeInput = ({ onAdd }: { onAdd: ({ wkt }: { wkt: string[] }) => void }) => {
  const { toast } = useToast();
  const [minLatitude, setMinLatitude] = useState('-50');
  const [maxLatitude, setMaxLatitude] = useState('50');
  const [minLongitude, setMinLongitude] = useState('-150');
  const [maxLongitude, setMaxLongitude] = useState('150');

  const handleAdd = () => {
    try {
      let N = Number.parseFloat(maxLatitude);
      let S = Number.parseFloat(minLatitude);
      let W = Number.parseFloat(minLongitude);
      let E = Number.parseFloat(maxLongitude);
      if (isNaN(N) || isNaN(S) || isNaN(W) || isNaN(E)) {
        toast({
          title: 'Invalid range',
          variant: 'destructive',
        });
        return;
      }

      // cap north and south to 90 and -90
      if (N > 90) {
        N = 90;
      }
      if (S < -90) {
        S = -90;
      }
      if (W < -360) {
        W = -360;
      }
      if (E > 360) {
        E = 360;
      }

      // accept west values down to -359 and north up to 359, but the range can never be above 360
      if (Math.abs(E - W) >= 360) {
        W = -180;
        E = 180;
      }

      // require that North is larger than South and that East is larger than West
      if (N < S || E < W) {
        toast({
          title: 'Invalid range',
          variant: 'destructive',
        });
        return;
      }

      const wkt =
        'POLYGON' +
        '((W S,E S,E N,W N,W S))'
          .replace(/N/g, (+N.toFixed(3)).toString())
          .replace(/S/g, (+S.toFixed(3)).toString())
          .replace(/W/g, (+W.toFixed(3)).toString())
          .replace(/E/g, (+E.toFixed(3)).toString());

      // update lat and lon values with new nsew values
      setMinLatitude(S);
      setMaxLatitude(N);
      setMinLongitude(W);
      setMaxLongitude(E);

      onAdd({ wkt: [wkt] });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Invalid range',
        variant: 'destructive',
      });
    }
  };

  const isValid = useCallback((value: string | number, absoluteRange: number) => {
    if (value === undefined || value === null || value === '') {
      return true;
    }
    // regex to check if float number
    const isNumberRegEx = /^-?\d*\.?\d*$/;
    // check if value is empty or a number
    const isValid = isNumberRegEx.test(value + '');
    if (!isValid) {
      return false;
    }
    // check if value is within rage (e.g. -180 to 180)
    const numberValue = Number.parseFloat(value + '');
    if (isNaN(numberValue)) {
      return false;
    }
    if (absoluteRange) {
      return Math.abs(numberValue) <= absoluteRange;
    }
    return true;
  }, []);

  // provide 2 rows. one with latitude from-to and one with longitude from-to. And then an add button
  return (
    <div>
      <div className="g-grid g-gap-2 g-mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <label>
          <FormattedMessage id="filterSupport.location.south" defaultMessage="South" />
          <Input
            className="g-mt-1"
            type="number"
            style={{ color: !isValid(minLatitude, 90) ? 'tomato' : '' }}
            value={minLatitude}
            onChange={(event) => setMinLatitude(event.target.value)}
            placeholder="-90"
          />
        </label>
        <label>
          <FormattedMessage id="filterSupport.location.north" defaultMessage="North" />
          <Input
            className="g-mt-1"
            type="number"
            style={{ color: !isValid(maxLatitude, 90) ? 'tomato' : '' }}
            value={maxLatitude}
            onChange={(event) => setMaxLatitude(event.target.value)}
            placeholder="90"
          />
        </label>
        <label>
          <FormattedMessage id="filterSupport.location.west" defaultMessage="West" />
          <Input
            className="g-mt-1"
            type="number"
            style={{ color: !isValid(minLongitude, 180) ? 'tomato' : '' }}
            value={minLongitude}
            onChange={(event) => setMinLongitude(event.target.value)}
            placeholder="-180"
          />
        </label>
        <label>
          <FormattedMessage id="filterSupport.location.east" defaultMessage="East" />
          <Input
            className="g-mt-1"
            type="number"
            style={{ color: !isValid(maxLongitude, 180) ? 'tomato' : '' }}
            value={maxLongitude}
            onChange={(event) => setMaxLongitude(event.target.value)}
            placeholder="180"
          />
        </label>
      </div>
      <Button onClick={handleAdd} className="g-text-sm">
        <FormattedMessage id="filterSupport.add" defaultMessage="Add" />
      </Button>
    </div>
  );
};

RangeInput.propTypes = {
  onAdd: PropTypes.func,
};
