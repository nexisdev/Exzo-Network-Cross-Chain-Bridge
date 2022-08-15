
import React, { KeyboardEvent, useState, RefObject, useCallback, useEffect, useRef, useMemo } from 'react'
import { Currency, ETHER } from 'anyswap-sdk'
import { Text } from 'rebass'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useTranslation } from 'react-i18next'
// import styled from 'styled-components'

import Column from '../Column'
import { RowBetween } from '../Row'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { PaddedColumn, SearchInput, Separator } from '../SearchModal/styleds'
import { filterTokens } from '../SearchModal/filtering'
import { useTokenComparator } from '../SearchModal/sorting'
import Row from '../Row'

import CommonBases from './CommonBases'
import {
  TabList
} from './styleds'

import { CloseIcon } from '../../theme'

import { isAddress } from '../../utils'

// import { useLocalToken } from '../../hooks/Tokens'
import CurrencyList from './CurrencyList'

import {MAIN_COIN_SORT} from '../../config/constant'

import {useStarToken, useChangeStarTab} from '../../state/user/hooks'

// const TabList = styled.div`
//   ${({ theme }) => theme.flexSC};
//   width: 100%;
//   .item {
//     padding: 8px 12px;
//     cursor:pointer;
//     border-bottom: 2px solid transparent;
//     &.active {
//       // color: ${({ theme }) => theme.primary1};
//       color: #734be2;
//       font-weight:bold;
//       border-bottom: 2px solid #734be2;
//     }
//   }
// `

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  // onlyUnderlying?: boolean
  allTokens?: any
  chainId?: any
  bridgeKey?: any
  allBalances?: any
  showETH?: any
  selectDestChainId?: any
}

