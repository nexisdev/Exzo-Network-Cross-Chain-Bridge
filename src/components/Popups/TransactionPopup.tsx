import React, { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { TYPE } from '../../theme'
import { ExternalLink } from '../../theme/components'
import { getEtherscanLink } from '../../utils'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

import config from '../../config'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle color={theme.green1} size={24} /> : <AlertCircle color={theme.red1} size={24} />}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500} color={theme.text2}>{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</TYPE.body>
        {chainId && (
          <>
            {
              summary?.indexOf('Cross bridge') === 0 ? (
                <>
                  {t('txnsTip')}：
                  <ExternalLink href={config.explorerUrl + '/tx?params=' + hash}>{config.explorerUrl + '/tx?params=' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</ExternalLink>
                </>
              ) : (
                <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>{t('ViewOn')} {config.getCurChainInfo(chainId).name}</ExternalLink>
              )
            }
            {/* <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>{t('ViewOn')} {config.getCurChainInfo(chainId).name}</ExternalLink> */}
          </>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
