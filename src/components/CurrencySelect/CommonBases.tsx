import React, { useMemo } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'

import { AutoColumn } from '../Column'
// import QuestionHelper from '../QuestionHelper'
import { AutoRow } from '../Row'
import TokenLogo from '../TokenLogo'

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.bg3)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.bg2};
  }

  background-color: ${({ theme, disable }) => disable && theme.bg3};
  opacity: ${({ disable }) => disable && '0.4'};
`

export default function CommonBases({
  // chainId,
  onSelect,
  selectedCurrency,
  tokenList
}: {
  // chainId?: any
  selectedCurrency?: any | null
  onSelect: (currency: any) => void
  tokenList: any
}) {
  const comparator = (a:any, b:any) => {
    if (a.mainSort > b.mainSort) {
      return 1
    }
    return -1
  }
  const viewTokenList = useMemo(() => {
    if (tokenList) {
      return tokenList.sort(comparator)
    }
    return []
  }, [tokenList])
  // console.log(viewTokenList)
  return (
    <AutoColumn gap="md">
      {/* <AutoRow>
        <Text fontWeight={500} fontSize={14}>
          Common bases
        </Text>
        <QuestionHelper text="These tokens are commonly paired with other tokens." />
      </AutoRow> */}
      <AutoRow gap="4px">
        {/* <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER)
            }
          }}
          disable={selectedCurrency === ETHER}
        >
          <TokenLogo symbol={selectedCurrency?.symbol} style={{ marginRight: 8 }} />
          <Text fontWeight={500} fontSize={16}>
            {Currency.getNativeCurrencySymbol(chainId)}
          </Text>
        </BaseWrapper> */}
        {viewTokenList.length > 0 ? viewTokenList.map((token: any) => {
          // console.log(selectedCurrency)
          const selected = selectedCurrency?.key === token.key
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token?.key}>
              {/* <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={(token?.tokenType ? token?.tokenType : '') + token.address}> */}
              <TokenLogo symbol={token?.symbol} logoUrl={token?.logoUrl} style={{ marginRight: 8 }} />
              <Text fontWeight={500} fontSize={16}>
                {token?.symbol}
              </Text>
            </BaseWrapper>
          )
        }) : ''}
      </AutoRow>
    </AutoColumn>
  )
}
