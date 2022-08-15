

import MasterChef from '../../constants/abis/farm/MasterChef.json'
import ERC20_ABI from '../../constants/abis/erc20.json'
import {fromWei, formatWeb3Str} from '../../utils/tools/tools'
import config from '../../config'

const Web3Fn = require('web3')
const stateList:any = {}
const stateInfo:any = {}
const farmlist:any = {}

function getWeb3 (CHAINID:any, FARMTOKEN?: string, abi?:any) {
  const web3Fn = new Web3Fn(new Web3Fn.providers.HttpProvider(config.getCurChainInfo(CHAINID).nodeRpc))
  const web3Contract = new web3Fn.eth.Contract(abi ? abi : MasterChef, FARMTOKEN)
  return {
    web3: web3Fn,
    contract: web3Contract
  }
}

function formatNum (str:any) {
  const web3Fn = new Web3Fn()
  return web3Fn.utils.hexToNumberString(str)
}

function dispatchFarmState (key: string, action: any) {
  if (!stateList[key]) stateList[key] = []
  const { 
    index,
    lpToken = '',
    allocPoint = '',
    lastRewardBlock = '',
    accRewardPerShare = '',
    pendingReward = '',
    tokenObj,
    lpBalance
  } = action
  // console.log(action)
  const lpArr:any = stateList[key]
  let obj = {}
  if (lpArr[index]) {
    obj = {
      index: index ? index : (lpArr[index].index ? lpArr[index].index : 0),
      lpToken: lpToken ? lpToken : (lpArr[index].lpToken ? lpArr[index].lpToken : ''),
      allocPoint: allocPoint ? allocPoint : (lpArr[index].allocPoint ? lpArr[index].allocPoint : ''),
      lastRewardBlock: lastRewardBlock ? lastRewardBlock : (lpArr[index].lastRewardBlock ? lpArr[index].lastRewardBlock : ''),
      accRewardPerShare: accRewardPerShare ? accRewardPerShare : (lpArr[index].accRewardPerShare ? lpArr[index].accRewardPerShare : ''),
      pendingReward: pendingReward ? pendingReward : (lpArr[index].pendingReward ? lpArr[index].pendingReward : ''),
      tokenObj: tokenObj ? tokenObj : (lpArr[index].tokenObj ? lpArr[index].tokenObj : ''),
      lpBalance: lpBalance ? lpBalance : (lpArr[index].lpBalance ? lpArr[index].lpBalance : ''),
    }
  } else {
    obj = {
      index: index ? index : '',
      lpToken: lpToken ? lpToken : '',
      allocPoint: allocPoint ? allocPoint : '',
      lastRewardBlock: lastRewardBlock ? lastRewardBlock : '',
      accRewardPerShare: accRewardPerShare ? accRewardPerShare : '',
      pendingReward: pendingReward ? pendingReward : '',
      tokenObj: tokenObj ? tokenObj : '',
      lpBalance: lpBalance ? lpBalance : '',
    }
  }
  lpArr[index] = obj
  stateList[key] = lpArr
  // console.log(stateList)
}

function dispatchInfoState (key: string, action: any) {
  if (!stateInfo[key]) stateInfo[key] = {}
  const {
    BlockReward = '',
    TotalPoint = ''
  } = action

  stateInfo[key] = {
    BlockReward: BlockReward ? BlockReward : (stateInfo[key]?.BlockReward ? stateInfo[key].BlockReward : ''),
    TotalPoint: TotalPoint ? TotalPoint : (stateInfo[key]?.TotalPoint ? stateInfo[key].TotalPoint : '')
  }
}

function getAPY (item:any, allocPoint:any, lpBalance:any, blockNumber:number, TotalPoint:number, BlockReward: any, price:number) {
  // console.log(price)
  if (
    BlockReward
    && lpBalance
    && TotalPoint
    && allocPoint
    && price
  ) {
    const curdec = item?.tokenObj?.decimals
    const br = fromWei(BlockReward, 18)
    const lb = fromWei(lpBalance, curdec)
    // console.log(br)
    const baseYear =  br ? (Number(br) * blockNumber * 365 * Number(allocPoint) * price * 100) / (Number(TotalPoint)) / lb : 0
    // console.log(baseYear)
    return baseYear.toFixed(2)
  }
  return '0.00'
}

function getAllTotalSupply (CHAINID:any, FARMTOKEN:string) {
  return new Promise(resolve => {

    const web3Fn = getWeb3(CHAINID, '', ERC20_ABI)
    const batch = new web3Fn.web3.BatchRequest()
    const lpArr = stateList[FARMTOKEN]
    // console.log(lpArr)
    // console.log(lpObj)
    for (let i = 0,len = lpArr.length; i < len; i++) {
      const obj = lpArr[i]
  
      web3Fn.contract.options.address = obj.lpToken
      const blData = web3Fn.contract.methods.balanceOf(FARMTOKEN).encodeABI()
      batch.add(web3Fn.web3.eth.call.request({data: blData, to: obj.lpToken}, 'latest', (err:any, res:any) => {
        // console.log(err)
        if (!err) {
          const results = formatWeb3Str(res)
          // console.log(results)
          // console.log(formatNum(results[0]))
          dispatchFarmState(FARMTOKEN, {
            type: 'UPDATE_LP',
            index: i,
            lpBalance: formatNum(results[0])
          })
        } else {
          dispatchFarmState(FARMTOKEN, {
            type: 'UPDATE_LP',
            index: i,
            lpBalance: ''
          })
        }
        if ((i + 1) === lpArr.length) {
          resolve('')
        }
      }))
    }
    batch.execute()
  })
}

