import * as ToastPrimitive from '@radix-ui/react-toast'
import { Notification, useNotifications } from '@usedapp/core'
import { useCallback } from 'react'
import { CrossIcon } from 'src/components/Icons/CrossIcon'
import { useChainId } from 'src/hooks/chainId/useChainId'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { CheckIcon } from '../Icons/CheckIcon'
import { ErrorIcon } from '../Icons/ErrorIcon'
import { LoadingIcon } from '../Icons/LoadingIcon'

type TransactionStarted = Extract<Notification, { type: 'transactionStarted' }>
type TransactionSucceed = Extract<Notification, { type: 'transactionSucceed' }>
type TransactionFailed = Extract<Notification, { type: 'transactionFailed' }>
type TransactionSignError = {
  id: string
  type: 'transactionSignError'
  submittedAt: number
  message: string
  transactionName: string
}

export type TransactionNotification = TransactionStarted | TransactionSucceed | TransactionFailed | TransactionSignError

interface Props {
  notification: TransactionNotification
}

export const NotificationToast = ({ notification }: Props) => {
  const chainId = useChainId()
  const { removeNotification } = useNotifications()

  const removeNotificationWithDelay = useCallback(
    () => setTimeout(() => removeNotification({ chainId, notificationId: notification.id }), 500),
    [chainId, notification.id, removeNotification]
  )

  return (
    <Toast onOpenChange={(open) => open || removeNotificationWithDelay()} duration={50000}>
      <NotificationIconWrapper>
        <NotificationIcon notification={notification} />
      </NotificationIconWrapper>
      <ToastContent>
        <NotificationTitle>{printNotificationTitle(notification)}</NotificationTitle>
        <NotificationDescription>{printNotificationDescription(notification)}</NotificationDescription>
        {notification.type === 'transactionSignError' ||
          (notification.type === 'transactionFailed' && <NotificationActionText>Try Again</NotificationActionText>)}
      </ToastContent>
      <Close>
        <CrossIcon size={24} color={Colors.Grey} />
      </Close>
    </Toast>
  )
}

function printNotificationTitle(notification: TransactionNotification) {
  switch (notification.type) {
    case 'transactionStarted':
      return 'Pending Transaction'
    case 'transactionSucceed':
      return notification.transactionName
    case 'transactionFailed':
    case 'transactionSignError':
      return 'Error'
  }
}

function printNotificationDescription(notification: TransactionNotification) {
  switch (notification.type) {
    case 'transactionStarted':
      return 'Waiting for your transaction to be confirmed'
    case 'transactionSucceed':
      return 'Transaction succeeded'
    case 'transactionFailed':
      return 'Transaction failed'
    case 'transactionSignError':
      return notification.message
  }
}

const NotificationIcon = ({ notification }: { notification: TransactionNotification }) => {
  switch (notification.type) {
    case 'transactionStarted':
      return <LoadingIcon color={Colors.Blue} />
    case 'transactionSucceed':
      return <CheckIcon color={Colors.GreenDark} />
    case 'transactionFailed':
    case 'transactionSignError':
      return <ErrorIcon color={Colors.Red} size={24} />
  }
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
  box-shadow: 0px 12px 32px rgba(6, 20, 57, 0.05), 0px 8px 16px rgba(6, 20, 57, 0.05), 0px 4px 8px rgba(6, 20, 57, 0.03);
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
