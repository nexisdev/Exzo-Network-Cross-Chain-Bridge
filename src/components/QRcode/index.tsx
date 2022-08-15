import React from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import { useDarkModeManager } from '../../state/user/hooks'

const QRCodeWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  margin-bottom: 1.25rem;
`

export default function QRcode({
  uri = '',
  size
}: {
  uri?: any
  size?: any
}) {
  const [isDark] = useDarkModeManager()
  return (
    <QRCodeWrapper>
      {uri && (
        <QRCode size={size} value={uri} bgColor={isDark ? '#333639' : 'white'} fgColor={isDark ? 'white' : 'black'} />
      )}
    </QRCodeWrapper>
  )
}
