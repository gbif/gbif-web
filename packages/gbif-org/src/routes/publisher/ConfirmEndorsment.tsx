import { Button } from '@/components/ui/button';
import { DynamicLink, LoaderArgs, RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { required } from '@/utils/required';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { MdErrorOutline } from 'react-icons/md';
import { useLoaderData, useSearchParams } from 'react-router-dom';

type LoaderResult =
  | {
      success: boolean;
      result:
        | 'publisherConfirmedSuccessfully'
        | 'publisherIsAlreadyConfirmed'
        | 'failedToConfirmPublisher';
    }
  | {
      success: false;
    };

async function confirmEndorsmentLoader({ request, config }: LoaderArgs) {
  try {
    // Extract the key and code from the URL
    const url = new URL(request.url);
    const key = required(url.searchParams.get('key'), 'No key was provided in the URL');
    const code = required(url.searchParams.get('code'), 'No code was provided in the URL');

    // Confirm the endorsement
    return fetch(`${config.formsEndpoint}/confirm-endorsement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, code }),
    });
  } catch (error) {
    return { success: false };
  }
}

function ConfirmEndorsmentPage() {
  const result = useLoaderData() as LoaderResult;
  const [searchParams] = useSearchParams();

  if (result.success === false || result.result === 'failedToConfirmPublisher') {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <MdErrorOutline color="red" size={120} />
        <p className="font-semibold pb-8 pt-4">Could not endorse the publisher</p>
      </div>
    );
  }

  if (result.success && result.result === 'publisherIsAlreadyConfirmed') {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <MdErrorOutline color="orange" size={120} />
        <p className="font-semibold pb-8 pt-4">The publisher is already endorsed</p>
        <Button asChild variant="default">
          <DynamicLink to={`/publisher/${searchParams.get('key')}`}>
            Go to publisher page
          </DynamicLink>
        </Button>
      </div>
    );
  }

  if (result.success && result.result === 'publisherConfirmedSuccessfully') {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <IoIosCheckmarkCircle color="green" size={120} />
        <p className="font-semibold pb-8 pt-4">Publisher has now been endorsed!</p>
        <Button asChild variant="default">
          <DynamicLink to={`/publisher/${searchParams.get('key')}`}>
            Go to publisher page
          </DynamicLink>
        </Button>
      </div>
    );
  }
}

export const confirmEndorsmentRoute: RouteObjectWithPlugins = {
  path: 'publisher/confirm',
  element: <ConfirmEndorsmentPage />,
  loader: confirmEndorsmentLoader,
};
