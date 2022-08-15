import styled from 'styled-components'
import { darken } from 'polished'
import { transparentize } from 'polished'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'


export const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap};
  
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0rem 0.75rem')};
  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-wrap:wrap;
    padding: 0;
  `};
`

export const CurrencySelectBox = styled.div`
  ${({ theme }) => theme.flexBC};
  width: 100%;
  overflow:hidden;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin-top:10px;
  `};
`

export const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  color: ${({ selected, theme }) => (selected ? theme.textColor : '#031a6e')};
  font-size: ${({ selected }) => (selected ? '1rem' : '12px')};
  height: 70px;
  font-family: 'Manrope';
  width: 220px;
  border: 0.0625rem solid ${({ theme }) => theme.selectedBorder};
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.selectedBg};
  outline: none;
  cursor: pointer;
  user-select: none;
  padding: 0 1.25rem;
  position: relative;
  margin: 0 5px;

  :hover {
    border: 0.0625rem solid ${({ theme }) => theme.selectedHoverBorder};
    background: ${({ theme }) => theme.selectedHoverBg};
  }

  :focus {
    border: 0.0625rem solid ${({ theme }) => darken(0.1, theme.selectedBorder)};
  }

  :active {
    background-color: ${({ theme }) => darken(0.1, theme.selectedBorder)};
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    height: 60px;
    width: 100%;
    padding: 0 0.625rem;
    margin: 0 5px;
  `};
`

export const ErrorSpanBox = styled.div`
  height: 70px;
  width: 220px;
  margin-left: 0.625rem;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: none;
  `};
`
export const ErrorSpan = styled.span`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  height: 100%;
  color: ${({ theme }) => theme.textColor};
  border: 0.0625rem solid ${({ theme }) => theme.selectedBorderNo};
  background-color: ${({ theme }) => theme.selectedBgNo};
  border-radius: 0.75rem;
  outline: none;
  cursor: pointer;
  user-select: none;

  :hover {
    cursor: pointer;
    border: 0.0625rem solid ${({ theme }) => theme.selectedHoverBorderNo};
    background-color: ${({ theme }) => theme.selectedHoverBgNo};
  }
`

export const ExtraText = styled.div`
  width: 100%;
  font-family: 'Manrope';
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  position: relative;
  color: ${({ theme }) => theme.textColorBold};
  h5 {
    font-weight: normal;
    line-height: 1;
    font-size: 0.75rem;
    margin: 0.25rem 0;
  }
  p {
    font-size: 0.875rem;
    line-height: 1.43;
    margin: 0;
    font-weight: 800;
  }
`

export const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 5px 0 0;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

export const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0px 1.625rem 0 51px;
  width: 100%;
  height: 100%;
  &.pl-0 {
    padding-left: 0;
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 0px 1.625rem 0 40px;
  `};
`

export const TokenLogoBox = styled.div`
  ${({ theme }) => theme.flexC};
  width: 46px;
  height: 46px;
  background: ${({ theme }) => theme.white};
  box-sizing: border-box;
  border-radius: 100%;
  position: absolute;
  top: 0.625rem;
  left: 0;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 36px;
    height: 36px;
  `};
`

export const StyledDropDownBox = styled.div`
  ${({ theme }) => theme.flexC}
  width: 1.625rem;
  height: 1.625rem;
  background: ${({ theme }) => theme.arrowBg};
  border-radius: 100%;
  position: absolute;
  top: 1.25rem;
  right: 0px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    top: 1rem;
  `};
`
export const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

export const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '1.25rem' : '1.25rem')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
  width:100%;
  &.error {
    border: 1px solid ${({ theme }) => theme.red1};
  }
`

export const Container = styled.div<{ hideInput: boolean }>`
  // border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  // border: 1px solid ${({ theme }) => theme.bg2};
  width:100%;
  background-color: ${({ theme }) => theme.contentBg};
  box-shadow: 0 0.25rem 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
  border-radius: 1.25rem;
  border: 1px solid rgb (255, 92, 177);
  padding: 1.25rem 2.5rem;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 1rem 1rem;
  `}
`

export const StyledTokenName = styled.span<{ active?: boolean }>`
  text-align:left;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `}
  h3 {
    font-family: 'Manrope';
    font-size: 1rem;
    font-weight: 800;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    color: ${({ theme }) => theme.selectTextColor};
    margin:0 0 2px;
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
    ${({ theme }) => theme.mediaWidth.upToLarge`
      font-size: 12px;
      margin:0;
    `}
  }
  p {
    width: 100%;
    font-family: 'Manrope';
    font-size: 0.75rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    color: ${({ theme }) => theme.selectTextColor};
    margin:8px 0 0;
    ${({ theme }) => theme.mediaWidth.upToLarge`
      display:none;
    `}
  }
`

export const HideSmallBox = styled.div`
  display:none;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: block;
  `}
`

export const TabList = styled.div`
${({ theme }) => theme.flexSC};
width: 100%;
.item {
  padding: 8px 12px;
  cursor:pointer;
  border-bottom: 2px solid transparent;
  &.active {
    // color: ${({ theme }) => theme.primary1};
    color: #734be2;
    font-weight:bold;
    border-bottom: 2px solid #734be2;
  }
}
`