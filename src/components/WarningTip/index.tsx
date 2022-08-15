import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useBetaMessageManager } from '../../state/user/hooks'

const BetaMessage = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  cursor: pointer;
  flex: 1 0 auto;
  align-items: center;
  position: relative;
  font-size: 0.875rem;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.tipColor};

  width: 100%;
  object-fit: contain;
  border-radius: 0.5625rem;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  padding: 1rem 2.5rem;
  margin-top: 0.625rem;
  padding-right: 8.875rem;

  span{
    margin-right: 10px;
  }
  .confirm {
    ${({ theme }) => theme.flexC};
    width: 110px;
    height: 1.875rem;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
    user-select: none;
    border: #734be2;
    top: 50%;
    right: 1rem;
    position: absolute;
    background:${({ theme }) => theme.moreBtn};
    margin-top: -0.9375rem;
    color: ${({ theme }) => theme.textColorBold}
  }
`

export default function WarningTip () {
  const { t } = useTranslation()
  const [showBetaMessage, dismissBetaMessage] = useBetaMessageManager()
  // console.log(showBetaMessage)
  return (
    <>
      {/* {showBetaMessage  && ( */}
      {showBetaMessage ? (
        <BetaMessage>
          <span role="img" aria-label="warning">
            💀
          </span>{' '}
          {t('betaWarning')}
          <div className='confirm' onClick={dismissBetaMessage}>{t('agree')}</div>
        </BetaMessage>
      ) : ''}
    </>
  )
}