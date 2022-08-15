import React, { useMemo } from "react";
import styled from "styled-components";

import {
  // ChevronsRight,
  CheckCircle,
  Info
} from 'react-feather'

import {Status} from '../../config/status'

import Loader from "../Loader";

const ProgressBox = styled.div`
  width:100%;
  margin-bottom: 10px;
  border-radius: 10px;
  // border: solid 0.5px ${({ theme }) => theme.tipBorder};
  // background-color: ${({ theme }) => theme.tipBg};
  border: 1px solid ${({theme}) => theme.bg3};
  padding:10px;
  .list {
    position:relative;
    ${({ theme }) => theme.flexBC};
    font-size: 12px;
    .lineBox {
      width:100%;
      height:20px;
      position: absolute;
      top:0;
      left:0;
      right:0;
      z-index:0;
      padding-left: 12px;
      .lineWrapper {
        width:90%;
        position: relative;
        background: ${({ theme }) => theme.text1};
        margin-top:10px;
        margin-left: 10px;
        height: 1px;
        .line {
          width: 30%;
          background: #10f732;
          height: 1px;
        }
      }
    }
    .item {
      z-index:1;
      ${({ theme }) => theme.text1};
      .step {
        ${({ theme }) => theme.flexC};
        .num {
          display:block;
          width:20px;
          height:20px;
          line-height:18px;
          border-radius: 100%;
          border: 1px solid ${({ theme }) => theme.text1};
          font-size:12px;
          text-align:center;
          background:${({ theme }) => theme.contentBg};
        }
      }
      .label {
        ${({ theme }) => theme.flexC};
      }
      &.yellow {
        color: ${({ theme }) => theme.birdgeStateBorder};
        .step {
          .num {
            border: 1px solid ${({ theme }) => theme.birdgeStateBorder};
          }
        }
      }
      &.green{
        color: #10f732;
        // .lineBox {
        //   .line {
        //     background: #10f732;
        //   }
        // }
        .step {
          // color: #10f732;
          .num {
            border: 1px solid #10f732;
          }
        }
      }
      &.red{
        color: ${({ theme }) => theme.birdgeStateBorder2};
        .step {
          .num {
            border: 1px solid ${({ theme }) => theme.birdgeStateBorder2};
          }
        }
      }
    }
  }

  .arrow {color: ${({ theme }) => theme.tipBorder};}
`

const Loading = styled(Loader)`
  color: #5f6bfb;
`

const FailureBox = styled.div`
  ${({ theme }) => theme.flexC};
  width:100%;
  margin-bottom: 10px;
  border-radius: 10px;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  padding:10px;
  color: ${({ theme }) => theme.birdgeStateBorder2};
`

export default function TxnsProgress({
  fromStatus,
  toStatus
}:any) {
  const ProgressNum = useMemo(() => {
    if (!toStatus) {
      if ([Status.Null].includes(fromStatus)) {
        return 0
      } else if ([Status.Pending].includes(fromStatus)) {
        return 1
      } else if ([Status.Success].includes(fromStatus)) {
        return 2
      } else if ([Status.Failure].includes(fromStatus)) {
        return -1
      }
    } else {
      if ([Status.Confirming].includes(toStatus)) {
        return 3
      } else if ([Status.Crosschaining].includes(toStatus)) {
        return 4
      } else if ([Status.Success].includes(toStatus)) {
        return 5
      } else if ([Status.BigAmount].includes(toStatus)) {
        return 6
      } else if (!toStatus || [Status.Failure, Status.Null].includes(toStatus)) {
        return -2
      }
    }
    return 0
  }, [fromStatus, toStatus])

  // const ChevronsRightView = <div className="item"><ChevronsRight className="arrow" size={14} /></div>
  const CheckCircleView = <CheckCircle size={12} style={{marginRight: 5, display: 'none'}} />
  const LoaderView = <Loading size={'14px'} stroke="#5f6bfb" style={{marginRight: 5}} />

  const PendingView = (status:any) => {
    if (status === 0) {
      return <div className={"item"}>
        <div className="step"><span className="num">1</span></div>
        <div className="label">{LoaderView}Pending</div>
      </div>
    }
    return <div className={"item green"}>
      <div className="step"><span className="num">1</span></div>
      <div className="label">{CheckCircleView}Sent</div>
    </div>
  }
  const ConfirmingView = (status:any) => {
    if (status >= 1 && status < 2) {
      return <div className={"item"}>
        <div className="step"><span className="num">2</span></div>
        <div className="label">{LoaderView}Confirming</div>
      </div>
    }
    return <div className={"item green"}>
      <div className="step"><span className="num">2</span></div>
      <div className="label">{CheckCircleView}Confirmed</div>
    </div>
  }
  const CrosschainingView = (status:any) => {
    if (status < 4) {
      return <div className={"item"}>
        <div className="step"><span className="num">3</span></div>
        <div className="label">{status >= 2 ? LoaderView : ''}Routing</div>
      </div>
    }
    return <div className={"item green"}>
      <div className="step"><span className="num">3</span></div>
      <div className="label">{CheckCircleView}Routing</div>
    </div>
  }
  // const FailureView = <div className={"item red"}><Info size={12} style={{marginRight: 5}} />Failure</div>
  const SuccessView = (status:any) => {
    if (status >= 4 && status < 5) {
      return <div className={"item"}>
        <div className="step"><span className="num">4</span></div>
        <div className="label">{status >= 3 ? LoaderView : ''}Success</div>
      </div>
    } else if (status === 6) {
      return <div className={"item yellow"}>
        <div className="step"><span className="num">4</span></div>
        <div className="label"><Info size={12} style={{marginRight: 5}} />Big Amount</div>
      </div>
    } else if (status === 5) {
      return <div className={"item green"}>
        <div className="step"><span className="num">4</span></div>
        <div className="label">{CheckCircleView}Success</div>
      </div>
    }
    return <div className={"item"}>
      <div className="step"><span className="num">4</span></div>
      <div className="label">{CheckCircleView}Success</div>
    </div>
  }
  // console.log(ProgressNum)
  function ProgressView (status:any) {
    console.log(status)
    if (status >= 0) {
      return (
        <>
          {PendingView(status)}
          {/* {ChevronsRightView} */}

          {ConfirmingView(status)}
          {/* {ChevronsRightView} */}

          {CrosschainingView(status)}
          {/* {ChevronsRightView} */}

          {SuccessView(status)}
        </>
      )
    } else {
      return (
        <FailureBox>
          <Info size={16} style={{marginRight: 5}} />Failure
        </FailureBox>
      )
    }
  }
  function LineView (ProgressNum:any) {
    if (ProgressNum > 4) {
      return <div className={"line "}style={{ width: '100%' }}></div>
    } else if (ProgressNum >= 3) {
      return <div className={"line "}style={{ width: '65%' }}></div>
    } if (ProgressNum >= 2) {
      return <div className={"line "}style={{ width: '30%' }}></div>
    }
    return <div className={"line "}style={{ width: '0%' }}></div>
  }
  return (
    <>
          {/* {ProgressView(-1)} */}
      {
        ProgressNum < 0 ? (
          <>
            {ProgressView(-1)}
          </>
        ) : (
          <ProgressBox>
            <div className="list">
              <div className="lineBox">
                <div className="lineWrapper">
                  {LineView(ProgressNum)}
                  {/* {LineView(4)} */}
                </div>
                {/* <div className={"line line1" + (ProgressNum >= 3 ? 'green' : '')}></div> */}
              </div>
              {ProgressView(ProgressNum)}
            </div>
          </ProgressBox>
        )
      }
    </>
  )
}