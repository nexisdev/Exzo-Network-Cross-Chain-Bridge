import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const CELO_MAIN_CHAINID = ChainId.CELO
export const CELO_MAINNET = getLocalRPC(CELO_MAIN_CHAINID, 'https://forno.celo.org')
export const CELO_MAIN_EXPLORER = 'https://explorer.celo.org'

export const testTokenList = []

const symbol = 'CELO'

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
    bridgeInitToken: '0xa649325aa7c5093d12d6f98eb4378deae68ce23f',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0xa649325aa7c5093d12d6f98eb4378deae68ce23f'
  },
}

export default {
  [CELO_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: CELO_MAINNET,
    nodeRpcList: [
      CELO_MAINNET,
    ],
    chainID: CELO_MAIN_CHAINID,
    lookHash: CELO_MAIN_EXPLORER + '/tx/',
    lookAddr: CELO_MAIN_EXPLORER + '/address/',
    lookBlock: CELO_MAIN_EXPLORER + '/block/',
    explorer: CELO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Celo',
    networkName: 'Celo mainnet',
    type: 'main',
    label: CELO_MAIN_CHAINID,
  },
}