import encryption, { createSHA256Hash } from '../../shared/encryption';
import type { UserStorageFeatureKeys } from '../../shared/storage-schema';
import { USER_STORAGE_FEATURE_NAMES } from '../../shared/storage-schema';
import {
  mockEndpointGetUserStorage,
  mockEndpointUpsertUserStorage,
  mockEndpointGetUserStorageAllFeatureEntries,
  mockEndpointBatchUpsertUserStorage,
  mockEndpointBatchDeleteUserStorage,
  mockEndpointDeleteUserStorageAllFeatureEntries,
  mockEndpointDeleteUserStorage,
} from './__fixtures__/mockServices';
import {
  MOCK_STORAGE_DATA,
  MOCK_STORAGE_KEY,
} from './__fixtures__/mockStorage';
import type { GetUserStorageResponse } from './services';
import {
  batchUpsertUserStorage,
  batchDeleteUserStorage,
  getUserStorage,
  getUserStorageAllFeatureEntries,
  upsertUserStorage,
  deleteUserStorageAllFeatureEntries,
  deleteUserStorage,
} from './services';

describe('user-storage/services.ts - getUserStorage() tests', () => {
  const actCallGetUserStorage = async () => {
    return await getUserStorage({
      bearerToken: 'MOCK_BEARER_TOKEN',
      path: `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      storageKey: MOCK_STORAGE_KEY,
    });
  };

  it('returns user storage data', async () => {
    const mockGetUserStorage = await mockEndpointGetUserStorage();
    const result = await actCallGetUserStorage();

    mockGetUserStorage.done();
    expect(result).toBe(MOCK_STORAGE_DATA);
  });

  it('returns null if endpoint does not have entry', async () => {
    const mockGetUserStorage = await mockEndpointGetUserStorage(
      `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      { status: 404 },
    );
    const result = await actCallGetUserStorage();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });

  it('returns null if endpoint fails', async () => {
    const mockGetUserStorage = await mockEndpointGetUserStorage(
      `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      { status: 500 },
    );
    const result = await actCallGetUserStorage();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });

  it('returns null if unable to decrypt data', async () => {
    const badResponseData: GetUserStorageResponse = {
      HashedKey: 'MOCK_HASH',
      Data: 'Bad Encrypted Data',
    };
    const mockGetUserStorage = await mockEndpointGetUserStorage(
      `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      {
        status: 200,
        body: badResponseData,
      },
    );
    const result = await actCallGetUserStorage();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });
});

describe('user-storage/services.ts - getUserStorageAllFeatureEntries() tests', () => {
  const actCallGetUserStorageAllFeatureEntries = async () => {
    return await getUserStorageAllFeatureEntries({
      bearerToken: 'MOCK_BEARER_TOKEN',
      path: USER_STORAGE_FEATURE_NAMES.notifications,
      storageKey: MOCK_STORAGE_KEY,
    });
  };

  it('returns user storage data', async () => {
    const mockGetUserStorageAllFeatureEntries =
      await mockEndpointGetUserStorageAllFeatureEntries(
        USER_STORAGE_FEATURE_NAMES.notifications,
      );
    const result = await actCallGetUserStorageAllFeatureEntries();

    mockGetUserStorageAllFeatureEntries.done();
    expect(result).toStrictEqual([MOCK_STORAGE_DATA]);
  });

  it('returns null if endpoint does not have entry', async () => {
    const mockGetUserStorage =
      await mockEndpointGetUserStorageAllFeatureEntries(
        USER_STORAGE_FEATURE_NAMES.notifications,
        {
          status: 404,
        },
      );
    const result = await actCallGetUserStorageAllFeatureEntries();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });

  it('returns null if endpoint fails', async () => {
    const mockGetUserStorage =
      await mockEndpointGetUserStorageAllFeatureEntries(
        USER_STORAGE_FEATURE_NAMES.notifications,
        {
          status: 500,
        },
      );
    const result = await actCallGetUserStorageAllFeatureEntries();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });

  it('returns null if unable to decrypt data', async () => {
    const badResponseData: GetUserStorageResponse = {
      HashedKey: 'MOCK_HASH',
      Data: 'Bad Encrypted Data',
    };
    const mockGetUserStorage =
      await mockEndpointGetUserStorageAllFeatureEntries(
        USER_STORAGE_FEATURE_NAMES.notifications,
        {
          status: 200,
          body: badResponseData,
        },
      );
    const result = await actCallGetUserStorageAllFeatureEntries();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });
});

