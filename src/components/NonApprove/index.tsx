import React, {  useCallback, useState } from "react"
// import { createBrowserHistory } from 'history'
import { NavLink } from "react-router-dom"
// import { AlertCircle } from "react-feather"
// import {useNonApproveCallback} from '../../hooks/useApproveCallback'
import {useAllApproved} from './hooks'

// import { ButtonConfirmed } from '../Button'
import ModalContent from '../Modal/ModalContent'
import { BottomGrouping } from '../swap/styleds'

import useInterval from '../../hooks/useInterval'
import styled from "styled-components"


const NonApproveTip = styled.div`
${({ theme }) => theme.flexC};
flex-wrap:wrap;
  width: 100%;
  padding: 15px 0;
  color: ${({ theme }) => theme.textColor};
  text-align: center;
  font-weight:bold;
`

const StyledNavLink = styled(NavLink)`
  ${({ theme }) => theme.flexC}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;

  width: 100%;
  font-weight: 500;
  color: #ffffff;
  background: ${({ theme }) => theme.bgColorLinear};
  font-size: 0.875rem;
  font-family: 'Manrope';
  box-sizing: border-box;
  padding: 1rem 0.875rem;
  line-height: 1rem;
  margin: 6px 0;
  height: 48px;
  border-radius: 0.5625rem;
  position: relative;
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    ${({ theme }) => theme.flexC};
    margin:0;
    .icon {
      display:none;
    }
  `}
`
const PageInfo = styled.div`
  color: ${({ theme }) => theme.textColor};
  // padding: 0 0 20px;
  font-size: 18px;
  text-align:center;
  font-size:14px;
  font-weight:normal;
`
export default function NonApprove () {
  const [isSaveUrl, setIsSaveUrl] = useState<any>(false)
  const {approvedList} = useAllApproved()
  const getUrl = useCallback(() => {
    const url = window.location.href
    if (approvedList.length > 0 && url.indexOf('/approvals') === -1) {
      setIsSaveUrl(true)
    } else {
      setIsSaveUrl(false)
    }
  }, [approvedList])
  useInterval(getUrl, 1000)
  return (
    <>
      <ModalContent
        isOpen={isSaveUrl}
        title={'Revoke'}
        // padding={'0 20px 20px'}
      >
        <NonApproveTip>
          {/* <AlertCircle style={{width: '58px',height: '58px'}} /> */}
          <PageInfo>
          Multichain network is under the the process of upgrading and migrating Router contracts to support native coins(e.g., Luna) and non-EVM blockchains(e.g., Solana). Some of the bridges of wrapped native coins(e.g., WETH,WBNB) will be suspend temporarily.
          </PageInfo>
          <p>
            {/* Router contract updated, please revoke your token approvals from old router contract first. */}
            Router contract updated, please revoke your token approvals from old router contract first.
          </p>
        </NonApproveTip>
        <BottomGrouping>
          <StyledNavLink to={'/approvals'}>
            Go to revoke
          </StyledNavLink>
          {/* <ButtonConfirmed onClick={() => {
            approve()
          }}>
            Unapprove
          </ButtonConfirmed> */}
        </BottomGrouping>
      </ModalContent>
    </>
  )
}