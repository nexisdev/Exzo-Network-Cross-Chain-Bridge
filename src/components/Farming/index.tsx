/*eslint-disable*/
import React, {useCallback, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { createBrowserHistory } from 'history'
import styled from 'styled-components'
import { Text } from 'rebass'
import { ethers } from 'ethers'
import { formatUnits } from '@ethersproject/units'
// import { transparentize } from 'polished'
import { useFarmContract, useTokenContract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks'

import { useWalletModalToggle } from '../../state/application/hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

import { Button } from '../../theme'

// import MasterChef from '../../constants/abis/farm/MasterChef.json'
// import ERC20_ABI from '../../constants/abis/erc20.json'

import Modal from '../Modal'
import Column from '../Column'
import { PaddedColumn, Separator } from '../SearchModal/styleds'
import { RowBetween } from '../Row'
import { CloseIcon } from '../../theme'

import config from '../../config'
// import {fromWei, formatWeb3Str, toWei} from '../../utils/tools/tools'
import {fromWei, toWei, formatDecimal} from '../../utils/tools/tools'

import TokenLogo from '../TokenLogo'

import {getBaseInfo} from './common'


const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.25rem 0rem 0.75rem;
  width:100%;
`

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;

  button {
    max-width: 20rem;
  }
  &.pd0 {
    padding: 0
  }
`
const Input = styled.input`
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  height: 70px;
  background-color: transparent;
  border-bottom: 0.0625rem solid ${({theme}) => theme.inputBorder};

  color: ${({ theme }) => theme.textColorBold};
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Manrope';
  font-size: 44px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: -0.0625rem;
  padding: 8px 0.75rem;
  margin-right: 1.875rem;
  ::placeholder {
    color: ${({ theme }) => theme.placeholderGray};
  }
  &.small {
    font-size: 24px;
    margin-right: 0rem;
  }
  @media screen and (max-width: 960px) {
    font-size: 32px;
  }
`

const TokenLogo1 = styled(TokenLogo)`
background:none;
`

const Button1 = styled(Button)`
  ${({theme}) => theme.flexC};
  background: ${({ theme }) => theme.primary1};
  color:#fff;
  white-space:nowrap;
  :disabled {
    opacity: 0.5;
    color:#fff;
  }
`

const ComineSoon = styled.div`
  ${({theme}) => theme.flexC}
  width: 200px;
  font-family: 'Manrope';
  font-size: 0.75rem;
  color: #96989e;
  height: 45px;
  padding: 0 8px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.modalBG};
  white-space: nowrap;
`

const FarmListBox = styled.div`
  ${({ theme }) => theme.flexSC};
  width: 100%;
  flex-wrap:wrap;
`

const FarmList = styled.div`
  ${({ theme }) => theme.flexC};
  width: 33.33%;
  padding: 0 10px;
  margin-bottom: 20px;
  @media screen and (min-width: 761px) and (max-width: 1140px) {
    width: 50%;
  }
  @media screen and (max-width: 760px) {
    width: 100%;
  }
`
const FarmListCont = styled.div`
  width:100%;
  // height: 260px;
  background: ${({ theme }) => theme.contentBg};
  box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
  display:block;
  border-radius: 10px;
  padding: 40px 10px;
  position:relative;
`

const MulLabel = styled.div`
  min-width:40px;
  padding: 3px 5px;
  border-radius: 10px;
  position:absolute;
  top:20px;
  left: 20px;
  background: ${({ theme }) => theme.primary1};
  color:#fff;
  font-size:16px;
  text-align:center;
`

const DoubleLogo = styled.div`
  ${({ theme }) => theme.flexC};
  width: 100%;
  position:relaitve;
  margin-top: 30px;
  .logo {
    width: 70px;
    height: 70px;
    border-radius: 100%;
    // background:#fff;
    img {
      height: 100%;
      display:block;
    }
  }
  .right {
    // margin-left: -15px;
    z-index: 0;
  }
  .addIcon {
    font-size: 40px;
    margin: 0 10px;
  }
  .left {
    z-index: 1;
  }
`

const FarmInfo = styled.div`
  width:100%;
  padding: 10px;
  font-size: 12px;
  margin: 30px 0;
  .item {
    ${({ theme }) => theme.flexBC};
    width: 100%;
    margin: 10px 0;
    font-size: 16px;
    .left {
      color:#969DAC;
    }
    .right {
      color:${({ theme }) => theme.textColor};
    }
  }
`
const StakingBox = styled.div`
  width:100%;
`

const StakingList = styled.ul`
  ${({ theme }) => theme.flexC};
  list-style:none;
  padding:0!important;

  .item {
    ${({ theme }) => theme.flexC};
    flex-wrap:wrap;
    width:100%;
    max-width: 320px;
    background: ${({ theme }) => theme.contentBg};
    box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
    margin: 15px 15px 20px;
    padding: 25px 15px 40px;
    border-radius: 10px;

    .pic {
      ${({ theme }) => theme.flexC};
      width:70px;
      height:70px;
      // padding:15px;
      // background:#fff;
      border-radius:100%;
      margin:auth;
      margin-top:30px;
      img {
        display:block;
        width:100%;
      }
    }
    .info {
      width:100%;
      text-align:center;
      margin:30px 0;
      h3 {
        color: ${({ theme }) => theme.textColorBold};
        font-size:16px;
        margin:0;
      }
      p {
        color: #969DAC;
        font-size:14px;
        margin-bottom:0;
      }
    }
    .btn {
      ${({ theme }) => theme.flexC};
      width:100%;
    }
  }
  .green {
    color: #2ead65;
  }
  @media screen and (max-width: 960px) {
    flex-wrap:wrap;
  }
`

const AddBox = styled(Button)`
  ${({ theme }) => theme.flexC};
  width: 45px;
  min-width: 45px;
  height:45px;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  box-shadow: 0 0.25rem 8px 0 ${({ theme }) => theme.shadow2};
  background: ${({theme}) => theme.tipBg};
  border-radius: 9px;
  margin-left:15px;
  cursor:pointer;
  padding:0;
  &:hover, &:focus{
    border: solid 0.5px ${({ theme }) => theme.tipBorder};
    box-shadow: 0 0.25rem 8px 0 ${({ theme }) => theme.shadow2};
    background: ${({theme}) => theme.tipBg};
  }
`

const StakingModalBox = styled.div`
  ${({ theme }) => theme.flexC}
  width:100%;
  padding: 25px 15px 30px;
  flex-wrap:wrap;
`
const MaxBox = styled.div`
  ${({ theme }) => theme.flexC};
  width:60px;
  height:50px;
  margin-left:15px;
  border-radius:10px;
  cursor:pointer;
  background:${({ theme }) => theme.tipBg};
`
const AmountView = styled.div`
  width:100%;
  padding:10px 25px;
  font-size:14px;
  color:${({ theme }) => theme.textColor};
  margin-bottom:20px;
`

const StakingLi = styled.li`
  width: 320px;
  ${({ theme }) => theme.flexSC};
  // flex-wrap:wrap;
  background: ${({ theme }) => theme.contentBg};
  box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
  margin: 20px 15px 0;
  padding: 25px 15px 25px;
  border-radius: 10px;
  .title {
    width:100%;
    margin:0;
    font-size:14px;
    color: ${({ theme }) => theme.textColorBold};
  }
  .num {
    width:100%;
    margin:10px 0 0;
    font-size:16px;
    color: ${({ theme }) => theme.textColorBold};
    p {
      margin: 0;
    }
  }
  .content {
    width:100%;
    margin-left:15px;
  }
`

const BackBox = styled.div`
  cursor:pointer;
  display:inline-block;
`

interface FarmProps {
  FARMTOKEN?:any,
  FARMURL?:any,
  initPairs?:any,
  poolCoin?:any,
  poolCoinLogoUrl?:any,
  CHAINID?:any,
  blockNumber?:any,
  BASEMARKET?:any,
  price?:any,
  // version?:any,
  initLpList?:any,
  stakeType?:any,
  LPprice?:any,
}

export default function Farming ({
  FARMTOKEN,
  FARMURL,
  initPairs = [],
  poolCoin,
  poolCoinLogoUrl,
  CHAINID,
  blockNumber = 28800,
  BASEMARKET = 100,
  price,
  // version,
  initLpList,
  stakeType,
  LPprice
}: FarmProps) {
  
  const { account, chainId } = useActiveWeb3React()
  // account = '0x12139f3afa1C93303e1EfE3Df142039CC05C6c58'
  const { t } = useTranslation()
  const [isDark] = useDarkModeManager()
  const toggleWalletModal = useWalletModalToggle()
  const addTransaction = useTransactionAdder()
  

  const history = createBrowserHistory()
  // history.push(window.location.pathname + '')
  const [LpList, setLpList] = useState<any>()
  
  const [stakingType, setStakingType] = useState<any>()
  const [stakingModal, setStakingModal] = useState<any>(false)
  const [stakeAmount, setStakeAmount] = useState<any>()
  const [stakeDisabled, setStakeDisabled] = useState<any>(true)

  const [exchangeAddress, setExchangeAddress] = useState<any>('')
  // console.log(exchangeAddress)

  const [unlocking, setUnlocking] = useState<any>(false)
  const [approveAmount, setApproveAmount] = useState<any>()
  const [balance, setBalance] = useState<any>()
  const [userInfo, setUserInfo] = useState<any>()

  const [HarvestDisabled, setHarvestDisabled] = useState<any>(true)
  const [WithdrawDisabled, setWithdrawDisabled] = useState<any>(true)
  const [DepositDisabled, setDepositDisabled] = useState<any>(true)

  const [BtnDelayDisabled, setBtnDelayDisabled] = useState<any>(0)

  // const [BasePeice, setBasePeice] = useState<any>()

  const [InterverTime, setInterverTime] = useState<any>(0)
  // const [CYCMarket, setCYCMarket] = useState<any>()

  const MMContract = useFarmContract(FARMTOKEN)

  const MMErcContract = useTokenContract(exchangeAddress)

  const dec = LpList && exchangeAddress && LpList[exchangeAddress] ? LpList[exchangeAddress]?.tokenObj?.decimals : ''

  useEffect(() => {
    let pr = LpList && LpList[exchangeAddress] && LpList[exchangeAddress].pendingReward ? LpList[exchangeAddress].pendingReward : ''
    // console.log(pr)
    // console.log(BtnDelayDisabled)
    if (approveAmount && Number(approveAmount) && account && Number(CHAINID) === Number(chainId) && exchangeAddress) {
      if (pr && Number(pr) > 0 && BtnDelayDisabled !== 2) {
        setHarvestDisabled(false)
      } else {
        setHarvestDisabled(true)
      }

      if (balance && Number(balance) > 0 && BtnDelayDisabled !== 1) {
        setDepositDisabled(false)
      } else {
        setDepositDisabled(true)
      }
      
      if (userInfo && Number(userInfo) > 0 && BtnDelayDisabled !== 2) {
        setWithdrawDisabled(false)
      } else {
        setWithdrawDisabled(true)
      }
    } else {
      setHarvestDisabled(true)
      setDepositDisabled(true)
      setWithdrawDisabled(true)
    }
  }, [approveAmount, balance, userInfo, account, BtnDelayDisabled, LpList, exchangeAddress, CHAINID, chainId])

  useEffect(() => {
    let status = true
    if (stakeAmount && !isNaN(stakeAmount) && Number(stakeAmount) > 0 && !BtnDelayDisabled) {
      
      const amount = stakeAmount
      const value = fromWei(balance, dec, dec)
      const ui = fromWei(userInfo, dec, dec)
      if (stakingType === 'deposit') {
        if (!value || Number(value) < Number(amount)) {
          status = true
        } else {
          status = false
        }
      } else {
        if (!ui || Number(ui) < Number(amount)) {
          status = true
        } else {
          status = false
        }
      }
    } else {
      if (Number(stakeAmount) !== 0) {
        setStakeAmount('')
      }
    }
    
    setStakeDisabled(status)
  }, [stakingType, balance, stakeAmount, BtnDelayDisabled, exchangeAddress, userInfo])

  const getStakingInfo = useCallback(() => {
  // function getStakingInfo () {
    const curLpToken = exchangeAddress
    
    if (account && curLpToken && LpList && LpList[curLpToken] && Number(CHAINID) === Number(chainId)) {
      if (MMErcContract) {
        MMErcContract.balanceOf(account).then((res:any) => {
          // console.log('balanceOf')
          // console.log(res?.toString())
          setBalance(res?.toString())
        })
        MMErcContract.allowance(account, FARMTOKEN).then((res:any) => {
          // console.log('allowance')
          // console.log(res?.toString())
          setApproveAmount(res?.toString())
          if (Number(res?.toString()) > 0) {
            setUnlocking(false)
          }
        })
      }
      if (MMContract) {
        MMContract.userInfo(LpList[curLpToken].index, account).then((res:any) => {
          // console.log('userInfo')
          // console.log(res)
          setUserInfo(res[0]?.toString())
        })
      }
    }
  }, [account, exchangeAddress, LpList, MMContract, MMErcContract, CHAINID, chainId])

  useEffect(() => {
    getStakingInfo()
  // }, [InterverTime])
  }, [account, exchangeAddress, LpList, MMContract, MMErcContract, CHAINID, chainId])

  useEffect(() => {
    if (initLpList) {
      getBaseInfo(initLpList, CHAINID, FARMTOKEN, account, blockNumber, price).then((res:any) => {
        console.log(res)
        setLpList(res.lpArr)
        // getStakingInfo()
      })
      setTimeout(() => {
        setInterverTime(InterverTime + 1)
      }, 1000 * 10)
    }
  }, [CHAINID, InterverTime, price, account])

  function backInit () {
    setStakingModal(false)
    setStakeAmount('')
    setStakingType('')
  }

  function deposit () {
    console.log(MMContract)
    if (isNaN(stakeAmount)) {
      console.log(1)
      setStakeAmount('')
      alert('Param is error!')
      return
    } else if (Number(stakeAmount) <= 0) {
      setStakeAmount('')
      alert('Amount must be greater than 0!')
      return
    } else if (!MMContract) {
      console.log(2)
      setStakeAmount('')
      alert('Param is error!')
      return
    }
    setBtnDelayDisabled(1)
    setTimeout(() => {
      setBtnDelayDisabled(0)
    }, 3000)
    try {
      let amount = toWei(stakeAmount, dec)
      console.log(amount.toString())
      MMContract.deposit(LpList[exchangeAddress].index, amount).then((res:any) => {
        console.log(res)
        addTransaction(res, { summary: `Stake ${stakeAmount} ${LpList[exchangeAddress]?.tokenObj?.symbol}` })
        backInit()
      }).catch((err:any) => {
        console.log(err)
        backInit()
      })
    } catch (error) {
      alert(error.toString())
    }
  }

  function withdraw (amount?:any) {
    if (isNaN(stakeAmount) && !amount) {
      setStakeAmount('')
      alert('Param is error!')
      return
    } else if (Number(stakeAmount) <= 0 && amount) {
      setStakeAmount('')
      alert('Amount must be greater than 0!')
      return
    } else if (!MMContract) {
      setStakeAmount('')
      alert('Param is error!')
      return
    }
    setBtnDelayDisabled(2)
    setTimeout(() => {
      setBtnDelayDisabled(0)
    }, 3000)
    try {
      
      amount = amount || amount === 0 ? amount : toWei(stakeAmount, dec)
      // console.log(amount.toString())
      
      MMContract.withdraw(LpList[exchangeAddress].index, amount.toString()).then((res:any) => {
        console.log(res)
        addTransaction(res, { summary: `Stake ${stakeAmount} ${LpList[exchangeAddress]?.tokenObj?.symbol}` })
        backInit()
      }).catch((err:any) => {
        console.log(err)
        backInit()
      })
    } catch (error) {
      alert(error.toString())
    }
  }

  function approve () {
    if (!MMErcContract) {
      return
    }
    setBtnDelayDisabled(1)
    setTimeout(() => {
      setBtnDelayDisabled(0)
    }, 3000)
    let _userTokenBalance = ethers.constants.MaxUint256.toString()
    // console.log(MMErcContract)
    MMErcContract.approve(FARMTOKEN, _userTokenBalance).then((res:any) => {
      console.log(res)
      addTransaction(res, { summary: `Approve ${LpList[exchangeAddress]?.tokenObj?.symbol}` })
      setUnlocking(true)
      backInit()
    }).catch((err:any) => {
      console.log(err)
      backInit()
    })
  }

  function onMax () {
    // console.log(balance)
    let amount = ''
    if (stakingType === 'deposit') {
      amount = formatUnits(balance, dec)
    } else {
      amount = formatUnits(userInfo, dec)
    }
    // console.log(formatDecimal(amount, dec))
    setStakeAmount(amount)
  }

  // console.log(LpList)
  function farmsList () {
    if (LpList && Object.keys(LpList).length <= 0 && initPairs.length > 0) {
      return (
        <>
          <FarmListBox>
            {initPairs.map((item:any, index:any) => {
              return <FarmList key={index}>
                <FarmListCont>
                  <DoubleLogo>
                    <div className="logo left">
                      <TokenLogo1 symbol={item} size='100%'/>
                    </div>
                    <div className="addIcon">+</div>
                    <div className="logo right">
                      <TokenLogo1 symbol={config.getCurChainInfo(CHAINID).symbol} size='100%'/>
                    </div>
                    
                  </DoubleLogo>
                  <FarmInfo>
                    <div className="item">
                      <span className="left">Deposit</span>
                      <span className="right">{item} - {config.getCurChainInfo(CHAINID).symbol} {stakeType}</span>
                    </div>
                    <div className="item">
                      <span className="left">APR</span>
                      <span className="right">-- %</span>
                    </div>
                    <div className="item">
                      <span className="left">Total Liquidity</span>
                      <span className="right">$ --</span>
                    </div>
                  </FarmInfo>
                  <Flex>
                    {
                      account ? (
                        <ComineSoon><img alt={''} src={require('../../assets/images/icon/schedule.svg')} style={{marginRight: '10px'}} />{t('ComineSoon')}</ComineSoon>
                      ) : (
                        <Button1 onClick={toggleWalletModal}  style={{height: '45px',maxWidth: '200px'}}>
                          {t('ConnectWallet')}
                        </Button1>
                      )
                    }
                  </Flex>
                </FarmListCont>
              </FarmList>
            })}
          </FarmListBox>
        </>
      )
    }
    
    return (
      <>
        <FarmListBox>
          {
            LpList && Object.keys(LpList).length > 0 ? Object.keys(LpList).map((key:any, index:any) => {
              const item = LpList[key]
              return (
                <FarmList key={index}>
                  <FarmListCont>
                    <MulLabel>{item && item.allocPoint ? (Number(item.allocPoint) / BASEMARKET).toFixed(0) : '1'} X</MulLabel>
                    <DoubleLogo>
                      <div className="logo left">
                        <TokenLogo1 symbol={item && item.tokenObj && item.tokenObj.symbol ? item.tokenObj.symbol : ''} size='100%'/>
                      </div>
                      <div className="addIcon">+</div>
                      <div className="logo right">
                        <TokenLogo1 symbol={config.getCurChainInfo(CHAINID).symbol} size='100%'/>
                      </div>
                      
                    </DoubleLogo>
                    <FarmInfo>
                      <div className="item">
                        <span className="left">Deposit</span>
                        <span className="right">{item && item.tokenObj && item.tokenObj.symbol ? item.tokenObj.symbol : ''} {stakeType}</span>
                      </div>
                      <div className="item">
                        <span className="left">APR</span>
                        <span className="right">{item.apy} %</span>
                      </div>
                      <div className="item">
                        <span className="left">Total Liquidity</span>
                        <span className="right">$ {
                        item.lpBalance ? 
                        (LPprice ? Number(fromWei(item.lpBalance,item.tokenObj.decimals)) * LPprice : Number(fromWei(item.lpBalance,item.tokenObj.decimals))).toFixed(2) : '0.00'}</span>
                      </div>
                    </FarmInfo>
                    <Flex>
                      {
                        account ? (
                          <Button1 style={{height: '45px', maxWidth: '200px'}} onClick={() => {
                            setExchangeAddress(item.lpToken.toLowerCase())
                          }}>{t('select')}</Button1>
                        ) : (
                          <Button1 onClick={toggleWalletModal}  style={{height: '45px',maxWidth: '200px'}}>
                            {t('ConnectWallet')}
                          </Button1>
                        )
                      }
                    </Flex>
                  </FarmListCont>
                </FarmList>
              )
            }) : ''
          }
        </FarmListBox>
      </>
    )
  }

  function getPoolBaseBalance (lpBalance:any) {
    if ( lpBalance ) {
      const t = fromWei(lpBalance, dec)
      if (userInfo) {
        const u = fromWei(userInfo, dec)
        let pecent = Number(u) / Number(t)
        pecent = Number(pecent) * 100
        return {
          ta: t,
          utb: u,
          pecent: pecent
        }
      } else {
        return {
          ta: t,
          utb: '',
          pecent: ''
        }
      }
    }
    return {
      ta: '',
      utb: '',
      pecent: ''
    }
    // userInfo
  }

  function stakingView () {
    let btnView:any = ''
    if (Number(CHAINID) !== Number(chainId)) {
      btnView = <Button1 onClick={() => {
        localStorage.setItem(config.ENV_NODE_CONFIG, config.getCurChainInfo(CHAINID).label)
        history.go(0)
      }}  style={{height: '45px', maxWidth: '200px'}}>
        {t('SwitchTo')} {config.getCurChainInfo(CHAINID).name} {t('mainnet')}
      </Button1>
    } else if (!account) {
      btnView = <Button1 onClick={toggleWalletModal}  style={{height: '45px',maxWidth: '200px'}}>
        {t('ConnectWallet')}
      </Button1>
    } else if (approveAmount && Number(approveAmount)) {
      btnView = <>
        <Button1 style={{height: '45px', maxWidth: '200px'}} disabled={WithdrawDisabled} onClick={() => {
          setStakingType('Unstake')
          setStakingModal(true)
        }}>{t('Unstake')}</Button1>
        <AddBox disabled={DepositDisabled} onClick={() => {
          setStakingType('deposit')
          setStakingModal(true)
        }}>
          {
            isDark ? (
              <img src={require('../../assets/images/icon/add-fff.svg')} alt='' />
            ) : (
              <img src={require('../../assets/images/icon/add.svg')} alt='' />
            )
          }
        </AddBox>
      </>
    } else {
      btnView = <Button1 style={{height: '45px', maxWidth: '200px'}} disabled={BtnDelayDisabled || unlocking} onClick={() => {
        approve()
      }}>{unlocking ? t('pending') : t('unlock')}</Button1>
    }
    let curLpObj = LpList && LpList[exchangeAddress] ? LpList[exchangeAddress] : {}
    
    let prd = curLpObj.pendingReward && Number(curLpObj.pendingReward.toString()) > 0 ? curLpObj.pendingReward : ''
    // console.log(prd)
    prd = prd ? fromWei(prd, 18, 6) : '0.00'

    let pbaObj:any = curLpObj && curLpObj.lpBalance ? getPoolBaseBalance(curLpObj.lpBalance) : ''

    return (
      <>
        <BackBox onClick={() => {
          history.push(FARMURL)
          // localStorage.setItem(LPTOKEN, '')
          setExchangeAddress('')
        }}>
          &lt;Back
        </BackBox>
        <StakingBox>
          <StakingList>
            <StakingLi>
              <TokenLogo1 symbol={curLpObj && curLpObj.tokenObj && curLpObj.tokenObj.symbol ? curLpObj.tokenObj.symbol : ''} size='48px'></TokenLogo1>
              <div className='content'>
                <h2 className='title'>{t('TotalStaking')}</h2>
                <h3 className='num'>
                  <p>{curLpObj.lpBalance ? fromWei(curLpObj.lpBalance, dec, 2) : '0.00'} {(curLpObj && curLpObj.tokenObj && curLpObj.tokenObj.symbol ? curLpObj.tokenObj.symbol : '')}</p>
                  {/* <p>{pbaObj.ba ? fromWei(pbaObj.ba, 18, 6) : '0.00'} {config.getCurChainInfo(CHAINID).symbol}</p> */}
                </h3>
              </div>
            </StakingLi>
            <StakingLi>
              {/* <h2 className='title'>Total ANY Supply</h2> */}
              <div className='content'>
                <h2 className='title'>{t('MyStaking')}({pbaObj.pecent ? formatDecimal(pbaObj.pecent, 2) : '0.00'} %)</h2>
                <h3 className='num'>
                  <p>{pbaObj.utb ? formatDecimal(pbaObj.utb, 2) : '0.00'} {(curLpObj && curLpObj.tokenObj && curLpObj.tokenObj.symbol ? curLpObj.tokenObj.symbol : '')}</p>
                  {/* <p>{pbaObj.ubb ? fromWei(pbaObj.ubb, 18, 6) : '0.00'} {config.getCurChainInfo(CHAINID).symbol}</p> */}
                  {/* {pbaObj.ubb ? 
                (thousandBit(amountFormatter(pbaObj.utb), 2) + '-' + thousandBit(amountFormatter(pbaObj.ubb), 2))
                 : '0.00'} */}
                 </h3>
              </div>
            </StakingLi>
          </StakingList>
        </StakingBox>
        <StakingBox>
          <StakingList>
            <li className='item'>
              <div className='pic'><img src={poolCoinLogoUrl ? poolCoinLogoUrl : require('../../assets/images/coin/source/'+ poolCoin + '.svg')} /></div>
              <div className='info'>
                <h3>{prd}</h3>
                <p>
                  {poolCoin} {t('Earned')}
                  <span className='green' style={{marginLeft:'2px'}}>({curLpObj.apy}%)</span>
                </p>
              </div>
              <div className='btn'><Button1 style={{height: '45px', maxWidth: '200px'}} disabled={HarvestDisabled} onClick={() => {
                withdraw(0)
              }}>{t('Harvest')}</Button1></div>
            </li>
            <li className='item'>
              <DoubleLogo>
                <div className="logo left">
                  <TokenLogo1 symbol={curLpObj && curLpObj.tokenObj && curLpObj.tokenObj.symbol ? curLpObj.tokenObj.symbol : ''} size='100%'/>
                </div>
                <div className="addIcon">+</div>
                <div className="logo right">
                  <TokenLogo1 symbol={config.getCurChainInfo(CHAINID).symbol} size='100%'/>
                </div>
                
              </DoubleLogo>
              <div className='info'>
                <h3>{userInfo && Number(userInfo) > 0 && dec? fromWei(userInfo, dec, 6) : '0.00'}</h3>
                <p>{curLpObj.tokenObj && curLpObj.tokenObj.symbol ? curLpObj.tokenObj.symbol : ''} {stakeType} {t('Staked')}</p>
              </div>
              <div className='btn'>
                {btnView}
              </div>
            </li>
          </StakingList>
        </StakingBox>
      </>
    )
  }

  

  let amountView = ''
  if (stakingType === 'deposit') {
    amountView = balance ? fromWei(balance, dec, 6) : '0.00'
  } else {
    amountView = userInfo ? fromWei(userInfo, dec, 6) : '0.00'
  }

  return (
    <>
    <Modal isOpen={stakingModal} onDismiss={() => {
      setStakingModal(!stakingModal)
    }} maxHeight={300}>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              {t('selectNetwork')}
              {/* <QuestionHelper text={t('tip6')} /> */}
            </Text>
            <CloseIcon onClick={() => {
              setStakingModal(!stakingModal)
            }} />
          </RowBetween>
        </PaddedColumn>
        <Separator />
        <div style={{ flex: '1' }}>
          <StakingModalBox>
            <InputRow>
              <Input type="text" className='small' placeholder="" value={stakeAmount || ''} onChange={e => {
                setStakeAmount(e.target.value)
              }}/>
              <MaxBox onClick={() => {onMax()}}>Max</MaxBox>
            </InputRow>
            <AmountView>
              {amountView} {LpList && LpList[exchangeAddress] && LpList[exchangeAddress]?.tokenObj && LpList[exchangeAddress]?.tokenObj?.symbol ? LpList[exchangeAddress].tokenObj.symbol : ''} {stakeType} Token
              
            </AmountView>
            <Button1 style={{height: '45px',width: '150px'}} disabled={stakeDisabled} onClick={() => {
              if (stakingType === 'deposit') {
                deposit()
              } else {
                withdraw()
              }
            }}>{t(stakingType)}</Button1>
          </StakingModalBox>
        </div>
        </Column>
      </Modal>
      {exchangeAddress ? stakingView() : farmsList()}
    </>
  )
}

// export default withRouter(BSCFarming)