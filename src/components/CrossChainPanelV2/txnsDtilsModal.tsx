import React, { useMemo } from "react"

import { useActiveReact } from '../../hooks/useActiveReact'
import { useAllTransactions } from '../../state/transactions/hooks'
import {useTxnsDtilOpen} from '../../state/application/hooks'
// import {getParams} from '../../config/tools/getUrlParams'

import {Status, getStatus} from '../../config/status'

import HistoryDetails from "../Transaction/details"
import ModalContent from '../Modal/ModalContent'

export default function TxnsDtilsModal () {
  const allTransactions = useAllTransactions()
  const { chainId } = useActiveReact()
  const {hash, isOpenModal, onChangeViewDtil} = useTxnsDtilOpen()

  // console.log(isOpenModal)
  // const hash = getParams('hash')
  const tx:any = allTransactions?.[hash]
  // console.log(tx)
  const fromStatus = useMemo(() => {
    if (tx) {
      if (!tx.receipt) {
        return Status.Pending
      } else if (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined') {
        return Status.Success
      } else {
        return Status.Failure
      }
    } else {
      return Status.Null
    }
  }, [tx])
  const toStatus = useMemo(() => {
    if (tx) {
      if (fromStatus === Status.Failure) {
        return Status.Failure
      } else if (!tx.info) {
        return null
      } else if (tx.info?.status || tx.info?.status === 0) {
        const status = tx.info?.status
        const statusType = getStatus(status)
        return statusType
      } else if (tx.info?.status === '') {
        return Status.Confirming
      } else {
        return Status.Failure
      }
    } else {
      return null
    }
  }, [tx, fromStatus])
  return (
    <>
      <ModalContent
        isOpen={isOpenModal}
        title={'Transaction Details'}
        onDismiss={() => {
          onChangeViewDtil('', false)
        }}
        padding={'0rem'}
      >
        <HistoryDetails
          symbol={tx?.symbol}
          from={tx?.from}
          to={tx?.toAddress}
          fromChainID={chainId}
          toChainID={tx?.toChainId}
          fromStatus={fromStatus}
          toStatus={toStatus}
          txid={tx?.hash}
          swaptx={fromStatus === Status.Failure || toStatus === Status.Failure ? 'Null' : tx?.info?.swaptx}
          swapvalue={fromStatus === Status.Failure || toStatus === Status.Failure ? 'Null' : tx?.info?.formatswapvalue}
          timestamp={tx?.addedTime}
          value={tx?.value}
          version={tx?.version}
          token={tx?.token}
          isLiquidity={tx?.isLiquidity}
          isReceiveAnyToken={tx?.isReceiveAnyToken}
          avgTime={tx?.info?.time}
          logoUrl={tx?.logoUrl}
          fromInfo={tx?.fromInfo}
          toInfo={tx?.toInfo}
        />
      </ModalContent>
    </>
  )
}