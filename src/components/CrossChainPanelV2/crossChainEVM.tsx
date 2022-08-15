import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'

import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown, Plus, Minus } from 'react-feather'
import { useConnectedWallet } from '@terra-money/wallet-provider'
// import nebulas from 'nebulas'
import SelectChainIdInputPanel from './selectChainID'
import Reminder from './reminder'

import {useActiveReact} from '../../hooks/useActiveReact'

import {useBridgeCallback, useBridgeUnderlyingCallback, useBridgeNativeCallback, useCrossBridgeCallback} from '../../hooks/useBridgeCallback'
// import { WrapType } from '../../hooks/useWrapCallback'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { useLocalToken } from '../../hooks/Tokens'

import SelectCurrencyInputPanel from '../CurrencySelect/selectCurrency'
import { AutoColumn } from '../Column'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../Button'
import { AutoRow } from '../Row'
import Loader from '../Loader'
import AddressInputPanel from '../AddressInputPanel'
import { ArrowWrapper, BottomGrouping } from '../swap/styleds'
import ModalContent from '../Modal/ModalContent'

import { useWalletModalToggle } from '../../state/application/hooks'
import { tryParseAmount } from '../../state/swap/hooks'
// import { useMergeBridgeTokenList } from '../../state/lists/hooks'
import { useAllMergeBridgeTokenList, useInitUserSelectCurrency } from '../../state/lists/hooks'

import config from '../../config'
import {VALID_BALANCE} from '../../config/constant'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'
import { ChainId } from '../../config/chainConfig/chainId'

// import {getNodeTotalsupply} from '../../utils/bridge/getBalanceV2'
// import {formatDecimal, thousandBit} from '../../utils/tools/tools'

import TokenLogo from '../TokenLogo'
import LiquidityPool from '../LiquidityPool'

import ConfirmView from './confirmModal'
import ErrorTip from './errorTip'

import RouterList from './routerList'

import {usePool} from '../../hooks/usePools'
import {
  useNearBalance,
  useSendNear
} from '../../hooks/near'

import {
  LogoBox,
  ConfirmContent,
  TxnsInfoText,
  ConfirmText,
  FlexEC,
} from '../../pages/styled'

import {
  outputValue,
  useInitSelectCurrency,
  useDestChainid,
  useDestCurrency,
  getFTMSelectPool
} from './hooks'
import { BigAmount } from '../../utils/formatBignumber'

import {getUrlData} from '../../utils/tools/axios'
import {isAddress} from '../../utils/isAddress'
import useInterval from '../../hooks/useInterval'
import {formatXlmMemo} from '../../hooks/stellar'
formatXlmMemo('0xC5107334A3Ae117E3DaD3570b419618C905Aa5eC', 5777)

// let intervalFN:any = ''

