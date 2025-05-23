import { Messenger } from '@metamask/base-controller';
import {
  ChainId,
  NetworkType,
  convertHexToDecimal,
  toHex,
  InfuraNetworkType,
} from '@metamask/controller-utils';
import type { NetworkState } from '@metamask/network-controller';
import type { Hex } from '@metamask/utils';
import nock from 'nock';
import * as sinon from 'sinon';

import { advanceTime } from '../../../tests/helpers';
import type {
  ExtractAvailableAction,
  ExtractAvailableEvent,
} from '../../base-controller/tests/helpers';
import {
  buildCustomNetworkClientConfiguration,
  buildInfuraNetworkClientConfiguration,
  buildMockGetNetworkClientById,
} from '../../network-controller/tests/helpers';
import * as tokenService from './token-service';
import type {
  TokenListMap,
  TokenListState,
  TokenListControllerMessenger,
} from './TokenListController';
import { TokenListController } from './TokenListController';

const name = 'TokenListController';
const timestamp = Date.now();

const sampleMainnetTokenList = [
  {
    address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    symbol: 'SNX',
    decimals: 18,
    occurrences: 11,
    name: 'Synthetix',
    iconUrl:
      'https://static.cx.metamask.io/api/v1/tokenIcons/1/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png',
    aggregators: [
      'Aave',
      'Bancor',
      'CMC',
      'Crypto.com',
      'CoinGecko',
      '1inch',
      'Paraswap',
      'PMM',
      'Synthetix',
      'Zapper',
      'Zerion',
      '0x',
    ],
  },
  {
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    symbol: 'LINK',
    decimals: 18,
    occurrences: 11,
    name: 'Chainlink',
    iconUrl:
      'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x514910771af9ca656af840dff83e8264ecf986ca.png',
    aggregators: [
      'Aave',
      'Bancor',
      'CMC',
      'Crypto.com',
      'CoinGecko',
      '1inch',
      'Paraswap',
      'PMM',
      'Zapper',
      'Zerion',
      '0x',
    ],
  },
  {
    address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
    symbol: 'BNT',
    decimals: 18,
    occurrences: 11,
    name: 'Bancor',
    iconUrl:
      'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c.png',
    aggregators: [
      'Bancor',
      'CMC',
      'CoinGecko',
      '1inch',
      'Paraswap',
      'PMM',
      'Zapper',
      'Zerion',
      '0x',
    ],
  },
];

const sampleMainnetTokensChainsCache = sampleMainnetTokenList.reduce(
  (output, current) => {
    output[current.address] = current;
    return output;
  },
  {} as TokenListMap,
);

const sampleBinanceTokenList = [
  {
    address: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
    symbol: 'DOT',
    decimals: 18,
    name: 'PolkadotBEP2',
    occurrences: 5,
    aggregators: [
      'BinanceDex',
      '1inch',
      'PancakeExtended',
      'ApeSwap',
      'Paraswap',
    ],
    iconUrl:
      'https://static.cx.metamask.io/api/v1/tokenIcons/56/0x7083609fce4d1d8dc0c979aab8c869ea2c873402.png',
  },
  {
    address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    symbol: 'DAI',
    decimals: 18,
    name: 'DaiBEP2',
    occurrences: 5,
    aggregators: [
      'BinanceDex',
      '1inch',
      'PancakeExtended',
      'ApeSwap',
      '0x',
      'Paraswap',
    ],
    iconUrl:
      'https://static.cx.metamask.io/api/v1/tokenIcons/56/0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3.png',
  },
];

const sampleBinanceTokensChainsCache = sampleBinanceTokenList.reduce(
  (output, current) => {
    output[current.address] = current;
    return output;
  },
  {} as TokenListMap,
);