function getTokenList(num:number, tokenlist:any, CHAINID:any, FARMTOKEN:string, account: any) {
  return new Promise(resolve => {

    const web3Fn = getWeb3(CHAINID, FARMTOKEN)
    const batch = new web3Fn.web3.BatchRequest()
    const arr:any = []
    let totalPoint = 0
    for (let i = 0; i < num; i++) {
      arr.push({
        lpToken: '',
        allocPoint: '',
        lastRewardBlock: '',
        accRewardPerShare: '',
      })
      const plData = web3Fn.contract.methods.poolInfo(i).encodeABI()
      batch.add(web3Fn.web3.eth.call.request({data: plData, to: FARMTOKEN}, 'latest', (err:any, pl:any) => {
        if (!err) {
          const results:any = formatWeb3Str(pl)
          // console.log(results)
          const exAddr = results[0].replace('0x000000000000000000000000', '0x')
          // console.log(exAddr)
          const curPoint = formatNum(results[1])
          const obj = {
            type: 'UPDATE_LP',
            index: i,
            lpToken: exAddr,
            allocPoint: curPoint,
            lastRewardBlock: formatNum(results[2]),
            accRewardPerShare: formatNum(results[3]),
            tokenObj: tokenlist[exAddr]?.list,
          }
          // console.log(obj)
          dispatchFarmState(FARMTOKEN, obj)
          totalPoint += Number(curPoint)
        } else {
          dispatchFarmState(FARMTOKEN, {
            type: 'UPDATE_LP',
            index: i,
            lpToken: '',
            allocPoint: '',
            lastRewardBlock: '',
            accRewardPerShare: '',
          })
        }
        if (i === (num - 1)) {
          getAllTotalSupply(CHAINID, FARMTOKEN).then(() => {
            dispatchInfoState(FARMTOKEN, {TotalPoint: totalPoint})
            resolve('')
          })
        }
      }))
      if (account) {
        const prData = web3Fn.contract.methods.pendingReward(i, account).encodeABI()
        batch.add(web3Fn.web3.eth.call.request({data: prData, to: FARMTOKEN}, 'latest', (err:any, reward:any) => {
          if (!err) {
            // console.log(formatCellData(reward, 66).toString())
            const results:any = formatWeb3Str(reward)
            // console.log(formatNum(results[0]))
            dispatchFarmState(FARMTOKEN, {
              type: 'UPDATE_LP',
              index: i,
              pendingReward: formatNum(results[0])
            })
          } else {
            dispatchFarmState(FARMTOKEN, {
              type: 'UPDATE_LP',
              index: i,
              pendingReward: ''
            })
          }
        }))
      }
    }
    batch.execute()
  })
}

export function getBaseInfo (
  tokenlist:any,
  CHAINID:any,
  FARMTOKEN: string,
  account: any,
  blockNumber: number,
  price: number
) {
  return new Promise(resolve => {
    if (farmlist[FARMTOKEN] && (Date.now() - farmlist[FARMTOKEN].timestamp < 1000 * 3)) {
      resolve(farmlist[FARMTOKEN])
    } else {

      const web3Fn = getWeb3(CHAINID, FARMTOKEN)
      const batch = new web3Fn.web3.BatchRequest()
      // console.log(12)
      const plData = web3Fn.contract.methods.poolLength().encodeABI()
    
      batch.add(web3Fn.web3.eth.call.request({data: plData, to: FARMTOKEN}, 'latest', (err:any, pl:any) => {
        if (!err) {
          // console.log(formatNum(pl))
          getTokenList(formatNum(pl), tokenlist, CHAINID, FARMTOKEN, account).then(() => {
            const list:any = {}
            for (const obj of stateList[FARMTOKEN]) {
              const apy = getAPY(obj, obj.allocPoint, obj.lpBalance, blockNumber, stateInfo[FARMTOKEN]?.TotalPoint, stateInfo[FARMTOKEN]?.BlockReward, price)
              list[obj.lpToken] = {
                ...obj,
                apy: apy
              }
            }
            farmlist[FARMTOKEN] = {
              lpArr: list,
              info: stateInfo[FARMTOKEN],
              timestamp: Date.now()
            }
            // console.log(farmlist)
            resolve(farmlist[FARMTOKEN])
          })
        }
      }))
      const rpbData = web3Fn.contract.methods.rewardPerBlock().encodeABI()
      batch.add(web3Fn.web3.eth.call.request({data: rpbData, to: FARMTOKEN}, 'latest', (err:any, res:any) => {
        if (!err && res) {
          dispatchInfoState(FARMTOKEN, {BlockReward: formatNum(res)})
        }
      }))
    
      batch.execute()
    }
  })
}