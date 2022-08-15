// import React, { useState, useEffect } from 'react'
import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
// import styled from 'styled-components'
// import { useTranslation } from 'react-i18next'

import { network } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import { NetworkContextName } from '../../constants'
// import Loader from '../Loader'

// const MessageWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   height: 20rem;
// `

// const Message = styled.h2`
//   color: ${({ theme }) => theme.secondary1};
// `

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  // const { t } = useTranslation()
  const { active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)
  // console.log(active)
  // console.log(networkActive)
  // 尝试急切地连接到注入的提供者（如果它存在并且已经授予访问权限）
  const triedEager = useEagerConnect()

  // 在急切地尝试注入后，如果网络连接从未处于活动状态或处于错误状态，请激活itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // 当没有连接帐户时，对注入的提供程序（如果存在）上的登录（广义地说）作出反应
  useInactiveListener(!triedEager)

  // handle delayed loader state
  // const [showLoader, setShowLoader] = useState(false)
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setShowLoader(true)
  //   }, 600)

  //   return () => {
  //     clearTimeout(timeout)
  //   }
  // }, [])

  // 在页面加载时，在尝试连接到注入的连接器之前，不要执行任何操作
  // if (!triedEager) {
  //   return null
  // }

  // 如果帐户上下文未处于活动状态，并且网络上下文中存在错误，则这是一个无法恢复的错误
  // if (!active && networkError) {
  //   return (
  //     <MessageWrapper>
  //       <Message>{t('unknownError')}</Message>
  //     </MessageWrapper>
  //   )
  // }

  // 如果两个上下文都不活动，请旋转
  // if (!active && !networkActive) {
  //   return showLoader ? (
  //     <MessageWrapper>
  //       <Loader />
  //     </MessageWrapper>
  //   ) : null
  // }

  return (
    <>{children}</>
    )
}
