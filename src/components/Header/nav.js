import config from '../../config'

export const LinkList = [
  {
    path: '/multi',
    textKey: 'MULTI',
    regex: /\/multi/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenMerge,
  },
  {
    path: '/router',
    textKey: 'router',
    regex: /\/router/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenMerge,
  },
  {
    path: '/cross-chain-txns',
    textKey: 'swap',
    regex: /\/cross-chain-txns/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenRouterTxns
  },
  {
    path: '/pool',
    textKey: 'pool',
    regex: /\/pool/,
    className: 'otherInfo',
    isOutLink: false,
    isView: 1,
    isActive: ['/add', '/remove']
  },
  {
    path: '/vest',
    textKey: 'veMULTI',
    regex: /\/vest/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenMerge && Date.now() > 1652090400000 ? true : false,
    // isView: config.getCurConfigInfo().isOpenMerge && Date.now() > 1652077736000 ? true : false,
  },
  {
    path: '/v1/router',
    textKey: 'router',
    regex: /\/v1\/router/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenRouter
  },
  {
    path: '/bridge',
    textKey: 'bridge',
    regex: /\/bridge/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenBridge
  },
  {
    path: '/nft',
    textKey: 'nftrouter',
    regex: /\/nft/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenNFT,
  },
  // {
  //   path: '/farm',
  //   textKey: 'farms',
  //   regex: '',
  //   className: 'otherInfo',
  //   isOutLink: false,
  //   isView: 1,
  // },
  // {
  //   path: '/dashboard',
  //   textKey: 'dashboard',
  //   regex: /\/dashboard/,
  //   className: 'otherInfo',
  //   isOutLink: false,
  //   isView: 1
  // },
  {
    path: config.explorer,
    textKey: 'explorer',
    regex: '',
    className: 'otherInfo',
    isOutLink: true,
    isView: 1,
  },
  {
    path: 'https://multichain.zendesk.com/hc/en-us',
    textKey: 'support',
    regex: '',
    className: 'otherInfo',
    isOutLink: true,
    isView: 1,
  },
]