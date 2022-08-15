import React, { useState, useContext, useCallback, useEffect, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
import { Currency } from 'anyswap-sdk'
// import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import {useActiveReact} from '../../hooks/useActiveReact'
import useInterval from '../../hooks/useInterval'
import {useNonEVMDestBalance} from '../../hooks/useAllBalances'

import { RowBetween } from '../Row'
import Column from '../Column'
import { PaddedColumn, Separator } from '../SearchModal/styleds'
import { Input as NumericalInput } from '../NumericalInput'
import TokenLogo from '../TokenLogo'
import Modal from '../Modal'
import SearchModal from '../CurrencySelect/searchModal'
import {
  OptionCardClickable,
  Option
} from '../Header/SelectNetwork'

import { TYPE, CloseIcon } from '../../theme'

import {thousandBit} from '../../utils/tools/tools'

import {useStarChain} from '../../state/user/hooks'

import config from '../../config'

import {
  InputRow,
  CurrencySelect,
  // ErrorSpanBox,
  // ErrorSpan,
  // ExtraText,
  LabelRow,
  Aligner,
  TokenLogoBox,
  StyledDropDownBox,
  StyledDropDown,
  InputPanel,
  Container,
  StyledTokenName,
  CurrencySelectBox
  // HideSmallBox
} from '../CurrencySelect/styleds'

import {getNodeBalance} from '../../utils/bridge/getBalanceV2'


interface SelectChainIdInputPanel {
  value: string
  onUserInput: (value: string) => void
  label?: string
  onChainSelect?: (selectChainId: any) => void
  selectChainId?: any
  disableCurrencySelect?: boolean
  hideInput?: boolean
  id: string
  onCurrencySelect?: (currency: Currency) => void // user select token
  onOpenModalView?: (value: any) => void,
  bridgeConfig: any,
  intervalCount?: any,
  isNativeToken?: boolean
  isViewAllChain?: boolean
  selectChainList?: Array<any>
  selectDestCurrency?: any
  selectDestCurrencyList?: any
  bridgeKey?: any
}

export default function SelectChainIdInputPanel({
  value,
  onUserInput,
  label = 'Input',
  onChainSelect,
  selectChainId,
  disableCurrencySelect = false,
  hideInput = false,
  id,
  onOpenModalView,
  onCurrencySelect,
  bridgeConfig,
  // intervalCount,
  isNativeToken,
  isViewAllChain,
  selectChainList = [],
  selectDestCurrency,
  selectDestCurrencyList,
  bridgeKey
}: SelectChainIdInputPanel) {
  const { t } = useTranslation()
  // const { chainId, account } = useActiveWeb3React()
  const { chainId, evmAccount } = useActiveReact()
  const {starChainList} = useStarChain()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalDestOpen, setModalDestOpen] = useState(false)
  // const [chainList, setChainList] = useState<Array<any>>([])
  const [destBalance, setDestBalance] = useState<any>('')
  // const chainList = useMemo(() => {
  //     return [...selectChainList]
  //   // if (selectChainList.length > 0) {
  //   //   return [...selectChainList]
  //   // } else {
  //   //   return []
  //   // }
  // }, [selectChainList])
  const comparator = (a:any, b:any) => {
    if (a.networkName > b.networkName) {
      return 1
    }
    return -1
  }
  const useChainList = useMemo(() => {
    const arr:any = []
    const starArr:any = []
    // console.log(selectChainList)
    for (const c of selectChainList) {
      if (!config.chainInfo[c]) continue
      if (starChainList?.[c]) {
        starArr.push(config.chainInfo[c])
      } else {
        arr.push(config.chainInfo[c])
      }
    }
    return [
      ...starArr.sort(comparator),
      ...arr.sort(comparator),
    ]
  }, [selectChainList, starChainList])

  // console.log(useChainList)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
    setModalDestOpen(false)
  }, [setModalOpen])

  const theme = useContext(ThemeContext)
  
  const handleCurrencySelect = useCallback(
    (chainID) => {
      if (onChainSelect) {
        onChainSelect(chainID)
        handleDismissSearch()
      }
    },
    [onChainSelect]
  )

  const destChainInfo = useMemo(() => {
    // console.log(bridgeConfig)
    if (bridgeConfig) {
      if (selectChainId?.toString() === chainId?.toString()) {
        return bridgeConfig
      } else {
        if (selectDestCurrency) {
          return selectDestCurrency
        } else {
          return bridgeConfig.destChains[selectChainId]
        }
      }
    }
    return false
  }, [bridgeConfig, selectChainId, chainId, selectDestCurrency])


  
  const nonEVMbl = useNonEVMDestBalance(destChainInfo?.Unit, destChainInfo?.decimals, selectChainId)

  // useEffect(() => {
  const getDestBalance = useCallback(() => {
    // console.log(label)
    // console.log(bridgeConfig)
    if (
      evmAccount
      && chainId
      && bridgeConfig
      && selectChainId
      && !isNaN(selectChainId)
    ) {
      const token:any = destChainInfo?.address
      if (token) {
        // let isNT = (isNativeToken && chainId?.toString() === selectChainId?.toString()) || config.getCurChainInfo(selectChainId)?.nativeToken?.toLowerCase() === destChainInfo?.address.toLowerCase()
        // if (['swapin', 'swapout'].includes(destChainInfo?.type)) {

        // }
        const isNT = destChainInfo?.tokenType === 'NATIVE' ? true : false
        // console.log(selectChainId)
        // console.log(destChainInfo)
        getNodeBalance(evmAccount, token, selectChainId, destChainInfo?.decimals, isNT).then(res => {
          // console.log(res)
          if (res || res === 0) {
            setDestBalance(res)
          } else {
            setDestBalance('')
          }
        })
      }
    } else {
      setDestBalance('')
    }
  }, [evmAccount, chainId, bridgeConfig, selectChainId, isNativeToken, destChainInfo])

  useInterval(getDestBalance, 1000 * 10)

  useEffect(() => {
    setDestBalance('')
    getDestBalance()
  }, [evmAccount, chainId, bridgeConfig, selectChainId, isNativeToken, destChainInfo])

  const useBalance = useMemo(() => {
    // console.log(nonEVMbl)
    if (isNaN(selectChainId)) {
      // console.log(nonEVMbl?.toSignificant(6))
      if (nonEVMbl) {
        return nonEVMbl?.toSignificant(6)
      }
      return ''
    }
    return destBalance
  }, [destBalance, nonEVMbl, selectChainId])

  return (
    <>
      <SearchModal
        isOpen={modalDestOpen}
        onDismiss={handleDismissSearch}
        onCurrencySelect={onCurrencySelect ? onCurrencySelect : () => {return}}
        selectedCurrency={selectDestCurrency}
        // otherSelectedCurrency={otherCurrency}
        allTokens={selectDestCurrencyList}
        chainId={chainId}
        bridgeKey={bridgeKey}
        selectDestChainId={selectChainId}
      />
      <InputPanel id={id}>
        <Container hideInput={hideInput}>
          {!hideInput && (
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {label}
                </TYPE.body>
                <TYPE.body
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {t('balanceTxt') + ': '}{useBalance !== '' ? thousandBit(useBalance, 2) : '-'}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
          )}
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
            {!hideInput && (
              <>
                <NumericalInput
                  className="token-amount-input"
                  value={value}
                  onUserInput={val => {
                    onUserInput(val)
                  }}
                  disabled
                />
              </>
            )}
            <CurrencySelectBox>

              <CurrencySelect
                selected={!!selectChainId}
                className="open-currency-select-button"
                onClick={() => {
                  if (!disableCurrencySelect) {
                    if (onOpenModalView) {
                      onOpenModalView(true)
                    } else {
                      setModalDestOpen(true)
                    }
                  }
                }}
              >
                <Aligner>
                  <TokenLogoBox>
                    <TokenLogo symbol={bridgeConfig?.symbol} logoUrl={bridgeConfig?.logoUrl} size={'24px'} />
                  </TokenLogoBox>
                  <StyledTokenName className="token-symbol-container" active={Boolean(bridgeConfig && bridgeConfig.symbol)}>
                    <h3>
                      {
                        destChainInfo?.symbol ? (
                          destChainInfo?.symbol.length > 20
                            ? destChainInfo?.symbol.slice(0, 4) +
                              '...' +
                              destChainInfo?.symbol.slice(destChainInfo?.symbol.length - 5, destChainInfo?.symbol.length)
                            : config.getBaseCoin(destChainInfo?.symbol, selectChainId)
                        ) : t('selectToken')
                      }
                    </h3>
                    <p>
                      {
                        destChainInfo ? config.getBaseCoin(destChainInfo?.symbol, selectChainId, 1, destChainInfo?.name) : ''
                      }
                    </p>
                  </StyledTokenName>
                  {!disableCurrencySelect && !!selectChainId && (
                    <StyledDropDownBox>
                      <StyledDropDown selected={!!selectChainId} />
                    </StyledDropDownBox>
                  )}
                </Aligner>
              </CurrencySelect>

              <CurrencySelect
                selected={!!selectChainId}
                className="open-currency-select-button"
                onClick={() => {
                  if (!disableCurrencySelect) {
                    setModalOpen(true)
                  }
                }}
              >
                <Aligner>
                  <TokenLogoBox>
                    <TokenLogo symbol={selectChainId ? (config.getCurChainInfo(selectChainId)?.networkLogo ?? config.getCurChainInfo(selectChainId)?.symbol) : ''} size={'24px'} />
                  </TokenLogoBox>
                  <StyledTokenName className="token-symbol-container" active={Boolean(selectChainId)}>
                    {selectChainId && config.chainInfo[selectChainId]?.networkName ? config.chainInfo[selectChainId].networkName : t('selectNetwork')}
                  </StyledTokenName>
                  {!disableCurrencySelect && !!selectChainId && (
                    <StyledDropDownBox>
                      <StyledDropDown selected={!!selectChainId} />
                    </StyledDropDownBox>
                  )}
                </Aligner>
              </CurrencySelect>
            </CurrencySelectBox>
          </InputRow>
        </Container>
      </InputPanel>
      {!disableCurrencySelect && onChainSelect && (
        <Modal isOpen={modalOpen} onDismiss={handleDismissSearch} maxHeight={80}>
          <Column style={{ width: '100%', flex: '1 1' }}>
            <PaddedColumn gap="14px">
              <RowBetween>
                <Text fontWeight={500} fontSize={16}>
                  {t('selectNetwork')}
                  {/* <QuestionHelper text={t('tip6')} /> */}
                </Text>
                <CloseIcon onClick={handleDismissSearch} />
              </RowBetween>
            </PaddedColumn>
            <Separator />
            <div style={{ flex: '1' }}>
              {/* {chainListView()} */}
              {
                  useChainList.map((item:any, index:any) => {
                    if (
                      (chainId && chainId?.toString() === item.chainID?.toString() && !isViewAllChain)
                      || (config.getCurConfigInfo()?.hiddenChain?.includes(item.chainID))
                    ) {
                      return ''
                    }
                    // console.log(useChainList)
                    return (
                      <OptionCardClickable
                        key={index}
                        className={selectChainId && selectChainId === item.chainID ? 'active' : ''}
                      >
                        <Option curChainId={item.chainID} selectChainId={selectChainId} changeNetwork={(val) => (selectChainId && selectChainId === item.chainID ? null : handleCurrencySelect(val.chainID))}></Option>
                      </OptionCardClickable>
                    )
                  })
                }
            </div>
          </Column>
        </Modal>
      )}
    </>
  )
}
