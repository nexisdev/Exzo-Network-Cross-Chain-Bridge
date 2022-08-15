import React, {useContext} from "react"
import { useTranslation } from 'react-i18next'
import { CheckCircle } from 'react-feather'
// import {useNonApproveCallback} from '../../hooks/useApproveCallback'
// import { JSBI } from 'anyswap-sdk'
import { ButtonConfirmed, ButtonLight } from '../Button'
import TokenLogo from "../TokenLogo"
import Loader from '../Loader'
// import ModalContent from '../Modal/ModalContent'
// import { BottomGrouping } from '../swap/styleds'

import {useActiveWeb3React} from '../../hooks'
import styled, { ThemeContext } from "styled-components"


import config from '../../config'
import {selectNetwork} from '../../config/tools/methods'

import {useNonApproveCallback} from '../../hooks/useApproveCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import {useAllApproved} from './hooks'

// import {
//   DBTables,
//   DBThead,
//   DBTh,
//   DBTbody,
//   DBTd,
//   // TokenTableCoinBox,
//   // TokenTableLogo,
//   // TokenNameBox,
//   MyBalanceBox,
//   // TokenActionBtn,
//   // Flex,
//   // ChainCardList
// } from '../../pages/Dashboard/styleds'
import AppBody from "../../pages/AppBody"
// const NonApproveTip = styled.div`
//   width: 100%;
//   padding: 15px 0;
//   color: ${({ theme }) => theme.textColor};
//   text-align: center;
// `

const ApproveBox = styled.div`
  ${({ theme }) => theme.flexSC};
  flex-wrap:wrap;
  width: 100%;
  max-width: 600px;
  margin:auto;
`
// const FlexSC = styled.div`
// ${({ theme }) => theme.flexSC};
// `
const ApproveListView = styled.div`
  width: 50%;
  padding: 15px;
`
const ApproveListCont = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.contentBg};
  padding: 25px;
  border-radius: 15px;
`

const ApproveLoadingCont = styled.div`
  ${({ theme }) => theme.flexC};
  width: 100%;
  background: ${({ theme }) => theme.contentBg};
  padding: 25px;
  border-radius: 15px;
  min-height: 300px;
  font-weight:bold;
`

const TokenLogoBox = styled.div`
  width: 100%;
  margin-bottom: 20px;
  ${({ theme }) => theme.flexC};
`

const ButtonConfirmedBox = styled(ButtonConfirmed)`
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  // margin-top: 20px;
`

const ButtonOverBox = styled.div`
${({ theme }) => theme.flexC};
  height: 30px;
  font-size: 14px;
`
const PageTip = styled.div`
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.textColor};
  padding: 0 0 20px;
  font-size: 20px;
  font-weight: bold;
`

const PageInfo = styled.div`
color: ${({ theme }) => theme.textColor};
padding: 0 0 20px;
font-size: 18px;
text-align:center;
font-size:14px;
font-weight:normal;
`
// const Unsafe = styled.span`
//   color: ${({ theme }) => theme.red1};
// `
// const Safe = styled.span`
//   color: ${({ theme }) => theme.green1};
// `

function ApproveBtn ({
  token,
  spender,
  symbol,
  disabled,
  curChainId
}: {
  token:any,
  spender:any,
  symbol:any,
  disabled:any,
  curChainId: any
}) {
  const {chainId} = useActiveWeb3React()
  const { t } = useTranslation()
  const {approve} = useNonApproveCallback(chainId?.toString() === curChainId?.toString() && token ? token : undefined, spender ?? undefined, symbol)
  
  const theme = useContext(ThemeContext)
  function changeNetwork (chainID:any) {
    selectNetwork(chainID).then((res: any) => {
      // console.log(res)
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(chainID).networkName}))
      }
    })
  }
  if (disabled) {
    return <ButtonOverBox>
    <CheckCircle size="16" stroke={theme.green1} style={{marginRight: '10px'}} />Updated
  </ButtonOverBox>
  } else if (chainId?.toString() !== curChainId?.toString()) {
    return <ButtonConfirmedBox disabled={disabled} onClick={() => {
      changeNetwork(curChainId)
    }}>
      {t('SwitchTo') + config.getCurChainInfo(curChainId).name}
  </ButtonConfirmedBox>
  }
  // console.log(token,
  //   spender,
  //   symbol,)
  return (
    <ButtonConfirmedBox disabled={disabled} onClick={() => {
      approve()
    }}>
      Revoke
    </ButtonConfirmedBox>
  )

}

