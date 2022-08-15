import { Token, TokenAmount } from 'anyswap-sdk'
import { useMemo } from 'react'
// import { useBridgeAllTokenBalances } from '../../state/wallet/hooks'
import { useTokenBalanceList } from '../../state/wallet/hooks'

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: TokenAmount | any, balanceB?: TokenAmount | any, sortA?:any, sortB?:any) {
  // console.log(balanceA)
  if (sortA > sortB) {
    // console.log('balanceA')
    return 1
  } else {
    if (balanceA && balanceB) {
      return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1
      // if ( balanceA instanceof TokenAmount && balanceB instanceof TokenAmount) {
      // } else {
      //   return Number(balanceA?.balance) > Number(balanceB?.balance) ? -1 : (Number(balanceA?.balance) <= Number(balanceB?.balance) ? 0 : 1)
      // }
    } else if (balanceA) {
      return -1
      // if (balanceA instanceof TokenAmount && balanceA.greaterThan('0')) {
      // } else if (Number(balanceA?.balance) > 0) {
      //   return -1
      // }
    } else if (balanceB) {
      return 1
      // if (balanceB instanceof TokenAmount && balanceB.greaterThan('0')) {
      // } else if (Number(balanceB?.balance) > 0) {
      //   return 1
      // }
      // return 1
    }
    return 0
  }
}

// function balanceComparator(balanceA?: TokenAmount | any, balanceB?: TokenAmount | any, sortA?:any, sortB?:any) {
//   console.log(balanceA)
//   if (sortA > sortB) {
//     // console.log('balanceA')
//     return 1
//   } else {
//     const ba = balanceA && balanceA instanceof TokenAmount ? balanceA : (balanceA & balanceA?.balances ? balanceA.balances : '')
//     const bb = balanceB && balanceB instanceof TokenAmount ? balanceB : (balanceB && balanceB?.balances ? balanceB.balances : '')
//     if (ba && bb) {
//       return ba.greaterThan(bb) ? -1 : ba.equalTo(bb) ? 0 : 1
//     } else if (ba) {
//       if (ba.greaterThan('0')) {
//         return -1
//       }
//     } else if (bb) {
//       if (bb.greaterThan('0')) {
//         return 1
//       }
//     }
//     return 0
//   }
// }

function getTokenComparator(balances: {
  [tokenAddress: string]: TokenAmount | undefined
}): (tokenA: Token, tokenB: Token) => number {
  return function sortTokens(tokenA: any, tokenB: any): number {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA:any = balances[tokenA.address]
    const balanceB:any = balances[tokenB.address]

    const balanceComp = balanceComparator(balanceA?.balances, balanceB?.balances, tokenA.sort, tokenB.sort)
    // console.log(balanceComp)
    if (balanceComp !== 0) return balanceComp

    if (tokenA.symbol && tokenB.symbol) {
      // console.log(tokenA)
      // sort by symbol
      if (tokenA.sort > tokenB.sort) {
        return 1
      } else {
        return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1
      }
    } else {
      return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0
    }
  }
}

// export function useTokenComparator(key?: string | undefined, chainId?:any, inverted?: boolean): (tokenA: Token, tokenB: Token) => number {
export function useTokenComparator(key?: string | undefined, chainId?:any, inverted?: boolean): any {
  // const balances = useBridgeAllTokenBalances(key, chainId)
  const balances = useTokenBalanceList()
  // console.log(balances)
  const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances])
  const tokenComparator = useMemo(() => {
    if (inverted) {
      return (tokenA: Token, tokenB: Token) => comparator(tokenA, tokenB) * -1
    } else {
      return comparator
    }
  }, [inverted, comparator])
  return {
    tokenComparator,
    balances
  }
}
