import { useEffect, useState } from 'react';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

const Cites = ({ taxonName, kingdom }) => {
  const [data, setData] = useState(null);
  const [updated, setUpdated] = useState(null);
  useEffect(() => {
    fetch(`${import.meta.env.PUBLIC_WEB_UTILS}/cites/${kingdom}/${taxonName}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setUpdated(new Date(data.updated_at).getFullYear());
      });
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
