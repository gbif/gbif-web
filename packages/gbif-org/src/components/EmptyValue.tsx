import { cn } from "@/utils/shadcn";
import { FormattedMessage } from "react-intl";

export default function EmptyValue({ className }: { className?: string }) {
  return (
    <span className={cn(`text-slate-400 italic`, className)}>
      <FormattedMessage id="phrases.noInformation" defaultMessage="No information" />
    </span>
  );
}
