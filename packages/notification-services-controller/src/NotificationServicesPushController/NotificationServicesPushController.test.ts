import { Messenger } from '@metamask/base-controller';
import type { AuthenticationController } from '@metamask/profile-sync-controller';
import log from 'loglevel';

import NotificationServicesPushController from './NotificationServicesPushController';
import type {
  AllowedActions,
  AllowedEvents,
  NotificationServicesPushControllerMessenger,
} from './NotificationServicesPushController';
import * as services from './services/services';
import type { PushNotificationEnv } from './types';

// Testing util to clean up verbose logs when testing errors
const mockErrorLog = () =>
  jest.spyOn(log, 'error').mockImplementation(jest.fn());

const MOCK_JWT = 'mockJwt';
const MOCK_FCM_TOKEN = 'mockFcmToken';
const MOCK_MOBILE_FCM_TOKEN = 'mockMobileFcmToken';
const MOCK_TRIGGERS = ['uuid1', 'uuid2'];

describe('NotificationServicesPushController', () => {
  const arrangeServicesMocks = (token?: string) => {
    const activatePushNotificationsMock = jest
      .spyOn(services, 'activatePushNotifications')
      .mockResolvedValue(token ?? MOCK_FCM_TOKEN);

    const deactivatePushNotificationsMock = jest
      .spyOn(services, 'deactivatePushNotifications')
      .mockResolvedValue(true);

    const unsubscribeMock = jest.fn();
    const listenToPushNotificationsMock = jest
      .spyOn(services, 'listenToPushNotifications')
      .mockResolvedValue(unsubscribeMock);

    const updateTriggerPushNotificationsMock = jest
      .spyOn(services, 'updateTriggerPushNotifications')
      .mockResolvedValue({
        isTriggersLinkedToPushNotifications: true,
      });

    return {
      activatePushNotificationsMock,
      deactivatePushNotificationsMock,
      listenToPushNotificationsMock,
      updateTriggerPushNotificationsMock,
    };
  };

  describe('enablePushNotifications', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update the state with the fcmToken', async () => {
      arrangeServicesMocks();
      const { controller, messenger } = arrangeMockMessenger();
      mockAuthBearerTokenCall(messenger);

      await controller.enablePushNotifications(MOCK_TRIGGERS);
      expect(controller.state.fcmToken).toBe(MOCK_FCM_TOKEN);

      expect(services.listenToPushNotifications).toHaveBeenCalled();
    });

    it('should update the state with provided mobile fcmToken', async () => {
      arrangeServicesMocks(MOCK_MOBILE_FCM_TOKEN);
      const { controller, messenger } = arrangeMockMessenger();
      mockAuthBearerTokenCall(messenger);

      await controller.enablePushNotifications(
        MOCK_TRIGGERS,
        MOCK_MOBILE_FCM_TOKEN,
      );
      expect(controller.state.fcmToken).toBe(MOCK_MOBILE_FCM_TOKEN);

      expect(services.listenToPushNotifications).toHaveBeenCalled();
    });
  });

  describe('disablePushNotifications', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update the state removing the fcmToken', async () => {
      arrangeServicesMocks();
      const { controller, messenger } = arrangeMockMessenger();
      mockAuthBearerTokenCall(messenger);
      await controller.disablePushNotifications(MOCK_TRIGGERS);
      expect(controller.state.fcmToken).toBe('');
    });

    it('should fail if a jwt token is not provided', async () => {
      arrangeServicesMocks();
      mockErrorLog();
      const { controller, messenger } = arrangeMockMessenger();
      mockAuthBearerTokenCall(messenger).mockResolvedValue(
        null as unknown as string,
      );
      await expect(controller.disablePushNotifications([])).rejects.toThrow(
        expect.any(Error),
      );
    });
  });

  describe('updateTriggerPushNotifications', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call updateTriggerPushNotifications with the correct parameters', async () => {
      arrangeServicesMocks();
      const { controller, messenger } = arrangeMockMessenger();
      mockAuthBearerTokenCall(messenger);
      const spy = jest
        .spyOn(services, 'updateTriggerPushNotifications')
        .mockResolvedValue({
          isTriggersLinkedToPushNotifications: true,
        });

      await controller.updateTriggerPushNotifications(MOCK_TRIGGERS);

      expect(spy).toHaveBeenCalled();
      const args = spy.mock.calls[0][0];
      expect(args.bearerToken).toBe(MOCK_JWT);
      expect(args.triggers).toBe(MOCK_TRIGGERS);
      expect(args.regToken).toBe(controller.state.fcmToken);
    });
  });
});

// Test helper functions
const buildPushPlatformNotificationsControllerMessenger = () => {
  const globalMessenger = new Messenger<AllowedActions, AllowedEvents>();

  return globalMessenger.getRestricted<
    'NotificationServicesPushController',
    AllowedActions['type']
  >({
    name: 'NotificationServicesPushController',
    allowedActions: ['AuthenticationController:getBearerToken'],
    allowedEvents: [],
  });
};

/**
 * Jest Mock Utility - mock messenger
 *
 * @returns a mock messenger and other helpful mocks
 */
function arrangeMockMessenger() {
  const messenger = buildPushPlatformNotificationsControllerMessenger();
  const controller = new NotificationServicesPushController({
    messenger,
    state: { fcmToken: '' },
    env: {} as PushNotificationEnv,
    config: {
      isPushEnabled: true,
      onPushNotificationClicked: jest.fn(),
      onPushNotificationReceived: jest.fn(),
      platform: 'extension',
    },
  });

  return {
    controller,
    initialState: controller.state,
    messenger,
  };
}

/**
 * Jest Mock Utility - mock auth get bearer token
 *
 * @param messenger - mock messenger
 * @returns mock getBearerAuth function
 */
function mockAuthBearerTokenCall(
  messenger: NotificationServicesPushControllerMessenger,
) {
  type Fn =
    AuthenticationController.AuthenticationControllerGetBearerToken['handler'];
  const mockAuthGetBearerToken = jest
    .fn<ReturnType<Fn>, Parameters<Fn>>()
    .mockResolvedValue(MOCK_JWT);

  jest.spyOn(messenger, 'call').mockImplementation((...args) => {
    const [actionType] = args;
    if (actionType === 'AuthenticationController:getBearerToken') {
      return mockAuthGetBearerToken();
    }

    throw new Error('MOCK - unsupported messenger call mock');
  });

  return mockAuthGetBearerToken;
}
