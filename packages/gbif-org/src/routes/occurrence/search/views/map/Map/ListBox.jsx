import { BasisOfRecordLabel } from '@/components/filters/displayNames';
import StripeLoader from '@/components/stripeLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/shadcn';
import { useContext } from 'react';
import { MdChevronRight } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
// import { Image, StripeLoader, Button, Row, Col } from '../../../../components';
import { FormattedDate } from 'react-intl';
// import ThemeContext from '../../../../style/themes/ThemeContext';
// import { styledScrollBars } from '../../../../style/shared';

function ListItem({ id, item, onClick = (id) => {}, ...props }) {
  return (
    <button className="gbif-listItem g-text-start g-w-full g-border-b g-p-2 g-text-sm g-min-h-20" onClick={() => onClick({ id })}>
      <div className="g-flex g-flex-row g-flex-nowrap" >
        <div className="g-flex-grow gbif-listItemContent">
          <h4 className=""
            dangerouslySetInnerHTML={{ __html: item.gbifClassification.usage.formattedName }}
          ></h4>
          {item.eventDate && (
            <div className="g-text-slate-500">
              <FormattedDate value={item.eventDate} year="numeric" month="long" day="2-digit" />
            </div>
          )}
          {/* <div className="g-text-slate-500">
            <BasisOfRecordLabel id={item.basisOfRecord} />
          </div> */}
        </div>
        {item.primaryImage?.identifier && (
          <div className="g-flex-grow-0 g-block g-w-[60px] g-h-[60px] g-bg-slate-100 g-rounded g-border">
            <img
              src={item.primaryImage?.identifier}
              className="g-w-full g-h-full g-rounded"
            />
          </div>
        )}
      </div>
    </button>
  );
}

function ListBox({ className, labelMap, onCloseRequest, onClick, data, error, loading, ...props }) {
  if (!error && !loading && !data) return null;

  let content;
  if (loading) {
    return (
      <section {...props}>
        <div className="gbif-container">
          <StripeLoader active />
          <div className="listItemContent">
            <FormattedMessage id="phrases.loading" />
          </div>
        </div>
      </section>
    );
  } else if (error) {
    return (
      <section {...props}>
        <div className="container">
          <StripeLoader active error />
          <div className="gbif-listItemContent">
            <FormattedMessage id="phrases.loadError" />
          </div>
        </div>
      </section>
    );
  } else if (data) {
    const results = data?.occurrenceSearch?.documents?.results || [];
    content = (
      <ul className="gbif-list">
        {results.map((x, index) => {
          return (
            <li key={x.key}>
              <ListItem
                onClick={() => onClick({ index })}
                id={x.key}
                item={x}
              />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section {...props} className={cn('g-flex g-flex-col g-bg-white g-border', className)}>
      <header className="g-flex g-flex-col g-flex-none g-border-b g-text-sm g-font-bold g-px-2 g-py-1">
        <div className="g-flex g-flex-row g-items-center">
          <div className="g-flex-1">
            <FormattedMessage
              id="counts.nResults"
              values={{ total: data?.occurrenceSearch?.documents.total }}
            />
          </div>
          <div className="g-flex-0">
            <Button variant="outline" onClick={onCloseRequest}>
              <FormattedMessage id="phrases.close" />
            </Button>
          </div>
        </div>
      </header>
      <main className="g-flex-1 g-overflow-auto">
        {content}
      </main>
    </section>
  );
}

export default ListBox;