export default function SearchModal ({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  // onlyUnderlying,
  allTokens = {},
  chainId,
  bridgeKey,
  // allBalances,
  showETH,
  selectDestChainId
}: CurrencySearchModalProps) {
  const { t } = useTranslation()
  const {starTokenList} = useStarToken()
  const {tokenComparator, balances: allBalances} = useTokenComparator(bridgeKey, chainId, false)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mainTokenList, setMainTokenList] = useState<any>([])
  const [tokenList, setTokenList] = useState<any>([])
  const [useAllTokenList, setUseAllTokenList] = useState<any>({})
  // const [selectTab, setSelectTab] = useState<any>(Object.keys(starTokenList).length > 0 ? 0 : 1)
  const {starTabIndex, onChangeStarTab} = useChangeStarTab('TOKEN')
  // const [intervalCount, setIntervalCount] = useState<any>(0)

  const inputRef = useRef<HTMLInputElement>()

  const isAddressSearch = isAddress(searchQuery)
  const starTokenListStr = useMemo(() => {
    return JSON.stringify(starTokenList)
  }, [starTokenList])
  useEffect(() => {
    const list:any = {}
    const arr:any = []
    const mainarr:any = []
    // console.log(111)
    // console.log(allTokens)
    // console.log(starTokenList)
    const starList = starTokenListStr ? JSON.parse(starTokenListStr) : {}
    for (const tokenKey in allTokens) {
      const obj:any = allTokens[tokenKey].tokenInfo ? allTokens[tokenKey].tokenInfo : allTokens[tokenKey]
      const token = obj.address
      const data = {
        ...obj,
        key: tokenKey
      }
      if (!obj.name || !obj.symbol) continue
      if (starTabIndex === 0 && starList[token]) {
        arr.push(data)
      } else if (starTabIndex === 1 || obj.type) {
        arr.push(data)
      }
      list[token] = data
      // arr.push(data)
      if (
        (obj.symbol === 'USDT' && chainId?.toString() === '250')
        || (obj.symbol === 'fUSDT' && chainId?.toString() === '56')
        || (obj.address.toLowerCase() === '0xf5c8054efc6acd25f31a17963462b90e82fdecad' && chainId?.toString() === '250')
        || (obj.address === '0x1ccca1ce62c62f7be95d4a67722a8fdbed6eecb4' && chainId?.toString() === '42161')
        || ['MultichainUSDC', 'MultichainDAI'].includes(obj.name)
      ) continue
      
      if (MAIN_COIN_SORT[obj.symbol]) {
        mainarr.push({
          mainSort: MAIN_COIN_SORT[obj.symbol].sort,
          ...data
        })
      }
    }
    setUseAllTokenList(list)
    setTokenList(arr)
    setMainTokenList(mainarr)
  }, [allTokens, chainId, starTabIndex, starTokenListStr])

  // const searchToken = useLocalToken(searchQuery && useAllTokenList[searchQuery?.toLowerCase()] ? useAllTokenList[searchQuery?.toLowerCase()] : '')
  const searchToken = useMemo(() => {
    if (searchQuery && useAllTokenList[searchQuery?.toLowerCase()]) {
      return useAllTokenList[searchQuery?.toLowerCase()]
    }
    return undefined
  }, [searchQuery, useAllTokenList])

  const filteredTokens: any[] = useMemo(() => {
    if (isAddressSearch && searchToken) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(tokenList), searchQuery)
  }, [isAddressSearch, searchToken, tokenList, searchQuery])

  const filteredSortedTokens: any[] = useMemo(() => {
    // console.log(searchToken)
    if (searchToken) return [searchToken]
    // console.log(filteredTokens)
    const sorted = filteredTokens.sort(tokenComparator)
    // const sorted = filteredTokens
    // console.log(sorted)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)
    if (symbolMatch.length > 1) return sorted
    const arr = [
      ...(searchToken ? [searchToken] : []),
      // 首先对任何完全匹配的符号进行排序
      ...sorted.filter(token => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter(token => token.symbol?.toLowerCase() !== symbolMatch[0])
    ]
    return arr
  // }, [searchQuery, searchToken, tokenComparator, filteredTokens, intervalCount])
  }, [searchQuery, searchToken, tokenComparator, filteredTokens])

  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    // fixedList.current?.scrollTo(0)
  }, [])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (onCurrencySelect) {
        onCurrencySelect(currency)
        onDismiss()
      }
    },
    [onCurrencySelect]
  )
  
  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    // [searchQuery]
    [filteredSortedTokens, handleCurrencySelect, searchQuery]
  )
    // console.log(filteredSortedTokens)
  // console.log(isOpen)
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              {t('selectToken')}
              <QuestionHelper text={t('tip6')} />
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <Row>
            <SearchInput
              type="text"
              id="token-search-input"
              placeholder={t('tokenSearchPlaceholder')}
              value={searchQuery}
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              onKeyDown={handleEnter}
            />
          </Row>
          {mainTokenList.length > 0 ? (
            <CommonBases
            // chainId={chainId}
            selectedCurrency={selectedCurrency}
            onSelect={handleCurrencySelect}
            tokenList = {mainTokenList}
            />
          ) : ''}
        </PaddedColumn>
        <Separator />
        {
          selectDestChainId ? '' : (
            <TabList>
              <div className={'item ' + (starTabIndex === 0 ? 'active' : '')} onClick={() => onChangeStarTab(0)}>My Favorites</div>
              <div className={'item ' + (starTabIndex === 1 ? 'active' : '')} onClick={() => onChangeStarTab(1)}>All Tokens</div>
            </TabList>
          )
        }
        <Separator />
        <div style={{ flex: '1' }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <>
                <CurrencyList
                  height={height}
                  showETH={showETH}
                  currencies={filteredSortedTokens}
                  onCurrencySelect={handleCurrencySelect}
                  otherCurrency={otherSelectedCurrency}
                  selectedCurrency={selectedCurrency}
                  allBalances={allBalances}
                  bridgeKey={bridgeKey}
                  selectDestChainId={selectDestChainId}
                  // fixedListRef={fixedList}
                />
              </>
            )}
          </AutoSizer>
        </div>
      </Column>
    </Modal>
  )
}