export default function NonApproveQuery () {
  const {approvedList, loading} = useAllApproved()
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()

  if (!account) {
    return (<>
      <AppBody>
        <ApproveLoadingCont>
          <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
        </ApproveLoadingCont>
      </AppBody>
    </>)
  }
  return (
    <AppBody>
      <PageInfo>
      {/* Multichain network is under the the process of upgrading and migrating Router contracts to support native coins(e.g., Luna) and non-EVM blockchains(e.g., Solana). Some of the bridges of wrapped native coins(e.g., WETH,WBNB) will be suspend temporarily. */}
      </PageInfo>
      {approvedList.length > 0 ? <PageTip>Router contract updated, please revoke your token approvals from old router contract first.</PageTip> : ''}
      <ApproveBox>
        {
          approvedList.length > 0 ? approvedList.map((item:any, index:any) => {
            return (
              <ApproveListView key={index}>
                <ApproveListCont>
                  <TokenLogoBox><TokenLogo symbol={config.getCurChainInfo(item.chainId)?.networkLogo ?? config.getCurChainInfo(item.chainId)?.symbol} size={'36px'} style={{marginRight:'10px'}}></TokenLogo></TokenLogoBox>
                  <ApproveBtn
                    token={item.token}
                    spender={item.spender}
                    symbol={item.symbol}
                    disabled={!item.isAllowance}
                    curChainId={item.chainId}
                  />
                </ApproveListCont>
              </ApproveListView>
            )
          }) : (<ApproveLoadingCont>
            {
              loading ? <Loader stroke="#5f6bfb" style={{width: '38px',height: '38px'}} /> : 'You haven’t approved any obsolete contract. No actions needed.'
            }
          </ApproveLoadingCont>)
        }
      </ApproveBox>
      {/* <MyBalanceBox>

        <DBTables>
          <DBThead>
            <tr>
              <DBTh className="l">{t('tokens')}</DBTh>
              <DBTh className="l hideSmall">{t('supportChain')}</DBTh>
              <DBTh className="l">Approved Spender</DBTh>
              <DBTh className="l">Allowance</DBTh>
              <DBTh className="c">{t('details')}</DBTh>
            </tr>
          </DBThead>
          <DBTbody>
          {
            approvedList.length > 0 ? approvedList.map((item:any, index:any) => {
              return (
                <tr key={index}>
                  <DBTd>{item.symbol}</DBTd>
                  <DBTd>
                    <FlexSC>
                      <TokenLogo symbol={config.getCurChainInfo(item.chainId)?.networkLogo ?? config.getCurChainInfo(item.chainId)?.symbol} size={'24px'} style={{marginRight:'10px'}}></TokenLogo>
                      {config.getCurChainInfo(item.chainId)?.name}
                    </FlexSC>
                  </DBTd>
                  <DBTd className="l">
                    {item.type}
                  </DBTd>
                  <DBTd className="l">
                    {item.value === '0x0000000000000000000000000000000000000000000000000000000000000000' ? '0 ' : 'Unlimited '}  {item.symbol}
                  </DBTd>
                  <DBTd width={'100'}>
                    {
                      chainId?.toString() === item.chainId?.toString() ? (
                        <>
                          <ApproveBtn
                            token={item.token}
                            spender={item.spender}
                            symbol={item.symbol}
                            disabled={!item.isAllowance}
                          />
                        </>
                      ) : (
                        <>
                        {
                          item.isAllowance ? <ButtonConfirmedBox disabled={!item.isAllowance} onClick={() => {
                            changeNetwork(item.chainId)
                          }}>
                            {t('SwitchTo') + config.getCurChainInfo(item.chainId).name}
                        </ButtonConfirmedBox> : (
                          <ButtonOverBox>
                            <CheckCircle size="16" stroke={theme.green1} style={{marginRight: '10px'}} />Updated
                          </ButtonOverBox>
                        )
                        }
                        </>
                      )
                    }
                  </DBTd>
                </tr>
              )
            }) : (
              <tr>
                <DBTd colSpan={5} className="c">
                  {
                    loading ? <Loader stroke="#5f6bfb" style={{width: '38px',height: '38px'}} /> : 'You are all updated!'
                  }
                </DBTd>
              </tr>
            )
          }
          </DBTbody>
        </DBTables>
      </MyBalanceBox> */}
    </AppBody>
  )
}