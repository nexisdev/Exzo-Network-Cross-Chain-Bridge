// import React, { useMemo } from 'react'
import React from 'react'
import styled from 'styled-components'
// import { useTranslation } from 'react-i18next'

import Title from '../Title'

const TitleBox = styled.div`
  display: block;
  width:100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display:none;
  `}
`

export default function CrossChain() {
  return (
    <TitleBox>
      <Title
        title={''}
      >
      </Title>
    </TitleBox>
  )
}