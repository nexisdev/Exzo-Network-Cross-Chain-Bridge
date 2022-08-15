import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const BTT_MAIN_CHAINID = ChainId.BTT
export const BTT_MAINNET = getLocalRPC(BTT_MAIN_CHAINID, 'https://rpc.bt.io/')
export const BTT_MAIN_EXPLORER = 'https://bttcscan.com'


const symbol = 'BTT'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [BTT_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: BTT_MAINNET,
    nodeRpcList: [
      BTT_MAINNET,
    ],
    chainID: BTT_MAIN_CHAINID,
    lookHash: BTT_MAIN_EXPLORER + '/tx/',
    lookAddr: BTT_MAIN_EXPLORER + '/address/',
    lookBlock: BTT_MAIN_EXPLORER + '/block/',
    explorer: BTT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'BitTorrent',
    networkName: 'BitTorrent mainnet',
    type: 'main',
    label: BTT_MAIN_CHAINID,
  },
}