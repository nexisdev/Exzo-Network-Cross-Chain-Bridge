import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

// import { AlertTriangle, X } from 'react-feather'
import { X } from 'react-feather'
import { useURLWarningToggle, useURLWarningVisible } from '../../state/user/hooks'
import { isMobile } from 'react-device-detect'

const PhishAlert = styled.div<{ isActive: any }>`
  width: 100%;
  padding: 6px 6px;
  background-color: #fdf6ec;
  color: #062536;
  font-size: 11px;
  justify-content: center;
  align-items: center;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  position:relative;
`

export const StyledClose = styled(X)`
  margin-left:20px;
  position:absolute;
  right:10px;
  :hover {
    cursor: pointer;
  }
`

export default function URLWarning() {
  const toggleURLWarning = useURLWarningToggle()
  const showURLWarning = useURLWarningVisible()
  const { t } = useTranslation()
  return isMobile ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
      {/* [Warning] Please visit link (<a style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }} href='https://app.multichain.org/#/approvals' target='__blank'>https://app.multichain.org/#/approvals</a>) to confirm approvals asap. Details: <a style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }} href='' target='__blank'>medium</a>.  */}
        {/* <AlertTriangle style={{ marginRight: 6 }} size={12} /> */}
        {t('topTip')}<a style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }} href='https://multichain.org' target='__blank'>https://multichain.org</a>
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : window.location.hostname ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        {/* [Warning] Please visit link (<a style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }} href='https://app.multichain.org/#/approvals' target='__blank'>https://app.multichain.org/#/approvals</a>) to confirm approvals asap. Details: <a style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }} href='' target='__blank'>medium</a>.  */}
        {/* <AlertTriangle style={{ marginRight: 6 }} size={12} /> */}
        {t('topTip')}<a style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }} href='https://multichain.org' target='__blank'>https://multichain.org</a>
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : null
}
