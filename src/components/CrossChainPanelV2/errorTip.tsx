import React from "react"
import styled from "styled-components"

const ErrorTipBox = styled.div`
  ${({ theme }) => theme.flexC};
  width: 100%;
  margin-top: 10px;
  .txt {
    dispaly:inline-block;
    // width: 100%;
    // max-width: 300px;
    // border: 1px solid ${({ theme }) => theme.birdgeStateBorder};
    // background: ${({ theme }) => theme.birdgeStateBg};
    border: 1px solid ${({ theme }) => theme.birdgeStateBorder2};
    background: ${({ theme }) => theme.birdgeStateBg2};
    color: ${({ theme }) => theme.red1};
    // color: ${({ theme }) => theme.textColor};
    padding: 8px 12px;
    border-radius: 10px;
    text-align:center;
    font-size:14px;
  }
`

export default function ErrorTip ({
  errorTip
}: {
  errorTip:any
}) {
  if (!errorTip) return (<></>)
  return (
    <>
    {
      errorTip ? (
        <ErrorTipBox>
          <div className="txt">{errorTip.tip}</div>
        </ErrorTipBox>
      ) : ''
    }
    </>
  )
}