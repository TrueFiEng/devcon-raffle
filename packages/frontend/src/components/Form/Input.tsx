import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { CloseCircleIcon } from 'src/components/Icons/CloseCircleIcon'
import { EtherIcon } from 'src/components/Icons/EtherIcon'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface InputProps {
  bid: number
  setBid: (val: number) => void
  error: boolean
}

export const Input = ({ bid, setBid, error }: InputProps) => {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)

  return (
    <InputWrapper>
      <InputLabel>Balance: {etherBalance ? formatEther(etherBalance) : '-'} ETH</InputLabel>
      <StyledInputWrapper error={error}>
        <TokenIconWrapper>
          <EtherIcon />
        </TokenIconWrapper>
        <StyledInput
          type="number"
          value={bid.toString()}
          onChange={(e) => setBid(Number(e.target.value))}
          role="input"
        />
        <InputTokenName>ETH</InputTokenName>
      </StyledInputWrapper>
      {error && (
        <InputErrors>
          <CloseCircleIcon size={16} />
          <InputErrorLabel>Error message text goes here</InputErrorLabel>
        </InputErrors>
      )}
    </InputWrapper>
  )
}

const InputWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
`

const InputLabel = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  max-width: 100%;
  margin-bottom: 4px;
  color: ${Colors.White};
  font-size: 12px;
  line-height: 18px;
`
const StyledInputWrapper = styled.div<{ error?: boolean; disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: 50px;
  padding: 13px;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ error }) => (error ? Colors.Red : Colors.White)};
  background-color: ${({ disabled }) => (disabled ? Colors.GreyLight : Colors.White)};
  transition: all 0.25s ease;

  &:hover,
  &:focus-visible,
  &:focus-within {
    border-color: ${({ error }) => (error ? Colors.Red : Colors.GreenLight)};
  }
`

const StyledInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding-left: 45px;
  border: none;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  outline: none;
  cursor: inherit;
  color: ${Colors.Black};
  transition: all 0.25s ease;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &,
  &:disabled {
    background-color: transparent;
  }
`

const TokenIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  z-index: 2;
`

const InputTokenName = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: ${Colors.Black};
  z-index: 2;
`

const InputErrors = styled.div`
  display: flex;
  position: absolute;
  top: 100%;
  align-items: center;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`

const InputErrorLabel = styled(InputLabel)`
  font-weight: 300;
  color: ${Colors.Red};
  margin-left: 8px;
  justify-content: flex-start;
`