export default function CrossChain({
  bridgeKey
}: {
  bridgeKey: any
}) {
  // const { account, chainId, library } = useActiveWeb3React()
  // const { account, chainId } = useActiveWeb3React()
  const { chainId, evmAccount } = useActiveReact()
  const { t } = useTranslation()
  const connectedWallet = useConnectedWallet()

  const allTokensList:any = useAllMergeBridgeTokenList(bridgeKey, chainId)
  // console.log(bridgeKey)
  // console.log(allTokensList)
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()

  const {getNearStorageBalance} = useNearBalance()

  const {setInitUserSelect} = useInitUserSelectCurrency(chainId)
  const {depositStorageNear} = useSendNear()
  

  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectDestCurrency, setSelectDestCurrency] = useState<any>()
  const [selectDestCurrencyList, setSelectDestCurrencyList] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>()
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [recipient, setRecipient] = useState<any>(evmAccount ?? '')
  const [swapType, setSwapType] = useState('swap')

  const [isUserSelect, setIsUserSelect] = useState(false)
  

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTipOpen, setModalTipOpen] = useState(false)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [delayAction, setDelayAction] = useState<boolean>(false)

  const [curChain, setCurChain] = useState<any>({
    chain: chainId,
    ts: '',
    bl: ''
  })
  const [destChain, setDestChain] = useState<any>({
    chain: config.getCurChainInfo(chainId).bridgeInitChain,
    ts: '',
    bl: ''
  })

  let initBridgeToken:any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  const destConfig = useMemo(() => {
    // console.log(selectDestCurrency)
    if (selectDestCurrency) {
      return selectDestCurrency
    }
    return false
  }, [selectDestCurrency])
  // console.log(destConfig)
  const isRouter = useMemo(() => {
    // console.log(destConfig)
    if (['swapin', 'swapout'].includes(destConfig?.type)) {
      return false
    }
    return true
  }, [destConfig])

  const isApprove = useMemo(() => {
    return destConfig.isApprove
  }, [destConfig])

  const isLiquidity = useMemo(() => {
    return destConfig.isLiquidity
  }, [destConfig])

  const useSwapMethods = useMemo(() => {
    return destConfig.routerABI
  }, [destConfig])

  const isNativeToken = useMemo(() => {
    console.log(selectCurrency)
    if (
      selectCurrency
      && selectCurrency?.tokenType === 'NATIVE'
    ) {
      return true
    }
    return false
  }, [selectCurrency])
  // console.log(isNativeToken)

  const anyToken = useMemo(() => {
    if (destConfig?.fromanytoken) {
      return destConfig.fromanytoken
    }
    return undefined
  }, [destConfig.fromanytoken])

  const isDestUnderlying = useMemo(() => {
    if (destConfig?.underlying) {
      return true
    }
    return false
  }, [destConfig])

  const routerToken = useMemo(() => {
    if (destConfig?.router && isAddress(destConfig?.router)) {
      return destConfig?.router
    }
    return undefined
  }, [destConfig])

  const approveSpender = useMemo(() => {
    if (destConfig.isApprove) {
      if (isRouter) {
        // setBridgeAnyToken('')
        return destConfig.spender
      } else {
        return destConfig?.fromanytoken?.address
      }
    }
    return undefined
  }, [destConfig, isRouter, routerToken])

  
  const isBridgeFTM = useMemo(() => {
    if (
      destConfig?.address === 'FTM'
      || destConfig?.fromanytoken?.address === 'FTM'
    ) {
      return true
    }
    return false
  }, [destConfig])

  const formatCurrency = useLocalToken(selectCurrency ?? undefined)
  // console.log(formatCurrency)
  const formatInputBridgeValue = tryParseAmount(inputBridgeValue, (formatCurrency && isApprove) ? formatCurrency : undefined)
  // console.log((formatCurrency && isApprove) ? formatCurrency : undefined)

  const [approval, approveCallback] = useApproveCallback((formatInputBridgeValue && isApprove) ? formatInputBridgeValue : undefined, approveSpender)
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  function onDelay () {
    setDelayAction(true)
  }
  function onClear (type?:any) {
    setDelayAction(false)
    setModalTipOpen(false)
    if (!type) {
      setInputBridgeValue('')
    }
  }

  function changeNetwork (chainID:any) {
    selectNetwork(chainID).then((res: any) => {
      console.log(res)
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(chainID).networkName}))
      }
    })
  }

  useEffect(() => {
    setDestChain('')
  }, [selectChain, selectCurrency])
  const {curChain: curFTMChain, destChain: destFTMChain} = getFTMSelectPool(selectCurrency, chainId, selectChain, destConfig)

  const {poolData} = usePool(chainId, evmAccount, destConfig?.isFromLiquidity && !isBridgeFTM && destConfig?.isLiquidity ? anyToken?.address : undefined, selectCurrency?.address)
  useEffect(() => {
    // console.log(poolData)
    // console.log(curFTMChain)
    if (poolData && anyToken?.address && !isBridgeFTM && poolData?.[anyToken?.address]?.balanceOf) {
      setCurChain({
        chain: chainId,
        ts: BigAmount.format(anyToken?.decimals, poolData[anyToken?.address]?.balanceOf).toExact(),
        bl: poolData[anyToken?.address]?.balance ? BigAmount.format(anyToken?.decimals, poolData[anyToken?.address]?.balance).toExact() :'',
      })
    } else if (isBridgeFTM && curFTMChain) {
      setCurChain({
        ...curFTMChain
      })
    } else {
      setCurChain({})
    }
  }, [poolData, anyToken, curFTMChain, isBridgeFTM])
  const {poolData: destPoolData} = usePool(selectChain, evmAccount, destConfig?.isLiquidity && !isBridgeFTM ? destConfig?.anytoken?.address : undefined, destConfig?.underlying?.address)
  useEffect(() => {
    // console.log(destPoolData)
    // console.log(destFTMChain)
    if (destPoolData && destConfig?.anytoken?.address && !isBridgeFTM && destPoolData?.[destConfig?.anytoken?.address]?.balanceOf) {
      setDestChain({
        chain: selectChain,
        ts: BigAmount.format(destConfig?.anytoken?.decimals, destPoolData[destConfig?.anytoken?.address]?.balanceOf).toExact(),
        bl: destPoolData[destConfig?.anytoken?.address]?.balance ? BigAmount.format(destConfig?.anytoken?.decimals, destPoolData[destConfig?.anytoken?.address]?.balance).toExact() : '',
      })
    } else if (isBridgeFTM && destFTMChain) {
      setDestChain({
        ...destFTMChain
      })
    } else {
      setDestChain({})
    }
  }, [destPoolData, destConfig, destFTMChain, isBridgeFTM])
  
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useBridgeCallback(
    routerToken,
    formatCurrency ? formatCurrency : undefined,
    anyToken?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency,
    isLiquidity,
    destConfig
  )

  const { wrapType: wrapTypeNative, execute: onWrapNative, inputError: wrapInputErrorNative } = useBridgeNativeCallback(
    routerToken,
    formatCurrency ? formatCurrency : undefined,
    anyToken?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    isLiquidity,
    destConfig
  )

  const { wrapType: wrapTypeUnderlying, execute: onWrapUnderlying, inputError: wrapInputErrorUnderlying } = useBridgeUnderlyingCallback(
    routerToken,
    formatCurrency ? formatCurrency : undefined,
    anyToken?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency,
    isLiquidity,
    destConfig
  )

  const { wrapType: wrapTypeCrossBridge, execute: onWrapCrossBridge, inputError: wrapInputErrorCrossBridge } = useCrossBridgeCallback(
    formatCurrency ? formatCurrency : undefined,
    destConfig?.type === 'swapin' ? destConfig?.DepositAddress : recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    anyToken?.address ,
    destConfig?.pairid,
    isLiquidity,
    recipient,
    selectCurrency,
    destConfig
  )
  

  const {outputBridgeValue, fee} = outputValue(inputBridgeValue, destConfig, selectCurrency)

  const isWrapInputError = useMemo(() => {
    if (isRouter) {
      if (useSwapMethods) {
        if (useSwapMethods.indexOf('anySwapOutNative') !== -1) {
          if (wrapInputErrorNative) {
            return wrapInputErrorNative
          } else {
            return false
          }
        } else if (useSwapMethods.indexOf('anySwapOutUnderlying') !== -1) {
          if (wrapInputErrorUnderlying) {
            return wrapInputErrorUnderlying
          } else {
            return false
          }
        } else if (useSwapMethods.indexOf('anySwapOut') !== -1) {
          if (wrapInputError) {
            return wrapInputError
          } else {
            return false
          }
        }
      }
      return false
    } else {
      if (wrapInputErrorCrossBridge) {
        return wrapInputErrorCrossBridge
      } else {
        return false
      }
    }
  }, [useSwapMethods, wrapInputError, wrapInputErrorUnderlying, wrapInputErrorNative, isRouter, wrapInputErrorCrossBridge])
  // console.log(selectCurrency)
  const isInputError = useMemo(() => {
    // console.log(isWrapInputError)
    if (!selectCurrency) {
      return {
        state: 'Error',
        tip: t('selectToken')
      }
    } else if (!selectChain) {
      return {
        state: 'Error',
        tip: t('selectChainId')
      }
    } else if (inputBridgeValue !== '' || inputBridgeValue === '0') {
      if (isNaN(inputBridgeValue)) {
        return {
          state: 'Error',
          tip: t('inputNotValid')
        }
      } else if (inputBridgeValue === '0') {
        return {
          state: 'Error',
          tip: t('noZero')
        }
      } else if (isWrapInputError) {
        if (VALID_BALANCE) {
          return {
            state: 'Error',
            tip: isWrapInputError
          }
        } else {
          return undefined
        }
      } else if (Number(inputBridgeValue) < Number(destConfig.MinimumSwap)) {
        return {
          state: 'Error',
          tip: t('ExceedMinLimit', {
            amount: destConfig.MinimumSwap,
            symbol: selectCurrency.symbol
          })
        }
      } else if (Number(inputBridgeValue) > Number(destConfig.MaximumSwap)) {
        return {
          state: 'Error',
          tip: t('ExceedMaxLimit', {
            amount: destConfig.MaximumSwap,
            symbol: selectCurrency.symbol
          })
        }
      } else if (
        isLiquidity
        && (
          (isDestUnderlying && destChain && destChain.ts !== '' && Number(inputBridgeValue) > Number(destChain.ts))
          || (isDestUnderlying && !destChain)
        )
      ) {
        // if (selectCurrency.chainId === '1' && selectCurrency.symbol === "BitANT") {
        //   return undefined
        // }
        // console.log(destChain)
        return {
          state: 'Warning',
          tip: t('insufficientLiquidity')
        }
      }
    }
    return undefined
  }, [selectCurrency, selectChain, isWrapInputError, inputBridgeValue, destConfig, isDestUnderlying, destChain, isLiquidity])

  const errorTip = useMemo(() => {
    const isAddr = isAddress( recipient, selectChain)
    // console.log(isAddr)
    if (!evmAccount || !chainId) {
      return undefined
    } else if (isInputError) {
      return isInputError
    } else if (
      !Boolean(isAddr) 
    ) {
      return {
        state: 'Error',
        tip: t('invalidRecipient')
      }
    }
    return undefined
  }, [isInputError, selectChain, recipient, evmAccount, chainId])

  const isCrossBridge = useMemo(() => {
    if (errorTip || !inputBridgeValue) {
      if (
        (
          selectCurrency
          && selectCurrency.chainId === '1' && selectCurrency.symbol === "BitANT"
        )
        && errorTip
        && errorTip.state === 'Warning'
      ) {
      // if (selectCurrency && selectCurrency.chainId === '56' && selectCurrency.symbol === "USDC") {
        return false
      }
      return true
    }
    return false
  }, [errorTip, inputBridgeValue, selectCurrency])

  const btnTxt = useMemo(() => {
    // if (errorTip) {
    //   return errorTip?.tip
    // } else if (wrapType === WrapType.WRAP || wrapTypeNative === WrapType.WRAP || wrapTypeUnderlying === WrapType.WRAP || wrapTypeCrossBridge === WrapType.WRAP) {
    //   return t('swap')
    // }
    return t('swap')
  }, [errorTip, wrapType, wrapTypeNative, wrapTypeUnderlying, wrapTypeCrossBridge])

  const {initCurrency} = useInitSelectCurrency(allTokensList, chainId, initBridgeToken)

  useEffect(() => {
    setSelectCurrency(initCurrency)
  }, [initCurrency])

  useEffect(() => {
    // if (swapType == 'swap' && evmAccount && !isNaN(selectChain)) {
    if (evmAccount && !isNaN(selectChain)) {
      setRecipient(evmAccount)
    } else if (isNaN(selectChain)) {
      if (selectChain === ChainId.TERRA && connectedWallet?.walletAddress) {
        setRecipient(connectedWallet?.walletAddress)
      } else {
        setRecipient('')
      }
    }
  }, [evmAccount, swapType, selectChain])

  const {initChainId, initChainList} = useDestChainid(selectCurrency, selectChain, chainId)

  useEffect(() => {
    console.log(initChainId)
    setSelectChain(initChainId)
  }, [initChainId])

  useEffect(() => {
    setSelectChainList(initChainList)
  }, [initChainList])
  
  // const {initDestCurrency, initDestCurrencyList} = useDestCurrency(selectCurrency, selectCurrency?.destChains?.[selectChain])
  const {
    // initDestCurrency,
    initDestCurrencyList
  } = useDestCurrency(selectCurrency, selectCurrency?.destChains?.[selectChain])
  // console.log(selectChain)
  // console.log(selectCurrency?.destChains?.[selectChain])
  // useEffect(() => {
  //   setSelectDestCurrency(initDestCurrency)
  // }, [initDestCurrency])

  useEffect(() => {
    setInitUserSelect({useChainId: selectChain, toChainId: chainId, token: selectDestCurrency?.address})
  }, [selectDestCurrency, selectChain, chainId])

  useEffect(() => {
    // console.log('chainId',chainId)
    // console.log('selectChain',selectChain)
    if (chainId && selectChain && selectCurrency?.address) {
      setInitUserSelect({useChainId: chainId, toChainId: selectChain, token: selectCurrency?.address})
    }
  }, [selectCurrency, selectChain, chainId])

  useEffect(() => {
    setSelectDestCurrencyList(initDestCurrencyList)
  }, [initDestCurrencyList])

  const handleMaxInput = useCallback((value) => {
    if (value) {
      setInputBridgeValue(value)
    } else {
      setInputBridgeValue('')
    }
  }, [setInputBridgeValue])

  const handleSwap = useCallback(() => {
    onDelay()
    if (useSwapMethods) {
      if (
        useSwapMethods.indexOf('transfer') !== -1
        || useSwapMethods.indexOf('sendTransaction') !== -1
        || useSwapMethods.indexOf('Swapout') !== -1
      ) {
        if (onWrapCrossBridge) onWrapCrossBridge().then(() => {
          onClear()
        })
      } else if (useSwapMethods.indexOf('anySwapOutNative') !== -1) {
        if (onWrapNative) onWrapNative().then(() => {
          onClear()
        })
      } else if (useSwapMethods.indexOf('anySwapOutUnderlying') !== -1) {
        if (onWrapUnderlying) onWrapUnderlying().then((hash) => {
          console.log(hash)
          onClear()
        })
      } else if (useSwapMethods.indexOf('anySwapOut') !== -1) {
        if (onWrap) onWrap().then(() => {
          onClear()
        })
      }
    }
  }, [useSwapMethods, onWrapCrossBridge, onWrapNative, onWrapUnderlying, onWrap])
  const [xrplimit, setXrplimit] = useState<any>('NONE')
  useEffect(() => {
    if (
      selectChain === ChainId.XRP
      && recipient
      && recipient.indexOf('0x') !== 0
      && destConfig?.address !== 'XRP'
    ) {
      // const symbol = destConfig.symbol
      getUrlData(`${config.bridgeApi}/xrp/trustset/${recipient}`).then((res:any) => {
        console.log(res)
        if (res.msg === 'Success') {
          const data = res.data?.result?.lines ?? []
          let type = ''
          for (const item of data) {
            // if (item.currency === symbol) {
            if (destConfig.address.indexOf(item.account) !== -1) {
              if (Number(item.limit) > Number(inputBridgeValue)) {
                type = 'PASS'
              } else {
                type = 'NOPASS'
              }
              break
            }
          }
          if (type) {
            setXrplimit(type)
          } else {
            setXrplimit('ERROR')
          }
        } else {
          setXrplimit('ERROR')
        }
      })
    } else {
      setXrplimit('NONE')
    }
  }, [getUrlData, selectChain, recipient, destConfig, inputBridgeValue])
  const maxInputValue = Math.ceil(inputBridgeValue)
  
  const xrpurl = useMemo(() => {
    let url = ''
    if (
      selectChain === ChainId.XRP
      && destConfig?.address !== 'XRP'
    ) {
      const result = destConfig?.address?.split('/')
      // console.log(result)
      if (result && result.length === 2) {
        url = `https://xrpl.services/?issuer=${result[1]}&currency=${result[0]}&limit=${maxInputValue}`
      }
    }
    return url
  }, [destConfig, selectChain, maxInputValue])
  const [nearStorageBalance, setNearStorageBalance] = useState<any>()
  const getNearStorage = useCallback(() => {
    if (
      [ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChain) 
      && recipient
      && ['TOKEN'].includes(destConfig?.tokenType)
    ) {
      getNearStorageBalance({token: destConfig.address,account: recipient, chainId: selectChain}).then((res:any) => {
        console.log(res)
        if (res?.total) {
          setNearStorageBalance(res.total)
        } else {
          setNearStorageBalance('')
        }
      })
    } else {
      setNearStorageBalance('')
    }
  }, [selectChain, recipient, destConfig])

  useEffect(() => {
    getNearStorage()
  }, [selectChain, recipient])
  useInterval(getNearStorage, 1000 * 10)

  function CrossChainTip () {
    if (isApprove && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)) {
      return <>
        <LogoBox>
          <TokenLogo symbol={selectCurrency?.symbol ?? selectCurrency?.symbol} logoUrl={selectCurrency?.logoUrl} size={'1rem'}></TokenLogo>
        </LogoBox>
        <TxnsInfoText>{config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId)}</TxnsInfoText>
        <ConfirmText>
          {
            t('approveTip', {
              symbol: config.getBaseCoin(selectCurrency?.symbol, chainId),
            })
          }
        </ConfirmText>
      </>
    } else if (
      selectChain === ChainId.XRP
      && xrplimit === 'NOPASS'
    ) {
      return <ConfirmText>
        Get trust set error, the transaction may fail.Please use <a href={xrpurl} target='__blank'>{xrpurl}</a>
      </ConfirmText>
    } else if (
      !nearStorageBalance
      && [ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChain)
      && ['TOKEN'].includes(destConfig?.tokenType)
    ) {
      if (window?.near?.account()) {
        return <ConfirmText>
          Get storage balance of receive account error, the transaction may fail.Please deposit near to the token&apos;s storage.
        </ConfirmText>
      } else {
        return <ConfirmText>
          Get storage balance of receive account error, the transaction may fail.Please deposit near to the token&apos;s storage.
        </ConfirmText>
      }
    } else {
      let otherTip:any
      if (selectChain === ChainId.XRP && xrplimit === 'ERROR') {
        otherTip = <ConfirmText>
          Get trust set error, the transaction may fail.Please use <a href={xrpurl} target='__blank'>{xrpurl}</a>
        </ConfirmText>
      } else if (selectDestCurrency?.symbol?.indexOf('FRAX') !== -1 && !isDestUnderlying) {
        otherTip = <ConfirmText>
          Please use <a href='https://app.frax.finance/crosschain' target='__blank'>https://app.frax.finance/crosschain</a> to swap into native FRAX on destination chain.
        </ConfirmText>
      }
      return <>
        <ConfirmView
          fromChainId={chainId}
          value={inputBridgeValue}
          toChainId={selectChain}
          swapvalue={outputBridgeValue}
          recipient={recipient}
          destConfig={destConfig}
          selectCurrency={selectCurrency}
          fee={fee}
        />
        {
          isDestUnderlying ? (
            <>
              <ConfirmText>
                {
                  t('swapTip', {
                    symbol: anyToken?.symbol,
                    symbol1: selectCurrency?.symbol,
                    chainName: config.getCurChainInfo(selectChain).name
                  })
                }
              </ConfirmText>
            </>
          ) : (
            <></>
          )
        }
        {otherTip}
      </>
    }
  }

  function ViemConfirmBtn () {
    if (!evmAccount) {
      return <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
    } else if (isApprove && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)) {
      return <ButtonConfirmed
        onClick={() => {
          onDelay()
          approveCallback().then(() => {
            onClear(1)
          })
        }}
        disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
        width="48%"
        altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
        // confirmed={approval === ApprovalState.APPROVED}
      >
        {approval === ApprovalState.PENDING ? (
          <AutoRow gap="6px" justify="center">
            {t('Approving')} <Loader stroke="white" />
          </AutoRow>
        ) : approvalSubmitted ? (
          t('Approved')
        ) : (
          t('Approve') + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId)
        )}
      </ButtonConfirmed>
    } else if (
      selectChain === ChainId.XRP
      && xrplimit === 'NOPASS'
    ) {
      return <ButtonPrimary onClick={() => {
        window.open(xrpurl)
      }}>
        TRUST SET
      </ButtonPrimary>
    } else if (
      !nearStorageBalance
      && [ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChain)
      && ['TOKEN'].includes(destConfig?.tokenType)
    ) {
      return <ButtonPrimary disabled={!isAddress(recipient, selectChain)} onClick={() => {
        depositStorageNear(destConfig?.address, recipient).then(() => {
          alert('Deposit storage success.')
        }).catch(() => {
          alert('Deposit storage failure.')
        })
      }}>
        Deposit Storage
      </ButtonPrimary>
    } else {
      return <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
        handleSwap()
      }}>
        {t('Confirm')}
      </ButtonPrimary>
    }
  }

  return (
    <>
      <ModalContent
        isOpen={modalTipOpen}
        title={'Cross-chain Router'}
        onDismiss={() => {
          setModalTipOpen(false)
        }}
        padding={'10px 2rem 20px'}
      >
        <ConfirmContent>
          <CrossChainTip />
          <BottomGrouping>
            <ViemConfirmBtn />
          </BottomGrouping>
        </ConfirmContent>
      </ModalContent>

      <AutoColumn gap={'sm'}>

        <SelectCurrencyInputPanel
          label={t('From')}
          value={inputBridgeValue}
          onUserInput={(value) => {
            // console.log(value)
            setInputBridgeValue(value)
          }}
          onCurrencySelect={(inputCurrency) => {
            setSelectCurrency(inputCurrency)
            setIsUserSelect(false)
          }}
          onMax={(value) => {
            handleMaxInput(value)
          }}
          currency={selectCurrency}
          disableCurrencySelect={false}
          showMaxButton={true}
          isViewNetwork={true}
          customChainId={chainId}
          onOpenModalView={(value) => {
            // console.log(value)
            setModalOpen(value)
          }}
          isViewModal={modalOpen}
          id="selectCurrency"
          isError={Boolean(isInputError)}
          isNativeToken={isNativeToken}
          bridgeKey={bridgeKey}
          allTokens={allTokensList}
          isRouter={isRouter}
        />
        {
          evmAccount && chainId && curChain?.ts ? (
            <>
              <LiquidityPool
                curChain={curChain}
                // destChain={destChain}
                // isUnderlying={isUnderlying}
                selectCurrency={selectCurrency}
                // isDestUnderlying={isDestUnderlying}
              />
            </>
          ) : ''
        }

        <AutoRow justify="center" style={{ padding: '0 1rem' }}>
          <ArrowWrapper clickable={false} style={{cursor:'pointer'}} onClick={() => {
            // toggleNetworkModal()
            changeNetwork(selectChain)
          }}>
            <ArrowDown size="16" color={theme.text2} />
          </ArrowWrapper>
          {
            // destConfig?.type !== 'swapin' && !isNaN(selectChain) ? (
            destConfig?.type !== 'swapin' && !isNaN(selectChain) && !isNaN(chainId) ? (
              <ArrowWrapper clickable={false} style={{cursor:'pointer', position: 'absolute', right: 0}} onClick={() => {
                if (swapType === 'swap') {
                  setSwapType('send')
                } else {
                  setSwapType('swap')
                  if (evmAccount) {
                    setRecipient(evmAccount)
                  }
                }
              }}>
                {
                  swapType === 'swap' ? (
                    <FlexEC>
                      <Plus size="16" color={theme.text2} /> <span style={{fontSize: '12px', lineHeight:'12px'}}>{t('sendto')}</span>
                    </FlexEC>
                  ) : (
                    <FlexEC>
                      <Minus size="16" color={theme.text2} /> <span style={{fontSize: '12px', lineHeight:'12px'}}>{t('sendto')}</span>
                    </FlexEC>
                  )
                }
              </ArrowWrapper>
            ) : ''
          }
        </AutoRow>

        <SelectChainIdInputPanel
          label={t('to')}
          value={outputBridgeValue.toString()}
          onUserInput={(value) => {
            setInputBridgeValue(value)
          }}
          onChainSelect={(chainID) => {
            setSelectChain(chainID)
            setIsUserSelect(false)
          }}
          selectChainId={selectChain}
          id="selectChainID"
          onCurrencySelect={(inputCurrency) => {
            setSelectDestCurrency(inputCurrency)
            setIsUserSelect(true)
          }}
          bridgeConfig={selectCurrency}
          isNativeToken={isNativeToken}
          selectChainList={selectChainList}
          selectDestCurrency={selectDestCurrency}
          selectDestCurrencyList={selectDestCurrencyList}
          bridgeKey={bridgeKey}
        />
        {
          evmAccount && chainId && destChain?.ts ? (
            <LiquidityPool
              destChain={destChain}
              // isDestUnderlying={isDestUnderlying}
              selectCurrency={destConfig}
            />
          ) : ''
        }
        {
          (swapType === 'send' && !isNaN(chainId) && destConfig?.type != 'swapin')
          || (isNaN(selectChain))
          || isNaN(chainId) ? (
            <AddressInputPanel id="recipient" value={recipient} label={t('Recipient')} labelTip={'( ' + t('receiveTip') + ' )'} onChange={setRecipient} isValid={false} selectChainId={selectChain} isError={!Boolean(isAddress( recipient, selectChain))} />
          ) : ''
        }

        <RouterList
          selectCurrency={selectCurrency}
          // tipTitleKey=""
          selectChain={selectChain}
          selectDestKey={destConfig.key}
          routerlist={selectDestCurrencyList}
          inputBridgeValue={inputBridgeValue}
          sortType={'LIQUIDITYUP'}
          isUserSelect={isUserSelect}
          onUserCurrencySelect={(inputCurrency) => {
            setSelectDestCurrency(inputCurrency)
            setIsUserSelect(true)
          }}
          onCurrencySelect={(inputCurrency) => {
            setSelectDestCurrency(inputCurrency)
          }}
        />
      </AutoColumn>

      <Reminder destConfig={destConfig} bridgeType='bridgeAssets' currency={selectCurrency} selectChain={selectChain}/>

      <ErrorTip errorTip={errorTip} />
      {
        config.isStopSystem ? (
          <BottomGrouping>
            <ButtonLight disabled>{t('stopSystem')}</ButtonLight>
          </BottomGrouping>
        ) : (
          <BottomGrouping>
            {!evmAccount ? (
                <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
              ) : (
                isApprove && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)? (
                  <>
                    <ButtonConfirmed
                      onClick={() => {
                        setModalTipOpen(true)
                      }}
                      disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
                      width="48%"
                      altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                    >
                      {approval === ApprovalState.PENDING ? (
                        <AutoRow gap="6px" justify="center">
                          {t('Approving')} <Loader stroke="white" />
                        </AutoRow>
                      ) : approvalSubmitted ? (
                        t('Approved')
                      ) : (
                        t('Approve') + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId)
                      )}
                    </ButtonConfirmed>
                    <ButtonConfirmed disabled={true} width="45%" style={{marginLeft:'10px'}}>
                        {t('swap')}
                      </ButtonConfirmed>
                  </>
                ) : (
                  <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
                  // <ButtonPrimary  onClick={() => {
                    setModalTipOpen(true)
                  }}>
                    {btnTxt}
                  </ButtonPrimary>
                )
              )
            }
          </BottomGrouping>
        )
      }
    </>
  )
}