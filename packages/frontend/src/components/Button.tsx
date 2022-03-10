import React, { ReactNode } from 'react'
import { LoadingIcon } from 'src/components/Icons/LoadingIcon'
import { Colors } from 'src/styles/colors'
import styled, { css } from 'styled-components'

interface ButtonProps {
  children: ReactNode
  className?: string
  view?: 'primary' | 'secondary'
  size?: 'small' | 'medium'
  wide?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

export const Button = ({
  children,
  className,
  view = 'primary',
  size = 'medium',
  wide,
  disabled,
  loading,
  onClick,
}: ButtonProps) => {
  return (
    <ButtonContainer
      className={className}
      view={view}
      size={size}
      wide={wide}
      disabled={disabled || loading}
      loading={loading}
      onClick={onClick}
    >
      {loading ? <LoadingIcon /> : children}
    </ButtonContainer>
  )
}

const commonButtonStyles = css<ButtonProps>`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: ${({ wide }) => (wide ? '100%' : 'fit-content')};
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  font-weight: 400;
  text-align: center;
  outline: none;
  overflow: hidden;
  transition: all 0.25s ease;
`

const expandedButtonStyles = css<Pick<ButtonProps, 'size'>>`
  min-width: ${({ size }) => {
    switch (size) {
      case 'medium':
      default:
        return '200px'
      case 'small':
        return '128px'
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'medium':
      default:
        return '40px'
      case 'small':
        return '32px'
    }
  }};
  font-size: ${({ size }) => {
    switch (size) {
      case 'small':
        return '14px'
      case 'medium':
      default:
        return '16px'
    }
  }};
  line-height: ${({ size }) => {
    switch (size) {
      case 'small':
        return '20px'
      case 'medium':
      default:
        return '24px'
    }
  }};
  padding: ${({ size }) => {
    switch (size) {
      case 'small':
        return '6px'
      case 'medium':
      default:
        return '8px'
    }
  }};
`

const PrimaryButtonStyles = css<ButtonProps>`
  ${commonButtonStyles}
  ${expandedButtonStyles}

  background-color: ${Colors.Green};
  border-color: ${Colors.Green};
  color: ${Colors.Black};

  &:hover,
  &:focus-visible {
  }

  &:active {
  }

  &:disabled {
    background-color: ${Colors.GreyLight};
    border-color: ${Colors.GreyLight};
  }
`

const SecondaryButtonStyles = css<ButtonProps>`
  ${commonButtonStyles}
  ${expandedButtonStyles}

  background-color: ${Colors.White};
  border-color: ${Colors.Blue};
  color: ${Colors.Blue};

  &:hover,
  &:focus-visible {
  }

  &:active {
  }
`

export const ButtonContainer = styled.button<ButtonProps>`
  ${({ view }) => {
    switch (view) {
      case 'primary':
      default:
        return PrimaryButtonStyles
      case 'secondary':
        return SecondaryButtonStyles
    }
  }};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`
