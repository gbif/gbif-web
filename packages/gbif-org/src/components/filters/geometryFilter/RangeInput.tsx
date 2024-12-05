import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const RangeInput = ({ onAdd }: { onAdd: ({ wkt }: { wkt: string[] }) => void }) => {
  const { toast } = useToast();
  const [minLatitude, setMinLatitude] = useState(-50);
  const [maxLatitude, setMaxLatitude] = useState(50);
  const [minLongitude, setMinLongitude] = useState(-150);
  const [maxLongitude, setMaxLongitude] = useState(150);

  const handleAdd = () => {
    try {
      let N = maxLatitude;
      let S = minLatitude;
      let W = minLongitude;
      let E = maxLongitude;

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

  // provide 2 rows. one with latitude from-to and one with longitude from-to. And then an add button
  return (
    <div>
      <div className="g-grid g-gap-2 g-mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <label>
          <FormattedMessage id="filterSupport.location.south" defaultMessage="South" />
          <Input
            className="g-mt-1"
            type="number"
            value={minLatitude}
            onChange={(event) => setMinLatitude(Number.parseFloat(event.target.value) ?? 0)}
            placeholder="-90"
          />
        </label>
        <label>
          <FormattedMessage id="filterSupport.location.north" defaultMessage="North" />
          <Input
            className="g-mt-1"
            type="number"
            value={maxLatitude}
            onChange={(event) => setMaxLatitude(Number.parseFloat(event.target.value) ?? 0)}
            placeholder="90"
          />
        </label>
        <label>
          <FormattedMessage id="filterSupport.location.west" defaultMessage="West" />
          <Input
            className="g-mt-1"
            type="number"
            value={minLongitude}
            onChange={(event) => setMinLongitude(Number.parseFloat(event.target.value) ?? 0)}
            placeholder="-180"
          />
        </label>
        <label>
          <FormattedMessage id="filterSupport.location.east" defaultMessage="East" />
          <Input
            className="g-mt-1"
            type="number"
            value={maxLongitude}
            onChange={(event) => setMaxLongitude(Number.parseFloat(event.target.value) ?? 0)}
            placeholder="180"
          />
        </label>
      </div>
      <Button onClick={handleAdd} className="g-text-sm">
        <FormattedMessage id="filterSupport.location.add" defaultMessage="Add" />
      </Button>
    </div>
  );
};

RangeInput.propTypes = {
  onAdd: PropTypes.func,
};
