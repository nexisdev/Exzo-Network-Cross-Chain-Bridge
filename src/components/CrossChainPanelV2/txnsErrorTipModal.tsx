import React, { useMemo } from "react"
import styled from "styled-components"
import {useTxnsErrorTipOpen} from '../../state/application/hooks'
// import {getParams} from '../../config/tools/getUrlParams'

import ModalContent from '../Modal/ModalContent'

const ErrorTipContent = styled.div`
  padding: 30px 20px;
  color: ${({ theme }) => theme.red1};
`

export default function TxnsErrorTipModal () {
  const {errorTip, isOpenModal, onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const errorTxt = useMemo(() => {
    if (errorTip?.toString().indexOf('cannot estimate gas; transaction may fail or may require manual gas limit') !== -1) {
      return 'cannot estimate gas; transaction may fail or may require manual gas limit'
    } else if (errorTip?.toString().indexOf('replacement transaction underpriced') !== -1) {
      return 'replacement transaction underpriced'
    } else {
      return errorTip.toString()
    }
  }, [errorTip])
  return (
    <>
      <ModalContent
        isOpen={isOpenModal}
        title={'Transaction Error'}
        onDismiss={() => {
          onChangeViewErrorTip('', false)
        }}
        padding={'0rem'}
      >
       <ErrorTipContent>{errorTxt} </ErrorTipContent>
      </ModalContent>
    </>
  )
}