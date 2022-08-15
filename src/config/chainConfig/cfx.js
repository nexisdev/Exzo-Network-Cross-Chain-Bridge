import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const CFX_MAIN_CHAINID = ChainId.CFX
export const CFX_MAINNET = getLocalRPC(CFX_MAIN_CHAINID, 'https://evm.confluxrpc.com')
export const CFX_MAIN_EXPLORER = 'https://evm.confluxscan.io'

export const testTokenList = []

const symbol = 'CFX'

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
    nativeToken: '0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b',
    crossBridgeInitToken: ''
  },
}

export default {
  [CFX_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xAe8E9F3EA6a5b462b0Ae29aa1a3F6aC072365d9d',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: CFX_MAINNET,
    nodeRpcList: [
      CFX_MAINNET,
    ],
    chainID: CFX_MAIN_CHAINID,
    lookHash: CFX_MAIN_EXPLORER + '/tx/',
    lookAddr: CFX_MAIN_EXPLORER + '/address/',
    lookBlock: CFX_MAIN_EXPLORER + '/block/',
    explorer: CFX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Conflux eSpace',
    networkName: 'Conflux eSpace mainnet',
    type: 'main',
    label: CFX_MAIN_CHAINID,
  },
}