import { MdInfoOutline } from 'react-icons/md';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { fragmentManager } from '@/services/FragmentManager';
import { HelpLineDetailsFragment } from '@/gql/graphql';

fragmentManager.register(/* GraphQL */ `
  fragment HelpLineDetails on Help {
    __typename
    title
    body
  }
`);

type Props = {
  help: HelpLineDetailsFragment;
};

export function HelpLine({ help }: Props) {
  return (
    <p className="pb-4 text-gray-600 text-sm text-right">
      <Popover>
        <PopoverTrigger>
          {help.title} <MdInfoOutline />
        </PopoverTrigger>
        <PopoverContent
          className="prose max-w-lg w-auto"
          dangerouslySetInnerHTML={{ __html: help.body ?? '' }}
        />
      </Popover>
    </p>
  );
}
