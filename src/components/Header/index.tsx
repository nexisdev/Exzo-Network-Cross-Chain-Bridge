
import React from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
// import Logo from '../../assets/svg/logo.svg'
// import LogoDark from '../../assets/svg/logo_white.svg'
import Logo from '../../assets/svg/logo.png'
import LogoDark from '../../assets/svg/logo_white.png'
import LogoColor from '../../assets/svg/logo_color.png'
import IconDay from '../../assets/images/icon/day.svg'
import IconNight from '../../assets/images/icon/night.svg'

import { useBaseBalances } from '../../hooks/useAllBalances'
import {useActiveReact} from '../../hooks/useActiveReact'
import { useDarkModeManager, useUserSelectChainId } from '../../state/user/hooks'

import { ExternalLink } from '../../theme'

// import Row, { RowFixed } from '../Row'
import { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import SelectNetwork from './SelectNetwork'
import NavListTop from './NavListTop'
// import usePrevious from '../../hooks/usePrevious'
import config from '../../config'


const HeaderFrameBox = styled.div`
  // position: fixed;
  // top:0;
  // left:0;
  // right:0;
  width:100%;
`

const HeaderFrame = styled.div`
  display: flex;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  // padding: 0.875rem 1rem;
  padding: 0rem 1rem;
  z-index: 2;
  height: 70px;
  margin:auto;

  max-width: 1440px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  height: 100%;
  padding: 0.875rem 0rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    // padding: 1rem;
    padding: 0rem;
    z-index: 99;
    border-radius: 12px 12px 0 0;
    // background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`
const HeaderRow = styled(RowFixed)`
  position: relative;
  height: 100%;
  padding: 0.875rem 0rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 100%;
    width: 100%;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`
const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  height: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
    margin-right: 2px;
  `};
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  ${({ theme }) => theme.flexSC};
  height: 100%;
  img {
    height:42px
  }
  .hiddenImg {
    display: none;
  }
  .viewImg {
    display: block;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    .hiddenImg {
      display: block;
    }
    .viewImg {
      display: none;
    }
    img {
      height:36px
    }
  `};
`

const StyleDarkToggle = styled.div`
  ${({ theme }) => theme.flexC};
  width: 36px;
  min-width: 36px;
  height: 36px;
  border-radius: 9px;
  margin-left: 15px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.lightPuroleBg};
  @media screen and (max-width: 960px) {
    margin-left: 5px;
  }
`

const VersionLinkBox = styled(ExternalLink)`
  ${({theme}) => theme.flexSC}
  text-decoration: none;
  color: rgb(115, 75, 226);
  line-height: 26px;
  margin-top: 17px;
  font-size: 18px;
  font-weight:bold;
  display:none;
`

function ViewAccountInfo () {
  const {selectNetworkInfo} = useUserSelectChainId()
  
  const {account, chainId} = useActiveReact()
  const baseBalance = useBaseBalances(account)
// console.log(baseBalance)
  if (selectNetworkInfo?.label === 'BTC') {
    return <></>
  }
  return (
    <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
      {account && baseBalance ? (
        <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
          {baseBalance?.toSignificant(3)} {config.getCurChainInfo(chainId).symbol}
        </BalanceText>
      ) : null}
      <Web3Status />
    </AccountElement>
  )
}

export default function Header() {
  const [isDark, toggleDarkMode] = useDarkModeManager()
  // console.log(userEthBalance)
  return (
    <HeaderFrameBox>

      <HeaderFrame>
        <HeaderRow>
          <Title href="/" target="__blank">
            <UniIcon>
              <img src={isDark ? LogoDark : Logo} alt="logo" className='viewImg' />
              <img src={LogoColor} alt="logo" className='hiddenImg' />
            </UniIcon>
          </Title>
          <VersionLinkBox href='https://v1.anyswap.exchange'>
            V1↗
          </VersionLinkBox>
        </HeaderRow>
        <NavListTop />
        <HeaderControls>
          <HeaderElement>
            <SelectNetwork />
            <ViewAccountInfo />
            <StyleDarkToggle
              onClick={() => {
                toggleDarkMode()
              }}
            >
              {
                isDark ? (

                  <img src={IconDay} alt="" />
                ) : (

                  <img src={IconNight} alt="" />
                )
              }
            </StyleDarkToggle>
          </HeaderElement>
        </HeaderControls>
      </HeaderFrame>
    </HeaderFrameBox>
  )
}
