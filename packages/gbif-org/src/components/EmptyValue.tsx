import { cn } from "@/utils/shadcn";
import { FormattedMessage } from "react-intl";

export default function EmptyValue({ className, id = 'phrases.noInformation' }: { className?: string, id?: string }) {
  return (
    <span className={cn(`text-slate-400 italic`, className)}>
      <FormattedMessage id={id} defaultMessage="No information" />
    </span>
  );
}
