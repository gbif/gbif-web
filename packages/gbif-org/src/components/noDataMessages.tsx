import { FormattedMessage } from "react-intl";
import { NoResultsImage } from "./icons/icons";

export function NoRecords() {
  return (
    <div className='g-text-center g-my-8'>
      <NoResultsImage />
      <h3 className='g-font-bold g-text-slate-400/80'>
        <FormattedMessage id="phrases.noRecords" />
      </h3>
    </div>
  );
}
