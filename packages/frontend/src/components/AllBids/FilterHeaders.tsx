import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { SearchIcon } from '../Icons/SearchIcon'

import { DisplayMode } from './AllBidsList'

interface Props {
  setDisplayMode: (mode: DisplayMode) => void
}

export const FilterHeaders = ({ setDisplayMode }: Props) => {
  return (
    <Wrapper>
      <SearchInputWrapper>
        <SearchIcon />
        <StyledInput />
      </SearchInputWrapper>
      <select onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}>
        <option value="All">Show All</option>
        <option value="Auction">Auction</option>
        <option value="Raffle">Raffle</option>
      </select>
    </Wrapper>
  )
}

const SearchInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 379px;
  max-width: 379px;
  height: 50px;
  padding: 13px;
  border-width: 2px;
  border-style: solid;
  border-color: ${Colors.BlueLight};
  background-color: ${Colors.White};
  transition: all 0.25s ease;

  &:hover,
  &:focus-visible,
  &:focus-within {
    border-color: ${Colors.GreenLight};
  }
`

const StyledInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0 45px;
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 0 28px;
`
