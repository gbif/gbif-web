import { FormattedMessage } from "react-intl";
import { NoResultsImage } from "./icons/icons";

export function NoRecords() {
  return (
    <div className='g-text-center g-mb-12'>
      <NoResultsImage />
      <h3 className='g-font-bold g-text-slate-400'>
        <FormattedMessage id="phrases.noRecords" />
      </h3>
    </div>
  );
}
