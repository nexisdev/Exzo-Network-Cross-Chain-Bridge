
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const BTC_MAINNET = ''
export const BTC_MAIN_CHAINID = ChainId.BTC
export const BTC_MAIN_EXPLORER = ''

const symbol = 'BTC'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [BTC_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: BTC_MAINNET,
    chainID: BTC_MAIN_CHAINID,
    lookHash: BTC_MAIN_EXPLORER + '/tx/',
    lookAddr: BTC_MAIN_EXPLORER + '/address/',
    lookBlock: BTC_MAIN_EXPLORER + '/block/',
    explorer: BTC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Bitcoin',
    networkName: 'Bitcoin mainnet',
    type: 'main',
    label: BTC_MAIN_CHAINID,
    chainType: 'BTC'
  },
}