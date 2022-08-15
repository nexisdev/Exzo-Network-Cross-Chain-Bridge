import React from "react"
import styled from "styled-components"
import { useTranslation } from 'react-i18next'

import {useActiveReact} from '../../hooks/useActiveReact'

import TokenLogo from '../TokenLogo'
import QuestionHelper from '../QuestionHelper'

import config from '../../config'

import {thousandBit} from '../../utils/tools/tools'
import { shortenAddress1 } from "../../utils"

const ConfirmBox = styled.div`
  width: 100%;
`

const ConfirmTip = styled.div`
  width: 100%;
  font-size: 14px;
  text-align:center;
  color: ${({ theme }) => theme.red1};
  margin-bottom: 15px;
`

const ConfirmList = styled.ul`
  width: 100%;
  list-style:none;
  padding:10px;
  margin: 0 0 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  .item {
    ${({ theme }) => theme.flexBC};
    width: 100%;
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      margin: 0;
    }
    .label {
      ${({ theme }) => theme.flexSC};
      .cont {
        font-size: 14px;
        color: ${({ theme }) => theme.textColor};
        margin-left: 10px;
        .info {
          color: ${({ theme }) => theme.text2};
        }
      }
    }
    .value {
      ${({ theme }) => theme.flexSC};
      .cont {
        ${({ theme }) => theme.flexSC};
        font-size: 14px;
        color: ${({ theme }) => theme.textColor};
        margin-left: 10px;
        .info {
          color: ${({ theme }) => theme.text2};
        }
        .name {
          margin-right: 5px;
        }
      }
    }
    .txtLabel {
      font-size: 14px;
      color: ${({ theme }) => theme.textColor};
    }
    .txt {
      width: 85%;
      overflow:hidden;
      text-overflow: ellipsis;
      white-space:normal;
      font-size: 14px;
      &.r {
        text-align:right;
      }
    }
  }
`

const FeeBox = styled.ul`
  width:100%;
  list-style:none;
  padding:0;
  margin:0;
  .item {
    ${({ theme }) => theme.flexBC};
    color: ${({ theme }) => theme.text2};
    font-size: 14px;
  }
`

export default function ConfirmContent (
  {
    fromChainId,
    value,
    toChainId,
    swapvalue,
    recipient,
    destConfig,
    selectCurrency,
    fee
  }: {
    fromChainId:any,
    value:any,
    toChainId:any,
    swapvalue:any,
    recipient:any,
    destConfig:any,
    selectCurrency:any,
    fee:any,
  }
) {
  const { t } = useTranslation()
  const { account } = useActiveReact()
  // console.log(destConfig)
  const dFee = Number(destConfig?.SwapFeeRatePerMillion)
  const useDfee = destConfig?.MaximumSwapFee === destConfig?.MinimumSwapFee ? 0 : dFee
  return (
    <>
      <ConfirmBox>
        <ConfirmTip>
          Please review and confirm the details
        </ConfirmTip>
        <ConfirmList>
          <li className="item">
            <h3 className="title">{t('From')}</h3>
          </li>
          <li className="item">
            <div className="label">
              <TokenLogo symbol={config.getCurChainInfo(fromChainId)?.networkLogo ?? config.getCurChainInfo(fromChainId)?.symbol} size={'24px'} />
              <div className="cont">
                <div className="name">{config.getCurChainInfo(fromChainId)?.name}</div>
                {/* <div className="info">{t('SourceChain')}</div> */}
              </div>
            </div>
            <div className="value">
              <div className="cont">
                <div className="name">- {value}</div>
                <div className="info">{selectCurrency?.symbol}</div>
              </div>
            </div>
          </li>
          <li className="item">
            <div className="txtLabel">{t('Address')}:</div>
            <div className="txt r">{account ? shortenAddress1(account,8) : ''}</div>
          </li>
        </ConfirmList>
        <ConfirmList>
          <li className="item">
            <h3 className="title">{t('to')}</h3>
          </li>
          <li className="item">
            <div className="label">
              <TokenLogo symbol={config.getCurChainInfo(toChainId)?.networkLogo ?? config.getCurChainInfo(toChainId)?.symbol} size={'24px'} />
              <div className="cont">
                <div className="name">{config.getCurChainInfo(toChainId)?.name}</div>
                {/* <div className="info">Destination Chain</div> */}
              </div>
            </div>
            <div className="value">
              <div className="cont">
                <div className="name">+ {swapvalue}</div>
                <div className="info">{destConfig?.symbol}</div>
              </div>
            </div>
          </li>
          <li className="item">
            <div className="txtLabel">{t('Address')}:</div>
            <div className="txt r">{shortenAddress1(recipient, 8)}</div>
          </li>
        </ConfirmList>
        <FeeBox>
          {
            destConfig?.MaximumSwapFee === destConfig?.MinimumSwapFee ? (
              <>
                <li className="item">
                  <div className="label">Crosschain Fee:</div>
                  <div className="value">{useDfee} %</div>
                </li>
                <li className="item">
                  <div className="label">
                    Gas Fee:
                    <QuestionHelper text={
                      'for your cross-chain transaction on destination chain'
                    } />
                  </div>
                  <div className="value">{fee + ' ' + selectCurrency?.symbol}</div>
                </li>
              </>
            ) : (
              <>
                <li className="item">
                  <div className="label">
                    Crosschain Fee:
                    <QuestionHelper text={
                      t('redeemTip1' , {
                        dMinFee: thousandBit(destConfig?.MinimumSwapFee, 'no'),
                        coin: destConfig?.symbol,
                        dMaxFee: thousandBit(destConfig?.MaximumSwapFee, 'no'),
                        dFee: thousandBit(useDfee, 'no')
                      })
                    } />
                  </div>
                  <div className="value">{fee + ' ' + selectCurrency?.symbol}({useDfee} %)</div>
                </li>
              </>
            )
          }
          <li className="item">
            <div className="label">Estimated time of arrival:</div>
            <div className="value">3-30 min</div>
          </li>
        </FeeBox>
      </ConfirmBox>
    </>
  )
}