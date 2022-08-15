
import React from 'react'
// import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
// import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ExternalLink } from '../../theme'
import {LinkList} from './nav'
// import config from '../../config'

const HeaderLinks = styled.div`
  ${({ theme }) => theme.flexEC};
  width: 100%;
  height: 100%;
  padding: 0rem 1.5625rem 0rem;
  border-bottom: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    ${({ theme }) => theme.flexBC}
    padding: 0.5rem 1rem;
  `};
`

const activeClassName = 'ACTIVE'

const LinkStyle = styled.div.attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexSC};
  height:100%;
  a {
    ${({ theme }) => theme.flexSC}
    align-items: left;
    outline: none;
    cursor: pointer;
    text-decoration: none;
  
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.textNav};
    font-size: 16px;
    // font-weight: bold;
    font-family: 'Manrope';
    box-sizing: border-box;
    padding: 1rem 1rem;
    line-height: 1rem;
    margin: 0;
    // border-radius: 0.5625rem;
    position: relative;
    white-space: nowrap;
    border-bottom: 2px solid transparent;;
  
    &:hover {
      color: ${({ theme }) => theme.textColor};
      font-weight: 600;
    }
    &.${activeClassName} {
      // color: #ffffff;
      // background: ${({ theme }) => theme.bgColorLinear};
      // background: rgba(0,0,0,.1);
      border-bottom: none;
      font-weight: 600;
      border-bottom: 2px solid ${({ theme }) => theme.tabActiveColor};
      color: ${({ theme }) => theme.tabActiveColor};
      // box-shadow: 0 0.25rem 0.75rem 0 rgba(115, 75, 226, 0.51);
    }
    &:focus,&:hover,&:active{
      text-decoration: none;
    }
    ${({ theme }) => theme.mediaWidth.upToMedium`
      ${({ theme }) => theme.flexC};
      margin:0;
    `}
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display:none;
  `}
`

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  text-decoration: auto;
  &:hover {
    text-decoration: auto;
  }
`
// console.log(StyledNavLink)

const StyledNavLink1 = styled(ExternalLink)`
  &:hover {
    text-decoration: auto;
  }
`

export default function NavList() {
  const { t } = useTranslation()

  return (
    <>
      <HeaderLinks>
        <LinkStyle>
          {
            LinkList.map((item, index) => {
              if (!item.isView) return ''
              if (!item.isOutLink) {
                return (
                  <StyledNavLink
                    key={index}
                    to={item.path}
                    isActive={(match, { pathname }) => {
                      Boolean(match)
                      || pathname.startsWith('/router')
                      || pathname.startsWith('/v1/router')
                      || pathname.startsWith('/swap')
                      if (Boolean(match)) {
                        return true
                      } else if (item.isActive) {
                        let isAc = false
                        for (const k of item.isActive) {
                          if (pathname.startsWith(k)) isAc = true; break;
                        }
                        return isAc
                      } else {
                        return false
                      }
                    }}
                    className={(item.className ? item.className : '')} 
                  >
                    {t(item.textKey)}
                  </StyledNavLink>
                )
              } else {
                return (
                  <StyledNavLink1 key={index} href={item.path}>
                    {t(item.textKey)}
                  </StyledNavLink1>
                )
              }
            })
          }
        </LinkStyle>
      </HeaderLinks>
    </>
  )
}
