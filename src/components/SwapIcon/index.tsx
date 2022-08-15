import React from 'react'
import styled from 'styled-components'

// import config from '../../config'
const SwapIconBox = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 26px;
  object-fit: contain;
  border-radius: 6px;
  margin: 0px auto;
  cursor: pointer;
  background: ${({ theme }) => theme.swapBg};
`

interface SwapIcon {
  iconUrl: string
  onClick: () => void
}
export default function SwapIcon({ iconUrl, onClick }: SwapIcon) {
  return (
    <SwapIconBox
      onClick={() => {
        onClick()
      }}
    >
      <img src={iconUrl} alt="" />
    </SwapIconBox>
  )
}
