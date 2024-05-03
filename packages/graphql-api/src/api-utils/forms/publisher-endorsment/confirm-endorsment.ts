import config from "#/config";
import logger from "#/logger";
import { ConfirmEndorsmentDTO } from ".";
import { authenticatedRequest } from "../helpers/gbifAuthRequest";

export type ConfirmEndorsmentResult = 'publisherConfirmedSuccessfully' | 'publisherIsAlreadyConfirmed' | 'failedToConfirmPublisher';

export async function confirmEndorsment(dto: ConfirmEndorsmentDTO): Promise<ConfirmEndorsmentResult> {
  try {
    // Get organization
    const organizationResponse = await authenticatedRequest({
      method: 'GET',
      url: `${config.apiv1}/organization/${dto.key}`,
    });

    // Handle organization allready confirmed
    if (organizationResponse.body.endorsementApproved) {
      logger.error({ message: 'Publisher is already confirmed', key: dto.key });
      return 'publisherIsAlreadyConfirmed';
    }

    // Try to confirm organization
    const confirmEndorsmentResponse = await authenticatedRequest({
      method: 'POST',
      body: { code: dto.code },
      url: `${config.apiv1}/organization/${dto.key}/endorsement`,
      canonicalPath: `organization/${dto.key}/endorsement`,
    });

    // Handle failed to confirm organization
    if (confirmEndorsmentResponse.statusCode !== 204) {
      throw confirmEndorsmentResponse;
    }

    return 'publisherConfirmedSuccessfully';
  } catch (error) {
    // Handle failed to confirm publisher
    logger.error({ message: 'Failed to confirm publisher', error, key: dto.key });
    return 'failedToConfirmPublisher';
  }
}