import React from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
// import AutoSizer from 'react-virtualized-auto-sizer'
// import { useTranslation } from 'react-i18next'

import Modal from './index'
import Column from '../Column'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'
import { PaddedColumn, Separator } from '../SearchModal/styleds'
import { CloseIcon } from '../../theme'

const ContentWrapper = styled.div`
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
  overflow:auto;
`

interface ModalProps {
  isOpen: boolean
  onDismiss?: () => void
  title?: string,
  tip?: string,
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  padding?: any
  children?: React.ReactNode
}

export default function ModalContent({
  isOpen,
  onDismiss,
  title,
  tip,
  minHeight = false,
  maxHeight = 99,
  initialFocusRef,
  padding,
  children
}: ModalProps) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss ? onDismiss : () => {console.log()}}
        maxHeight={maxHeight}
        minHeight={minHeight}
        initialFocusRef={initialFocusRef}
      >
        <Column style={{ width: '100%', flex: '1 1' }}>
          <PaddedColumn gap="14px">
            <RowBetween>
              <Text fontWeight={500} fontSize={16}>
                {title}
                {tip ? <QuestionHelper text={tip} /> : ''}
              </Text>
              {onDismiss ? <CloseIcon onClick={onDismiss} /> : ''}
            </RowBetween>
          </PaddedColumn>
          <Separator />
          <div style={{ flex: '1', overflow:'auto' }}>
            <ContentWrapper style={{padding: (padding ? padding : '2rem')}}>
              {children}
            </ContentWrapper>
          </div>
        </Column>
      </Modal>
    </>
  )
}
