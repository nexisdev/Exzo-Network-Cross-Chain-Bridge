import React from 'react'
import CrossChainBTC from './crossChainBTC'
import CrossChainEVM from './crossChainEVM'
import CrossChainNonEVM from './crossChainNonEVM'

// import TxnsDtilsModal from './txnsDtilsModal'
// import TxnsListModal from './txnsListModal'

import { useUserSelectChainId } from '../../state/user/hooks'

function CrossChainView ({
  bridgeKey
}: {
  bridgeKey: any
}) {
  const {selectNetworkInfo} = useUserSelectChainId()
  // console.log(selectNetworkInfo)
  if (selectNetworkInfo?.label === 'BTC') {
    return (
      <>
        <CrossChainBTC bridgeKey={bridgeKey} />
      </>
    )
  } else if (selectNetworkInfo?.label && selectNetworkInfo?.label !== 'BTC') {
    return (
      <>
        <CrossChainNonEVM bridgeKey={bridgeKey} />
      </>
    )
  } else {
    return (
      <>
        <CrossChainEVM bridgeKey={bridgeKey} />
      </>
    )
  }
}

export default function CrossChain({
  bridgeKey
}: {
  bridgeKey: any
}) {
  return (
    <>
      {/* <TxnsDtilsModal /> */}
      {/* <TxnsListModal /> */}
      <CrossChainView bridgeKey={bridgeKey} />
    </>
  )
}