const sampleSingleChainState = {
  tokenList: {
    '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': {
      address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      symbol: 'SNX',
      decimals: 18,
      occurrences: 11,
      name: 'Synthetix',
      iconUrl:
        'https://static.cx.metamask.io/api/v1/tokenIcons/1/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png',
      aggregators: [
        'Aave',
        'Bancor',
        'CMC',
        'Crypto.com',
        'CoinGecko',
        '1inch',
        'Paraswap',
        'PMM',
        'Synthetix',
        'Zapper',
        'Zerion',
        '0x',
      ],
    },
    '0x514910771af9ca656af840dff83e8264ecf986ca': {
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      symbol: 'LINK',
      decimals: 18,
      occurrences: 11,
      name: 'Chainlink',
      iconUrl:
        'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x514910771af9ca656af840dff83e8264ecf986ca.png',
      aggregators: [
        'Aave',
        'Bancor',
        'CMC',
        'Crypto.com',
        'CoinGecko',
        '1inch',
        'Paraswap',
        'PMM',
        'Zapper',
        'Zerion',
        '0x',
      ],
    },
    '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c': {
      address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
      symbol: 'BNT',
      decimals: 18,
      occurrences: 11,
      name: 'Bancor',
      iconUrl:
        'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c.png',
      aggregators: [
        'Bancor',
        'CMC',
        'CoinGecko',
        '1inch',
        'Paraswap',
        'PMM',
        'Zapper',
        'Zerion',
        '0x',
      ],
    },
  },
  tokensChainsCache: {
    [toHex(1)]: {
      timestamp,
      data: sampleMainnetTokensChainsCache,
    },
  },
};

const sampleSepoliaTokenList = [
  {
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    symbol: 'WBTC',
    decimals: 8,
    name: 'Wrapped BTC',
    iconUrl:
      'https://static.cx.metamask.io/api/v1/tokenIcons/11155111/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png',
    type: 'erc20',
    aggregators: [
      'Metamask',
      'Aave',
      'Bancor',
      'Cmc',
      'Cryptocom',
      'CoinGecko',
      'OneInch',
      'Pmm',
      'Sushiswap',
      'Zerion',
      'Lifi',
      'Openswap',
      'Sonarwatch',
      'UniswapLabs',
      'Coinmarketcap',
    ],
    occurrences: 15,
    fees: {},
    storage: {
      balance: 0,
    },
  },
  {
    address: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
    symbol: 'UMA',
    decimals: 18,
    name: 'UMA',
    iconUrl:
      'https://static.cx.metamask.io/api/v1/tokenIcons/11155111/0x04fa0d235c4abf4bcf4787af4cf447de572ef828.png',
    type: 'erc20',
    aggregators: [
      'Metamask',
      'Bancor',
      'CMC',
      'Crypto.com',
      'CoinGecko',
      '1inch',
      'PMM',
      'Sushiswap',
      'Zerion',
      'Openswap',
      'Sonarwatch',
      'UniswapLabs',
      'Coinmarketcap',
    ],
    occurrences: 13,
    fees: {},
  },
  {
    address: '0x6810e776880c02933d47db1b9fc05908e5386b96',
    symbol: 'GNO',
    decimals: 18,
    name: 'Gnosis Token',
    iconUrl:
      'https://static.cx.metamask.io/api/v1/tokenIcons/11155111/0x6810e776880c02933d47db1b9fc05908e5386b96.png',
    type: 'erc20',
    aggregators: [
      'Metamask',
      'Bancor',
      'CMC',
      'CoinGecko',
      '1inch',
      'Sushiswap',
      'Zerion',
      'Lifi',
      'Openswap',
      'Sonarwatch',
      'UniswapLabs',
      'Coinmarketcap',
    ],
    occurrences: 12,
    fees: {},
  },
];

const sampleSepoliaTokensChainCache = sampleSepoliaTokenList.reduce(
  (output, current) => {
    output[current.address] = current;
    return output;
  },
  {} as TokenListMap,
);

