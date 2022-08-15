import React, { useMemo } from 'react'
import styled from 'styled-components'
import { CheckCircle, Triangle } from 'react-feather'

// import { useActiveWeb3React } from '../../hooks'
import {useTxnsDtilOpen} from '../../state/application/hooks'
import {useActiveReact} from '../../hooks/useActiveReact'
import { getEtherscanLink } from '../../utils'
import { ExternalLink } from '../../theme'
import { useAllTransactions } from '../../state/transactions/hooks'
import { RowFixed } from '../Row'
import Loader from '../Loader'
import {Status, getStatus} from '../../config/status'

const TransactionWrapper = styled.div``

const TransactionStatusText = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text1};
  :hover {
    text-decoration: underline;
  }
`

const TransactionState = styled(ExternalLink)<{ pending: boolean; success?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  color: ${({ theme }) => theme.primary1};
`

const TransactionState1 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  color: ${({ theme }) => theme.primary1};
  cursor:pointer;
`

const IconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
  color: ${({ pending, success, theme }) => (pending ? theme.primary1 : success ? theme.green1 : theme.red1)};
`

export default function Transaction({ hash }: { hash: string }) {
  // const { chainId } = useActiveWeb3React()
  const { chainId } = useActiveReact()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  
  const allTransactions = useAllTransactions()
  // console.log(allTransactions)
  const tx = allTransactions?.[hash]
  const summary = tx?.summary
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
  const toStatus:any = useMemo(() => {
    if (tx) {
      if (fromStatus === Status.Failure) {
        return Status.Failure
      } else if (!tx.info) {
        return null
      } else if (tx.info?.status || tx.info?.status === 0) {
        const status = tx.info?.status
        const statusType = getStatus(status)
        return statusType
      } else {
        return Status.Failure
      }
    } else {
      return null
    }
  }, [tx, fromStatus])
  // const pending = !tx?.receipt
  const pending = useMemo(() => {
    if (tx?.version) {
      if (!toStatus || [Status.Pending, Status.Confirming, Status.Crosschaining].includes(toStatus)) {
        return true
      }
      return false
    } else {
      return !tx?.receipt
    }
  }, [tx, toStatus])
  // const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  const success = useMemo(() => {
    if (tx?.version) {
      if (toStatus === Status.Success) {
        return true
      }
      return false
    } else {
      return !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
    }
  }, [toStatus])
  // console.log(tx)
  if (!chainId) return null

  return (
    <TransactionWrapper>
      {
        tx?.version ? (
          <TransactionState1 onClick={() => {
            // console.log(hash)
            onChangeViewDtil(hash, true)
          }}>
            <RowFixed>
              <TransactionStatusText>{summary ?? hash} ↗</TransactionStatusText>
            </RowFixed>
            <IconWrapper pending={pending} success={success}>
              {pending ? <Loader stroke="#5f6bfb" /> : success ? <CheckCircle size="16" /> : <Triangle size="16" />}
            </IconWrapper>
          </TransactionState1>
        ) : (
          <TransactionState href={getEtherscanLink(chainId, hash, 'transaction')} pending={pending} success={success}>
            <RowFixed>
              <TransactionStatusText>{summary ?? hash} ↗</TransactionStatusText>
            </RowFixed>
            <IconWrapper pending={pending} success={success}>
              {pending ? <Loader stroke="#5f6bfb" /> : success ? <CheckCircle size="16" /> : <Triangle size="16" />}
            </IconWrapper>
          </TransactionState>
        )
      }
    </TransactionWrapper>
  )
}
