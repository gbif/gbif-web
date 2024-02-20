import { MdInfoOutline } from 'react-icons/md';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = {
  label: React.ReactNode;
  content: React.ReactNode;
};

export function HelpLine({ label, content }: Props) {
  return (
    <p className="pb-4 text-gray-600 text-sm text-right">
      <Popover>
        <PopoverTrigger>
          {label} <MdInfoOutline />
        </PopoverTrigger>
        <PopoverContent className="prose max-w-lg w-auto">{content}</PopoverContent>
      </Popover>
    </p>
  );
}
