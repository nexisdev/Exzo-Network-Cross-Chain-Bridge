import { useEffect, useCallback,useState, useMemo } from "react"
import { JSBI } from 'anyswap-sdk'
import {useBatchData} from '../../utils/tools/useBatchData'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import {useActiveWeb3React} from '../../hooks'
import {useNonApproveCallback} from '../../hooks/useApproveCallback'

const nonApproveList = require('./nonApproveList.json')

export function useAllApproved () {
  const {account, chainId} = useActiveWeb3React()
  const [approveList, setApproveList] = useState<any>([])
  const [approvedList, setApprovedList] = useState<any>([])
  const [loading, setLoading] = useState<any>(true)
  const useTokenInfo = useMemo(() => {
    if (chainId && nonApproveList[chainId]) {
      return {
        token: nonApproveList[chainId].token,
        anyToken: nonApproveList[chainId].anyToken,
        symbol: nonApproveList[chainId].symbol
      }
    }
    return {
      token: undefined,
      anyToken: undefined,
      symbol: undefined
    }
  }, [chainId])
  const {isSetApprove} = useNonApproveCallback(useTokenInfo.token, useTokenInfo.anyToken, useTokenInfo.symbol)
  const getAllApprove = useCallback(() => {
    setLoading(true)
    if (account && chainId) {
      
      const framekey = 'allowance'
      const arr = []
      for (const c in nonApproveList) {
        const list = nonApproveList[c]
        const arr1 = []
        for (const item of list) {
          arr1.push({
            callData: ERC20_INTERFACE.encodeFunctionData(framekey, [account, item.spender]),
            target: item.token
          })
        }
        // arr.push(useMulticall(c, arr1))
        arr.push(useBatchData({chainId: c, calls: arr1, provider: ''}))
      }
      Promise.all(arr).then(res => {
        // console.log(res)
        let i = 0
        const arr = []
        const arr1 = []
        for (const c in nonApproveList) {
          const list:any = res[i] ? res[i] : []
          i ++
          for (let j = 0, len = list.length; j < len; j++) {
            const value = list[j]
            const a = JSBI.greaterThan(JSBI.BigInt(value), JSBI.BigInt(0))
            const obj = {
              ...nonApproveList[c][j],
              chainId: c,
              isAllowance: a,
              value: value
            }
            // console.log(a)
            arr1.push(obj)
            if (!a) continue
            arr.push(obj)
          }
        }
        // console.log(arr)
        // console.log(arr1)
        setApproveList(arr1)
        setApprovedList(arr)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [account, isSetApprove, chainId])

  useEffect(() => {
    getAllApprove()
  }, [account, isSetApprove, chainId])
  return {approveList, approvedList, loading}
}