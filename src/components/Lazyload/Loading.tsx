import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Tips = styled.div`
  line-height: 56px;
  padding-top: 120px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
`

const Loading = ({ duration = -1 }: { duration?: number }) => {
  const [show, setShow] = useState<boolean>(duration < 0);

  useEffect(() => {
    let timeHandler: any;
    let cancel = () => {
      //
    };
    if (duration) {
      timeHandler = setTimeout(() => setShow(true), duration)
      cancel = () => {
        clearTimeout(timeHandler);
      }
    }
    return cancel;
  }, [])

  const { t } = useTranslation();
  return show ? <Tips>{ t('Loading') }...</Tips> : null;
};

export default Loading;