describe('user-storage/services.ts - upsertUserStorage() tests', () => {
  const actCallUpsertUserStorage = async () => {
    return await upsertUserStorage(MOCK_STORAGE_DATA, {
      bearerToken: 'MOCK_BEARER_TOKEN',
      path: `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      storageKey: MOCK_STORAGE_KEY,
    });
  };

  it('invokes upsert endpoint with no errors', async () => {
    const mockUpsertUserStorage = mockEndpointUpsertUserStorage(
      `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      undefined,
      async (requestBody) => {
        if (typeof requestBody === 'string') {
          return;
        }

        const decryptedBody = await encryption.decryptString(
          requestBody.data,
          MOCK_STORAGE_KEY,
        );

        expect(decryptedBody).toBe(MOCK_STORAGE_DATA);
      },
    );

    await actCallUpsertUserStorage();

    expect(mockUpsertUserStorage.isDone()).toBe(true);
  });

  it('throws error if unable to upsert user storage', async () => {
    const mockUpsertUserStorage = mockEndpointUpsertUserStorage(
      `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      {
        status: 500,
      },
    );

    await expect(actCallUpsertUserStorage()).rejects.toThrow(expect.any(Error));
    mockUpsertUserStorage.done();
  });
});

describe('user-storage/services.ts - batchUpsertUserStorage() tests', () => {
  const dataToStore: [
    UserStorageFeatureKeys<typeof USER_STORAGE_FEATURE_NAMES.accounts>,
    string,
  ][] = [
    ['0x123', MOCK_STORAGE_DATA],
    ['0x456', MOCK_STORAGE_DATA],
  ];

  const actCallBatchUpsertUserStorage = async () => {
    return await batchUpsertUserStorage(dataToStore, {
      bearerToken: 'MOCK_BEARER_TOKEN',
      path: USER_STORAGE_FEATURE_NAMES.accounts,
      storageKey: MOCK_STORAGE_KEY,
    });
  };

  it('invokes upsert endpoint with no errors', async () => {
    const mockUpsertUserStorage = mockEndpointBatchUpsertUserStorage(
      USER_STORAGE_FEATURE_NAMES.accounts,
      undefined,
      async (_uri, requestBody) => {
        if (typeof requestBody === 'string') {
          return;
        }

        const decryptedBody = await Promise.all(
          Object.entries<string>(requestBody.data).map(
            async ([entryKey, entryValue]) => {
              return [
                entryKey,
                await encryption.decryptString(entryValue, MOCK_STORAGE_KEY),
              ];
            },
          ),
        );

        const expectedBody = dataToStore.map(([entryKey, entryValue]) => [
          createSHA256Hash(String(entryKey) + MOCK_STORAGE_KEY),
          entryValue,
        ]);

        expect(decryptedBody).toStrictEqual(expectedBody);
      },
    );

    await actCallBatchUpsertUserStorage();

    expect(mockUpsertUserStorage.isDone()).toBe(true);
  });

  it('throws error if unable to upsert user storage', async () => {
    const mockUpsertUserStorage = mockEndpointBatchUpsertUserStorage(
      USER_STORAGE_FEATURE_NAMES.accounts,
      {
        status: 500,
      },
    );

    await expect(actCallBatchUpsertUserStorage()).rejects.toThrow(
      expect.any(Error),
    );
    mockUpsertUserStorage.done();
  });
});

describe('user-storage/services.ts - deleteUserStorage() tests', () => {
  const actCallDeleteUserStorage = async () => {
    return await deleteUserStorage({
      path: `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      bearerToken: 'MOCK_BEARER_TOKEN',
      storageKey: MOCK_STORAGE_KEY,
    });
  };

  it('invokes delete endpoint with no errors', async () => {
    const mockDeleteUserStorage = mockEndpointDeleteUserStorage(
      `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
    );

    await actCallDeleteUserStorage();

    expect(mockDeleteUserStorage.isDone()).toBe(true);
  });

  it('throws error if unable to delete user storage', async () => {
    const mockDeleteUserStorage = mockEndpointDeleteUserStorage(
      `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      { status: 500 },
    );

    await expect(actCallDeleteUserStorage()).rejects.toThrow(expect.any(Error));
    mockDeleteUserStorage.done();
  });

  it('throws error if feature not found', async () => {
    const mockDeleteUserStorage = mockEndpointDeleteUserStorage(
      `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      { status: 404 },
    );

    await expect(actCallDeleteUserStorage()).rejects.toThrow(
      'user-storage - feature/entry not found',
    );
    mockDeleteUserStorage.done();
  });

  it('throws error if unable to get user storage', async () => {
    const mockDeleteUserStorage = mockEndpointDeleteUserStorage(
      `${USER_STORAGE_FEATURE_NAMES.notifications}.notification_settings`,
      { status: 400 },
    );

    await expect(actCallDeleteUserStorage()).rejects.toThrow(
      'user-storage - unable to delete data',
    );
    mockDeleteUserStorage.done();
  });
});

describe('user-storage/services.ts - deleteUserStorageAllFeatureEntries() tests', () => {
  const actCallDeleteUserStorageAllFeatureEntries = async () => {
    return await deleteUserStorageAllFeatureEntries({
      bearerToken: 'MOCK_BEARER_TOKEN',
      path: USER_STORAGE_FEATURE_NAMES.accounts,
      storageKey: MOCK_STORAGE_KEY,
    });
  };

  it('invokes delete endpoint with no errors', async () => {
    const mockDeleteUserStorage =
      mockEndpointDeleteUserStorageAllFeatureEntries(
        USER_STORAGE_FEATURE_NAMES.accounts,
        undefined,
      );

    await actCallDeleteUserStorageAllFeatureEntries();

    expect(mockDeleteUserStorage.isDone()).toBe(true);
  });

  it('throws error if unable to delete user storage', async () => {
    const mockDeleteUserStorage =
      mockEndpointDeleteUserStorageAllFeatureEntries(
        USER_STORAGE_FEATURE_NAMES.accounts,
        {
          status: 500,
        },
      );

    await expect(actCallDeleteUserStorageAllFeatureEntries()).rejects.toThrow(
      expect.any(Error),
    );
    mockDeleteUserStorage.done();
  });

  it('throws error if feature not found', async () => {
    const mockDeleteUserStorage =
      mockEndpointDeleteUserStorageAllFeatureEntries(
        USER_STORAGE_FEATURE_NAMES.accounts,
        {
          status: 404,
        },
      );

    await expect(actCallDeleteUserStorageAllFeatureEntries()).rejects.toThrow(
      'user-storage - feature not found',
    );
    mockDeleteUserStorage.done();
  });

  it('throws error if unable to get user storage', async () => {
    const mockDeleteUserStorage =
      mockEndpointDeleteUserStorageAllFeatureEntries(
        USER_STORAGE_FEATURE_NAMES.accounts,
        {
          status: 400,
        },
      );

    await expect(actCallDeleteUserStorageAllFeatureEntries()).rejects.toThrow(
      'user-storage - unable to delete data',
    );
    mockDeleteUserStorage.done();
  });
});

describe('user-storage/services.ts - batchDeleteUserStorage() tests', () => {
  const keysToDelete: UserStorageFeatureKeys<
    typeof USER_STORAGE_FEATURE_NAMES.accounts
  >[] = ['0x123', '0x456'];

  const actCallBatchDeleteUserStorage = async () => {
    return await batchDeleteUserStorage(keysToDelete, {
      bearerToken: 'MOCK_BEARER_TOKEN',
      path: USER_STORAGE_FEATURE_NAMES.accounts,
      storageKey: MOCK_STORAGE_KEY,
    });
  };

  it('invokes upsert endpoint with no errors', async () => {
    const mockDeleteUserStorage = mockEndpointBatchDeleteUserStorage(
      USER_STORAGE_FEATURE_NAMES.accounts,
      undefined,
      async (_uri, requestBody) => {
        if (typeof requestBody === 'string') {
          return;
        }

        const expectedBody = keysToDelete.map((entryKey: string) =>
          createSHA256Hash(String(entryKey) + MOCK_STORAGE_KEY),
        );

        expect(requestBody.batch_delete).toStrictEqual(expectedBody);
      },
    );

    await actCallBatchDeleteUserStorage();

    expect(mockDeleteUserStorage.isDone()).toBe(true);
  });

  it('throws error if unable to upsert user storage', async () => {
    const mockDeleteUserStorage = mockEndpointBatchDeleteUserStorage(
      USER_STORAGE_FEATURE_NAMES.accounts,
      {
        status: 500,
      },
    );

    await expect(actCallBatchDeleteUserStorage()).rejects.toThrow(
      expect.any(Error),
    );
    mockDeleteUserStorage.done();
  });
});
