import * as ToastPrimitive from '@radix-ui/react-toast'
import { useCallback } from 'react'
import { CrossIcon } from 'src/components/Icons/CrossIcon'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { ErrorIcon } from '../Icons/ErrorIcon'

type TransactionError = {
  id: string
  type: 'transactionError'
  submittedAt: number
  message: string
  transactionName: string
}

interface Props {
  notification: TransactionError
  setError: (str?: string) => void
}

export const NotificationToast = ({ notification, setError }: Props) => {
  const removeNotification = useCallback(() => setError(undefined), [setError])

  return (
    <Toast onOpenChange={(open) => open || removeNotification()} duration={5000}>
      <NotificationIconWrapper>
        <ErrorIcon color={Colors.Red} size={24} />
      </NotificationIconWrapper>
      <ToastContent>
        <NotificationTitle>Error</NotificationTitle>
        <NotificationDescription>{notification.message}</NotificationDescription>
        <NotificationActionText>Try Again</NotificationActionText>
      </ToastContent>
      <Close>
        <CrossIcon size={24} color={Colors.Grey} />
      </Close>
    </Toast>
  )
}

const Toast = styled(ToastPrimitive.Root)`
  display: flex;
  column-gap: 16px;
  position: relative;
  width: 330px;
  height: fit-content;
  padding: 8px;
  border: 1px solid ${Colors.GreyLight};
  border-radius: 4px;
  background-color: ${Colors.White};
  box-shadow: 0 12px 32px rgba(6, 20, 57, 0.05), 0 8px 16px rgba(6, 20, 57, 0.05), 0 4px 8px rgba(6, 20, 57, 0.03);
`

const NotificationIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
`

const ToastContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`

const NotificationTitle = styled(ToastPrimitive.Title)`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${Colors.Red};
`

const NotificationDescription = styled(ToastPrimitive.Description)`
  margin: 8px 0 12px;
  font-size: 14px;
  line-height: 20px;
  color: ${Colors.Grey};
`

const NotificationActionText = styled(ToastPrimitive.Description)`
  font-weight: 300;
  font-size: 14px;
  line-height: 20px;
  color: ${Colors.Blue};
`

const Close = styled(ToastPrimitive.Close)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: ${Colors.Grey};
  background: none;
  border: none;
`
