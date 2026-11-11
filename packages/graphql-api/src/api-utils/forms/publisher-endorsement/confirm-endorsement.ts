import config from '@/config';
import logger from '@/logger';
import { ConfirmEndorsementDTO } from '.';
import { authenticatedRequest, UnexpectedResponseError } from '../helpers/gbifAuthRequest';
import { urlPath } from '@/helpers/urlPath';

export type ConfirmEndorsmentResult =
  | 'publisherConfirmedSuccessfully'
  | 'publisherIsAlreadyConfirmed'
  | 'failedToConfirmPublisher';

export async function confirmEndorsement(
  dto: ConfirmEndorsementDTO,
): Promise<ConfirmEndorsmentResult> {
  try {
    // Get organization
    const organizationResponse = await authenticatedRequest({
      method: 'GET',
      url: config.apiv1 + urlPath`/organization/${dto.key}`,
      asApp: true,
    });

    // Handle organization allready confirmed
    if (organizationResponse.body.endorsementApproved) {
      logger.error({ message: 'Publisher is already confirmed', key: dto.key });
      return 'publisherIsAlreadyConfirmed';
    }

    // Try to confirm organization
    const confirmEndorsementResponse = await authenticatedRequest({
      method: 'POST',
      body: { confirmationKey: dto.code },
      url: config.apiv1 + urlPath`/organization/${dto.key}/endorsement`,
      canonicalPath: urlPath`organization/${dto.key}/endorsement`,
      // The endorsing node has no login here; the confirmation key is what proves the request.
      asApp: true,
    });

    // Handle failed to confirm organization
    if (confirmEndorsementResponse.statusCode !== 204) {
      throw new UnexpectedResponseError('Unexpected response when confirming endorsement', confirmEndorsementResponse);
    }

    return 'publisherConfirmedSuccessfully';
  } catch (error) {
    // Handle failed to confirm publisher
    logger.error({
      message: 'Failed to confirm publisher',
      error,
      key: dto.key,
    });
    return 'failedToConfirmPublisher';
  }
}
