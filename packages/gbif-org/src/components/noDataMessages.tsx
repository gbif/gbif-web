import { FormattedMessage } from "react-intl";
import { NoResultsImage } from "./icons/icons";

export function NoRecords() {
  return (
    <div className="text-center mb-12">
      <NoResultsImage />
      <h3 className="font-bold text-slate-400">
        <FormattedMessage id="phrases.noRecords" />
      </h3>
    </div>
  );
}