const sampleTwoChainState = {
  tokenList: {
    '0x7083609fce4d1d8dc0c979aab8c869ea2c873402': {
      address: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
      symbol: 'DOT',
      decimals: 18,
      name: 'PolkadotBEP2',
      occurrences: 5,
      aggregators: [
        'BinanceDex',
        '1inch',
        'PancakeExtended',
        'ApeSwap',
        'Paraswap',
      ],
      iconUrl:
        'https://static.cx.metamask.io/api/v1/tokenIcons/56/0x7083609fce4d1d8dc0c979aab8c869ea2c873402.png',
    },
    '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3': {
      address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      symbol: 'DAI',
      decimals: 18,
      name: 'DaiBEP2',
      occurrences: 5,
      aggregators: [
        'BinanceDex',
        '1inch',
        'PancakeExtended',
        'ApeSwap',
        '0x',
        'Paraswap',
      ],
      iconUrl:
        'https://static.cx.metamask.io/api/v1/tokenIcons/56/0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3.png',
    },
  },
  tokensChainsCache: {
    [toHex(1)]: {
      timestamp,
      data: sampleMainnetTokensChainsCache,
    },
    [toHex(56)]: {
      timestamp: timestamp + 150,
      data: sampleBinanceTokensChainsCache,
    },
  },
};

const existingState = {
  tokenList: {
    '0x514910771af9ca656af840dff83e8264ecf986ca': {
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      symbol: 'LINK',
      decimals: 18,
      occurrences: 11,
      name: 'Chainlink',
      iconUrl:
        'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x514910771af9ca656af840dff83e8264ecf986ca.png',
      aggregators: [
        'Aave',
        'Bancor',
        'CMC',
        'Crypto.com',
        'CoinGecko',
        '1inch',
        'Paraswap',
        'PMM',
        'Zapper',
        'Zerion',
        '0x',
      ],
    },
  },
  tokensChainsCache: {
    [toHex(1)]: {
      timestamp,
      data: sampleMainnetTokensChainsCache,
    },
  },
  preventPollingOnNetworkRestart: false,
};

const outdatedExistingState = {
  tokenList: {
    '0x514910771af9ca656af840dff83e8264ecf986ca': {
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      symbol: 'LINK',
      decimals: 18,
      occurrences: 11,
      name: 'Chainlink',
      iconUrl:
        'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x514910771af9ca656af840dff83e8264ecf986ca.png',
      aggregators: [
        'Aave',
        'Bancor',
        'CMC',
        'Crypto.com',
        'CoinGecko',
        '1inch',
        'Paraswap',
        'PMM',
        'Zapper',
        'Zerion',
        '0x',
      ],
    },
  },
  tokensChainsCache: {
    [toHex(1)]: {
      timestamp,
      data: sampleMainnetTokensChainsCache,
    },
  },
  preventPollingOnNetworkRestart: false,
};

const expiredCacheExistingState: TokenListState = {
  tokensChainsCache: {
    [toHex(1)]: {
      timestamp: timestamp - 86400000,
      data: {
        '0x514910771af9ca656af840dff83e8264ecf986ca': {
          address: '0x514910771af9ca656af840dff83e8264ecf986ca',
          symbol: 'LINK',
          decimals: 18,
          occurrences: 11,
          name: 'Chainlink',
          iconUrl:
            'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x514910771af9ca656af840dff83e8264ecf986ca.png',
          aggregators: [
            'Aave',
            'Bancor',
            'CMC',
            'Crypto.com',
            'CoinGecko',
            '1inch',
            'Paraswap',
            'PMM',
            'Zapper',
            'Zerion',
            '0x',
          ],
        },
      },
    },
  },
  preventPollingOnNetworkRestart: false,
};

type MainMessenger = Messenger<
  ExtractAvailableAction<TokenListControllerMessenger>,
  ExtractAvailableEvent<TokenListControllerMessenger>
>;

const getMessenger = (): MainMessenger => {
  return new Messenger();
};

const getRestrictedMessenger = (messenger: MainMessenger) => {
  return messenger.getRestricted({
    name,
    allowedActions: ['NetworkController:getNetworkClientById'],
    allowedEvents: ['NetworkController:stateChange'],
  });
};

