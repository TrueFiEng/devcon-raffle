import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from 'src/components/Icons/ArrowLeftIcon'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface BackButtonProps {
  view?: number
  setView?: (view: number) => void
  url?: string
}

export function BackButton({ view, setView, url }: BackButtonProps) {
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    if (view && setView) {
      setView(view - 1)
    }
    if (url) {
      navigate(`${url}`)
    }
  }, [setView, view, url])

  return (
    <BackBtn onClick={goBack}>
      <ArrowLeftIcon />
      Back
    </BackBtn>
  )
}

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  width: 84px;
  height: 32px;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  background-color: ${Colors.Transparent};
  color: ${Colors.GreenLight};
  border: 1px solid ${Colors.GreenLight};

  &:hover,
  &:focus-visible,
  &:active {
    background-color: ${Colors.GreenLight};
    color: ${Colors.Black};
  }
`
