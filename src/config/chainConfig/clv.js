import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const CLV_MAIN_CHAINID = ChainId.CLV
export const CLV_MAINNET = getLocalRPC(CLV_MAIN_CHAINID, 'https://api-para.clover.finance')
export const CLV_MAIN_EXPLORER = 'https://clvscan.com'

export const testTokenList = []

const symbol = 'CLV'

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
    nativeToken: '0x1376c97c5c512d2d6f9173a9a3a016b6140b4536',
    crossBridgeInitToken: '0x1376c97c5c512d2d6f9173a9a3a016b6140b4536'
  },
}

export default {
  [CLV_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x59346C1143d1dFCa87F4570d4FC4f27c674a1593',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: CLV_MAINNET,
    nodeRpcList: [
      CLV_MAINNET,
    ],
    chainID: CLV_MAIN_CHAINID,
    lookHash: CLV_MAIN_EXPLORER + '/tx/',
    lookAddr: CLV_MAIN_EXPLORER + '/address/',
    lookBlock: CLV_MAIN_EXPLORER + '/block/',
    explorer: CLV_MAIN_EXPLORER,
    symbol: symbol,
    name: 'CLV Parachain',
    networkName: 'CLV Parachain mainnet',
    type: 'main',
    label: CLV_MAIN_CHAINID,
  },
}