describe('TokenListController', () => {
  afterEach(() => {
    jest.clearAllTimers();
    sinon.restore();
  });

  it('should set default state', async () => {
    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      messenger: restrictedMessenger,
    });

    expect(controller.state).toStrictEqual({
      tokensChainsCache: {},
      preventPollingOnNetworkRestart: false,
    });

    controller.destroy();
    messenger.clearEventSubscriptions('NetworkController:stateChange');
  });

  it('should initialize with initial state', () => {
    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      messenger: restrictedMessenger,
      state: existingState,
    });
    expect(controller.state).toStrictEqual({
      tokenList: {
        '0x514910771af9ca656af840dff83e8264ecf986ca': {
          address: '0x514910771af9ca656af840dff83e8264ecf986ca',
          symbol: 'LINK',
          decimals: 18,
          occurrences: 11,
          name: 'Chainlink',
          iconUrl:
            'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x514910771af9ca656af840dff83e8264ecf986ca.png',
          aggregators: [
            'Aave',
            'Bancor',
            'CMC',
            'Crypto.com',
            'CoinGecko',
            '1inch',
            'Paraswap',
            'PMM',
            'Zapper',
            'Zerion',
            '0x',
          ],
        },
      },
      tokensChainsCache: {
        [toHex(1)]: {
          timestamp,
          data: sampleMainnetTokensChainsCache,
        },
      },
      preventPollingOnNetworkRestart: false,
    });

    controller.destroy();
    messenger.clearEventSubscriptions('NetworkController:stateChange');
  });

  it('should initiate without preventPollingOnNetworkRestart', async () => {
    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      messenger: restrictedMessenger,
    });

    expect(controller.state).toStrictEqual({
      tokensChainsCache: {},
      preventPollingOnNetworkRestart: false,
    });

    controller.destroy();
  });

  it('should not poll before being started', async () => {
    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      interval: 100,
      messenger: restrictedMessenger,
    });

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 150));

    expect(controller.state.tokensChainsCache).toStrictEqual({});
    controller.destroy();
  });

  it('should update tokensChainsCache state when network updates are passed via onNetworkStateChange callback', async () => {
    nock(tokenService.TOKEN_END_POINT_API)
      .get(getTokensPath(ChainId.mainnet))
      .reply(200, sampleMainnetTokenList)
      .persist();

    jest.spyOn(Date, 'now').mockImplementation(() => 100);
    const selectedNetworkClientId = 'selectedNetworkClientId';
    const messenger = getMessenger();
    const getNetworkClientById = buildMockGetNetworkClientById({
      [selectedNetworkClientId]: buildCustomNetworkClientConfiguration({
        chainId: toHex(1337),
      }),
    });
    messenger.registerActionHandler(
      'NetworkController:getNetworkClientById',
      getNetworkClientById,
    );
    const restrictedMessenger = getRestrictedMessenger(messenger);
    let onNetworkStateChangeCallback!: (state: NetworkState) => void;
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      onNetworkStateChange: (cb) => (onNetworkStateChangeCallback = cb),
      preventPollingOnNetworkRestart: false,
      interval: 100,
      messenger: restrictedMessenger,
    });
    // TODO: Either fix this lint violation or explain why it's necessary to ignore.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    controller.start();
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 150));
    onNetworkStateChangeCallback({
      selectedNetworkClientId,
      networkConfigurationsByChainId: {},
      networksMetadata: {},
      // @ts-expect-error This property isn't used and will get removed later.
      providerConfig: {},
    });
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));

    expect(controller.state.tokensChainsCache).toStrictEqual({
      '0x1': {
        timestamp: 100,
        data: {
          '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': {
            address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
            symbol: 'SNX',
            decimals: 18,
            occurrences: 11,
            name: 'Synthetix',
            iconUrl:
              'https://static.cx.metamask.io/api/v1/tokenIcons/1/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png',
            aggregators: [
              'Aave',
              'Bancor',
              'CMC',
              'Crypto.com',
              'CoinGecko',
              '1inch',
              'Paraswap',
              'PMM',
              'Synthetix',
              'Zapper',
              'Zerion',
              '0x',
            ],
          },
          '0x514910771af9ca656af840dff83e8264ecf986ca': {
            address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            symbol: 'LINK',
            decimals: 18,
            occurrences: 11,
            name: 'Chainlink',
            iconUrl:
              'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x514910771af9ca656af840dff83e8264ecf986ca.png',
            aggregators: [
              'Aave',
              'Bancor',
              'CMC',
              'Crypto.com',
              'CoinGecko',
              '1inch',
              'Paraswap',
              'PMM',
              'Zapper',
              'Zerion',
              '0x',
            ],
          },
          '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c': {
            address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
            symbol: 'BNT',
            decimals: 18,
            occurrences: 11,
            name: 'Bancor',
            iconUrl:
              'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c.png',
            aggregators: [
              'Bancor',
              'CMC',
              'CoinGecko',
              '1inch',
              'Paraswap',
              'PMM',
              'Zapper',
              'Zerion',
              '0x',
            ],
          },
        },
      },
      '0x539': { timestamp: 100, data: {} },
    });
    controller.destroy();
  });

  it('should poll and update rate in the right interval', async () => {
    const tokenListMock = sinon.stub(
      TokenListController.prototype,
      'fetchTokenList',
    );

    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      interval: 100,
      messenger: restrictedMessenger,
    });
    await controller.start();

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1));
    expect(tokenListMock.called).toBe(true);
    expect(tokenListMock.calledTwice).toBe(false);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 150));
    expect(tokenListMock.calledTwice).toBe(true);

    controller.destroy();
  });

  it('should not poll after being stopped', async () => {
    const tokenListMock = sinon.stub(
      TokenListController.prototype,
      'fetchTokenList',
    );

    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      interval: 100,
      messenger: restrictedMessenger,
    });
    await controller.start();
    controller.stop();

    // called once upon initial start
    expect(tokenListMock.called).toBe(true);
    expect(tokenListMock.calledTwice).toBe(false);

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 150));
    expect(tokenListMock.calledTwice).toBe(false);

    controller.destroy();
  });

  it('should poll correctly after being started, stopped, and started again', async () => {
    const tokenListMock = sinon.stub(
      TokenListController.prototype,
      'fetchTokenList',
    );

    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);

    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      interval: 100,
      messenger: restrictedMessenger,
    });
    await controller.start();
    controller.stop();

    // called once upon initial start
    expect(tokenListMock.called).toBe(true);
    expect(tokenListMock.calledTwice).toBe(false);

    await controller.start();

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1));
    expect(tokenListMock.calledTwice).toBe(true);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 150));
    expect(tokenListMock.calledThrice).toBe(true);
    controller.destroy();
  });

  it('should call fetchTokenList on network that supports token detection', async () => {
    const tokenListMock = sinon.stub(
      TokenListController.prototype,
      'fetchTokenList',
    );

    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      interval: 100,
      messenger: restrictedMessenger,
    });
    await controller.start();
    controller.stop();

    // called once upon initial start
    expect(tokenListMock.called).toBe(true);
    controller.destroy();
  });

  it('should not call fetchTokenList on network that does not support token detection', async () => {
    const tokenListMock = sinon.stub(
      TokenListController.prototype,
      'fetchTokenList',
    );

    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.sepolia,
      preventPollingOnNetworkRestart: false,
      interval: 100,
      messenger: restrictedMessenger,
    });
    await controller.start();
    controller.stop();

    // called once upon initial start
    expect(tokenListMock.called).toBe(false);

    controller.destroy();
    tokenListMock.restore();
  });

  it('should update tokensChainsCache from api', async () => {
    nock(tokenService.TOKEN_END_POINT_API)
      .get(getTokensPath(ChainId.mainnet))
      .reply(200, sampleMainnetTokenList)
      .persist();

    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      messenger: restrictedMessenger,
      interval: 750,
    });
    await controller.start();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(
        controller.state.tokensChainsCache[ChainId.mainnet].data,
      ).toStrictEqual(
        sampleSingleChainState.tokensChainsCache[ChainId.mainnet].data,
      );

      expect(
        controller.state.tokensChainsCache[ChainId.mainnet].timestamp,
      ).toBeGreaterThanOrEqual(
        sampleSingleChainState.tokensChainsCache[ChainId.mainnet].timestamp,
      );
      controller.destroy();
    } finally {
      controller.destroy();
    }
  });

  it('should update the cache before threshold time if the current data is undefined', async () => {
    nock(tokenService.TOKEN_END_POINT_API)
      .get(getTokensPath(ChainId.mainnet))
      .once()
      .reply(200, undefined);

    nock(tokenService.TOKEN_END_POINT_API)
      .get(getTokensPath(ChainId.mainnet))
      .reply(200, sampleMainnetTokenList)
      .persist();

    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      messenger: restrictedMessenger,
      interval: 100,
      state: existingState,
    });
    const pollingToken = controller.startPolling({ chainId: ChainId.mainnet });
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 150));
    expect(controller.state.tokensChainsCache[toHex(1)].data).toStrictEqual(
      sampleSingleChainState.tokensChainsCache[toHex(1)].data,
    );
    controller.stopPollingByPollingToken(pollingToken);
  });

  it('should update token list when the token property changes', async () => {
    nock(tokenService.TOKEN_END_POINT_API)
      .get(getTokensPath(ChainId.mainnet))
      .reply(200, sampleMainnetTokenList)
      .persist();

    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      messenger: restrictedMessenger,
      state: outdatedExistingState,
    });
    expect(controller.state).toStrictEqual(outdatedExistingState);
    await controller.start();

    expect(
      controller.state.tokensChainsCache[ChainId.mainnet].data,
    ).toStrictEqual(
      sampleSingleChainState.tokensChainsCache[ChainId.mainnet].data,
    );
    controller.destroy();
  });

  it('should update the cache when the timestamp expires', async () => {
    nock(tokenService.TOKEN_END_POINT_API)
      .get(getTokensPath(ChainId.mainnet))
      .reply(200, sampleMainnetTokenList)
      .persist();

    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      messenger: restrictedMessenger,
      state: expiredCacheExistingState,
    });
    expect(controller.state).toStrictEqual(expiredCacheExistingState);
    await controller.start();
    expect(
      controller.state.tokensChainsCache[ChainId.mainnet].timestamp,
    ).toBeGreaterThan(
      sampleSingleChainState.tokensChainsCache[ChainId.mainnet].timestamp,
    );

    expect(
      controller.state.tokensChainsCache[ChainId.mainnet].data,
    ).toStrictEqual(
      sampleSingleChainState.tokensChainsCache[ChainId.mainnet].data,
    );
    controller.destroy();
  });

  it('should update tokensChainsCache when the chainId change', async () => {
    nock(tokenService.TOKEN_END_POINT_API)
      .get(getTokensPath(ChainId.mainnet))
      .reply(200, sampleMainnetTokenList)
      .get(getTokensPath(ChainId.sepolia))
      .reply(200, {
        error: `ChainId ${convertHexToDecimal(ChainId.sepolia)} is not supported`,
      })
      .get(getTokensPath(toHex(56)))
      .reply(200, sampleBinanceTokenList)
      .persist();
    const selectedCustomNetworkClientId = 'selectedCustomNetworkClientId';
    const messenger = getMessenger();
    const getNetworkClientById = buildMockGetNetworkClientById({
      [InfuraNetworkType.sepolia]: buildInfuraNetworkClientConfiguration(
        InfuraNetworkType.sepolia,
      ),
      [selectedCustomNetworkClientId]: buildCustomNetworkClientConfiguration({
        chainId: toHex(56),
      }),
    });
    messenger.registerActionHandler(
      'NetworkController:getNetworkClientById',
      getNetworkClientById,
    );
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      messenger: restrictedMessenger,
      state: existingState,
      interval: 100,
    });
    expect(controller.state).toStrictEqual(existingState);
    await controller.start();

    expect(
      controller.state.tokensChainsCache[ChainId.mainnet].data,
    ).toStrictEqual(
      sampleTwoChainState.tokensChainsCache[ChainId.mainnet].data,
    );

    messenger.publish(
      'NetworkController:stateChange',
      {
        selectedNetworkClientId: InfuraNetworkType.sepolia,
        networkConfigurationsByChainId: {},
        networksMetadata: {},
        // @ts-expect-error This property isn't used and will get removed later.
        providerConfig: {},
      },
      [],
    );

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));

    expect(
      controller.state.tokensChainsCache[ChainId.mainnet].data,
    ).toStrictEqual(
      sampleTwoChainState.tokensChainsCache[ChainId.mainnet].data,
    );

    messenger.publish(
      'NetworkController:stateChange',
      {
        selectedNetworkClientId: selectedCustomNetworkClientId,
        networkConfigurationsByChainId: {},
        networksMetadata: {},
        // @ts-expect-error This property isn't used and will get removed later.
        providerConfig: {},
      },
      [],
    );

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));

    expect(
      controller.state.tokensChainsCache[ChainId.mainnet].data,
    ).toStrictEqual(
      sampleTwoChainState.tokensChainsCache[ChainId.mainnet].data,
    );

    expect(controller.state.tokensChainsCache[toHex(56)].data).toStrictEqual(
      sampleTwoChainState.tokensChainsCache[toHex(56)].data,
    );

    controller.destroy();
  });

  it('should clear the tokenList and tokensChainsCache', async () => {
    const messenger = getMessenger();
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.mainnet,
      preventPollingOnNetworkRestart: false,
      messenger: restrictedMessenger,
      state: existingState,
    });
    expect(controller.state).toStrictEqual(existingState);
    controller.clearingTokenListData();

    expect(controller.state.tokensChainsCache).toStrictEqual({});

    controller.destroy();
  });

  it('should update preventPollingOnNetworkRestart and restart the polling on network restart', async () => {
    nock(tokenService.TOKEN_END_POINT_API)
      .get(getTokensPath(ChainId.mainnet))
      .reply(200, sampleMainnetTokenList)
      .get(getTokensPath(ChainId.sepolia))
      .reply(200, {
        error: `ChainId ${convertHexToDecimal(ChainId.sepolia)} is not supported`,
      })
      .get(getTokensPath(toHex(56)))
      .reply(200, sampleBinanceTokenList)
      .persist();

    const selectedCustomNetworkClientId = 'selectedCustomNetworkClientId';
    const messenger = getMessenger();
    const getNetworkClientById = buildMockGetNetworkClientById({
      [InfuraNetworkType.mainnet]: buildInfuraNetworkClientConfiguration(
        InfuraNetworkType.mainnet,
      ),
      [selectedCustomNetworkClientId]: buildCustomNetworkClientConfiguration({
        chainId: toHex(56),
      }),
    });
    messenger.registerActionHandler(
      'NetworkController:getNetworkClientById',
      getNetworkClientById,
    );
    const restrictedMessenger = getRestrictedMessenger(messenger);
    const controller = new TokenListController({
      chainId: ChainId.sepolia,
      preventPollingOnNetworkRestart: true,
      messenger: restrictedMessenger,
      interval: 100,
    });
    await controller.start();
    messenger.publish(
      'NetworkController:stateChange',
      {
        selectedNetworkClientId: InfuraNetworkType.mainnet,
        networkConfigurationsByChainId: {},
        networksMetadata: {},
        // @ts-expect-error This property isn't used and will get removed later.
        providerConfig: {},
      },
      [],
    );

    expect(controller.state).toStrictEqual({
      tokensChainsCache: {},
      preventPollingOnNetworkRestart: true,
    });
    controller.updatePreventPollingOnNetworkRestart(false);
    expect(controller.state).toStrictEqual({
      tokensChainsCache: {},
      preventPollingOnNetworkRestart: false,
    });
  });

  describe('startPolling', () => {
    let clock: sinon.SinonFakeTimers;
    const pollingIntervalTime = 1000;
    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should call fetchTokenListByChainId with the correct chainId', async () => {
      nock(tokenService.TOKEN_END_POINT_API)
        .get(getTokensPath(ChainId.sepolia))
        .reply(200, sampleSepoliaTokenList)
        .persist();

      const fetchTokenListByChainIdSpy = jest.spyOn(
        tokenService,
        'fetchTokenListByChainId',
      );
      const messenger = getMessenger();
      messenger.registerActionHandler(
        'NetworkController:getNetworkClientById',
        jest.fn().mockReturnValue({
          configuration: {
            type: NetworkType.sepolia,
            chainId: ChainId.sepolia,
          },
        }),
      );
      const restrictedMessenger = getRestrictedMessenger(messenger);
      const controller = new TokenListController({
        chainId: ChainId.mainnet,
        preventPollingOnNetworkRestart: false,
        messenger: restrictedMessenger,
        state: expiredCacheExistingState,
        interval: pollingIntervalTime,
      });

      controller.startPolling({ chainId: ChainId.sepolia });
      await advanceTime({ clock, duration: 0 });

      expect(fetchTokenListByChainIdSpy.mock.calls[0]).toStrictEqual(
        expect.arrayContaining([ChainId.sepolia]),
      );
    });

    it('should update tokenList state and tokensChainsCache', async () => {
      const startingState: TokenListState = {
        tokensChainsCache: {},
        preventPollingOnNetworkRestart: false,
      };

      const fetchTokenListByChainIdSpy = jest
        .spyOn(tokenService, 'fetchTokenListByChainId')
        .mockImplementation(async (chainId) => {
          switch (chainId) {
            case ChainId.sepolia:
              return sampleSepoliaTokenList;
            case toHex(56):
              return sampleBinanceTokenList;
            default:
              throw new Error('Invalid chainId');
          }
        });

      const messenger = getMessenger();
      messenger.registerActionHandler(
        'NetworkController:getNetworkClientById',
        jest.fn().mockImplementation((networkClientId) => {
          switch (networkClientId) {
            case 'sepolia':
              return {
                configuration: {
                  type: NetworkType.sepolia,
                  chainId: ChainId.sepolia,
                },
              };
            case 'binance-network-client-id':
              return {
                configuration: {
                  type: NetworkType.rpc,
                  chainId: toHex(56),
                },
              };
            default:
              throw new Error('Invalid networkClientId');
          }
        }),
      );
      const restrictedMessenger = getRestrictedMessenger(messenger);
      const controller = new TokenListController({
        chainId: ChainId.sepolia,
        preventPollingOnNetworkRestart: false,
        messenger: restrictedMessenger,
        state: startingState,
        interval: pollingIntervalTime,
      });

      expect(controller.state).toStrictEqual(startingState);

      // start polling for sepolia
      const pollingToken = controller.startPolling({
        chainId: ChainId.sepolia,
      });

      // wait a polling interval
      await advanceTime({ clock, duration: pollingIntervalTime });

      expect(fetchTokenListByChainIdSpy).toHaveBeenCalledTimes(1);

      expect(controller.state.tokensChainsCache).toStrictEqual({
        [ChainId.sepolia]: {
          timestamp: expect.any(Number),
          data: sampleSepoliaTokensChainCache,
        },
      });
      controller.stopPollingByPollingToken(pollingToken);

      // start polling for binance
      controller.startPolling({
        chainId: '0x38',
      });
      await advanceTime({ clock, duration: pollingIntervalTime });

      // expect fetchTokenListByChain to be called for binance, but not for sepolia
      // because the cache for the recently fetched sepolia token list is still valid
      expect(fetchTokenListByChainIdSpy).toHaveBeenCalledTimes(2);

      // once we adopt this polling pattern we should no longer access the root tokenList state
      // but rather access from the cache with a chainId selector.
      expect(controller.state.tokensChainsCache).toStrictEqual({
        [toHex(56)]: {
          timestamp: expect.any(Number),
          data: sampleBinanceTokensChainsCache,
        },
        [ChainId.sepolia]: {
          timestamp: expect.any(Number),
          data: sampleSepoliaTokensChainCache,
        },
      });
    });
  });
});

/**
 * Construct the path used to fetch tokens that we can pass to `nock`.
 *
 * @param chainId - The chain ID.
 * @returns The constructed path.
 */
function getTokensPath(chainId: Hex) {
  // TODO: Either fix this lint violation or explain why it's necessary to ignore.
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return `/tokens/${convertHexToDecimal(
    chainId,
  )}?occurrenceFloor=3&includeNativeAssets=false&includeTokenFees=false&includeAssetType=false&includeERC20Permit=false&includeStorage=false`;
}
