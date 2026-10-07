import { useEffect, useState } from 'react';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

type CitesResponse = { cites_listing?: string; _reference?: string; updated_at: string };

const Cites = ({ taxonName, kingdom }: { taxonName: string; kingdom?: string | null }) => {
  const [data, setData] = useState<CitesResponse | null>(null);
  const [updated, setUpdated] = useState<number | null>(null);
  useEffect(() => {
    fetch(`${import.meta.env.PUBLIC_WEB_UTILS}/cites/${kingdom}/${taxonName}`)
      .then((res) => res.json())
      .then((data: CitesResponse) => {
        setData(data);
        setUpdated(new Date(data.updated_at).getFullYear());
      })
      .catch(() => null);
  }, [taxonName, kingdom]);

  return data ? (
    <div className="g-me-12">
      <FormattedMessage id="taxon.tradeRestrictions" /> {data?.cites_listing}{' '}
      {updated && (
        <a
          className="g-text-slate-500 g-mx-1"
          href={data?._reference}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FormattedMessage id="taxon.cites" /> {updated} <MdLink />
        </a>
      )}
    </div>
  ) : null;
};

export default Cites;
