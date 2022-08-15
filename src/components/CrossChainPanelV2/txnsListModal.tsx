import React from "react"
import styled from "styled-components"

import { useAllTransactions } from '../../state/transactions/hooks'
import {useTxnsDtilOpen} from '../../state/application/hooks'

import TokenLogo from "../TokenLogo"

const TxnsListBox = styled.div`
  position:fixed;
  top: 100px;
  right: 20px;
  height: 100%;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 9;
  .item {
    width: 36px;
    height: 36px;
    margin-bottom: 5px;
  }
`

export default function TxnsListModal () {
  const allTransactions = useAllTransactions()
  const {onChangeViewDtil} = useTxnsDtilOpen()

  // console.log(allTransactions)
  // const hash = getParams('hash')
  // console.log(allTransactions)
  return (
    <>
      <TxnsListBox>
        {Object.keys(allTransactions).reverse().map((hash, index) => {
          const symbol = allTransactions[hash]?.symbol
          const logoUrl = allTransactions[hash]?.logoUrl
          if (!allTransactions[hash]?.version) return ''
          return (
            <div onClick={() => {onChangeViewDtil(hash, true)}} key={index} className="item">
              <TokenLogo symbol={symbol} logoUrl={logoUrl} size={'36px'} />
            </div>
          )
        })}
      </TxnsListBox>
    </>
  )
}