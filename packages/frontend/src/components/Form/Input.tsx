import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { CloseCircleIcon } from 'src/components/Icons/CloseCircleIcon'
import { EtherIcon } from 'src/components/Icons/EtherIcon'
import { useUserBid } from 'src/hooks/useUserBid'
import { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { formatInputAmount } from 'src/utils/formatters/formatInputAmount'
import styled from 'styled-components'

interface InputProps {
  amount: BigNumber
  setAmount: (val: BigNumber) => void
  notEnoughBalance: boolean
  bidTooLow: boolean
}

const numberInputRegex = /^((\d*)|(\d+[.,])|([.,]\d*)|(\d+[.,]\d+))$/

export const Input = ({ amount, setAmount, notEnoughBalance, bidTooLow }: InputProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const userBid = useUserBid()

  const [initialInput, setInitialInput] = useState(formatEther(amount))
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInitialInput(formatEther(amount))
  }, [amount])

  const onChange = (value: string) => {
    if (!numberInputRegex.test(value)) {
      return
    }
    if (value !== '') {
      const formattedValue = value.replace(',', '.')
      setInputValue(formattedValue)
      setAmount(parseEther(formattedValue))
    } else {
      setInputValue('')
      setAmount(parseEther('0'))
    }
  }

  const onBlur = (value: string) => {
    if (value !== '') {
      const formattedValue = formatInputAmount(value)
      setInputValue(formattedValue)
      setAmount(parseEther(formattedValue))
    }
  }

  return (
    <InputWrapper userBid={userBid}>
      <InputLabel>Balance: {userBalance ? formatEtherAmount(userBalance) : '-'} ETH</InputLabel>
      <StyledInputWrapper isBadAmount={notEnoughBalance || bidTooLow}>
        <TokenIconWrapper>
          <EtherIcon />
        </TokenIconWrapper>
        <StyledInput
          value={inputValue}
          placeholder={initialInput}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          onFocus={() => setInputValue(initialInput)}
          role="input"
        />
        <InputTokenName>ETH</InputTokenName>
      </StyledInputWrapper>
      {notEnoughBalance && <ErrorMessage message="Not enough balance" />}
      {!notEnoughBalance && bidTooLow && (
        <ErrorMessage message={userBid ? 'Amount below min increment' : 'Bid amount must be at least Raffle price'} />
      )}
    </InputWrapper>
  )
}

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <InputErrors>
      <CloseCircleIcon size={16} color={Colors.Red} />
      <InputErrorLabel>{message}</InputErrorLabel>
    </InputErrors>
  )
}

const InputWrapper = styled.div<{ userBid: BidWithPlace | undefined }>`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${({ userBid }) => (userBid === undefined ? '12px' : '16px')};
`

export const InputLabel = styled.div`
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
const StyledInputWrapper = styled.div<{ isBadAmount?: boolean; disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: 50px;
  padding: 13px;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ isBadAmount }) => (isBadAmount ? Colors.Red : Colors.White)};
  background-color: ${({ disabled }) => (disabled ? Colors.GreyLight : Colors.White)};
  transition: all 0.25s ease;

  &:hover,
  &:focus-visible,
  &:focus-within {
    border-color: ${({ isBadAmount }) => (isBadAmount ? Colors.Red : Colors.GreenLight)};
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

  &,
  &:disabled {
    background-color: transparent;
  }

  &::placeholder {
    color: currentColor;
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
  align-items: center;
  column-gap: 8px;
  width: 100%;
  max-width: 100%;
  position: absolute;
  top: calc(100% + 4px);
  overflow: hidden;
`

const InputErrorLabel = styled(InputLabel)`
  justify-content: flex-start;
  margin: 0;
  font-weight: 300;
  color: ${Colors.Red};
`
