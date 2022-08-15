import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const BAS_MAIN_CHAINID = ChainId.BAS
// export const BAS_MAINNET = process.env.NODE_ENV === 'development' ? getLocalRPC(BAS_MAIN_CHAINID, useNode) : getLocalRPC(BAS_MAIN_CHAINID, 'https://bscnode1.anyswap.exchange')
// export const BAS_MAIN_EXPLORER = 'https://bscscan.com'

export const BAS_TEST_CHAINID = ChainId.BAS_TEST
export const BAS_TESTNET = getLocalRPC(BAS_TEST_CHAINID, 'https://rpc.dev-01.bas.ankr.com/')
export const BAS_TEST_EXPLORER = 'https://explorer.dev-01.bas.ankr.com/'

export const testTokenList = []

const symbol = 'BAS'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V1_1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V2]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V2_1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V2_2]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V2_T1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V3_1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V4_MOVR]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V7_TEST]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V7_BAS_TEST]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [BAS_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  //   // multicalToken: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  //   multicalToken: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  //   nodeRpc: BAS_MAINNET,
  //   nodeRpcList: [
    
  //   ],
  //   chainID: BAS_MAIN_CHAINID,
  //   lookHash: BAS_MAIN_EXPLORER + '/tx/',
  //   lookAddr: BAS_MAIN_EXPLORER + '/address/',
  //   lookBlock: BAS_MAIN_EXPLORER + '/block/',
  //   explorer: BAS_MAIN_EXPLORER,
  //   symbol: symbol,
  //   symbolName: 'Binance',
  //   name: 'BAS CHAIN',
  //   networkName: 'BAS CHAIN mainnet',
  //   type: 'main',
  //   label: BAS_MAIN_CHAINID,
  // },
  [BAS_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: BAS_TESTNET,
    nodeRpcList: [
      BAS_TESTNET
    ],
    chainID: BAS_TEST_CHAINID,
    lookHash: BAS_TEST_EXPLORER + '/tx/',
    lookAddr: BAS_TEST_EXPLORER + '/address/',
    lookBlock: BAS_TEST_EXPLORER + '/block/',
    explorer: BAS_TEST_EXPLORER,
    symbol: symbol,
    name: 'BAS',
    networkName: 'BAS testnet',
    type: 'test',
    label: BAS_TEST_CHAINID,
  }
}