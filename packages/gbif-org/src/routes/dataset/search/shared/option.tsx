import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/shadcn";
import React from "react";

export const Option = React.forwardRef(
  (
    {
      className,
      helpText,
      checked,
      onClick,
      children,
      onKeyDown,
    }: {
      helpText?: string;
      checked?: boolean;
      children: React.ReactNode;
      onClick: (checked: boolean) => void;
      className?: string;
      onKeyDown?: (e: React.KeyboardEvent) => void;
    },
    ref
  ) => {
    // const Icon = checked ? MdOutlineRemoveCircle : MdOutlineAddCircle;
    return (
      <label className={cn('g-flex g-w-full', className)}>
        <Checkbox
          ref={ref}
          className="g-flex-none g-me-2 g-mt-0.5"
          checked={checked}
          onClick={() => {
            onClick(!checked);
          }}
          onKeyDown={onKeyDown}
        />
        {/* <MdAddCircleOutline className="g-flex-none g-me-2 g-mt-1" /> */}
        {/* <Icon className="g-flex-none g-me-2 g-mt-1 g-text-primary-500" /> */}
        <div className="g-flex-auto g-overflow-hidden">
          <div className="">{children}</div>
          {helpText && <div className="g-text-slate-400 g-text-sm">{helpText}</div>}
        </div>
      </label>
    );
  }
);