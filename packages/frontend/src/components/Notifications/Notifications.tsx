import * as ToastPrimitive from '@radix-ui/react-toast'
import { useNotifications } from '@usedapp/core'
import styled from 'styled-components'

import { NotificationToast, TransactionNotification } from './NotificationToast'

export const Notifications = () => {
  const { notifications } = useNotifications()

  const transactionNotifications: TransactionNotification[] = [
    ...(notifications.filter(({ type }) => type !== 'walletConnected') as TransactionNotification[]),
  ].sort((a, b) => b.submittedAt - a.submittedAt)

  return (
    <ToastPrimitive.Provider>
      {transactionNotifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
      <NotificationsList />
    </ToastPrimitive.Provider>
  )
}

const NotificationsList = styled(ToastPrimitive.Viewport)`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  position: absolute;
  top: 24px;
  right: 68px;
  margin: 0;
  padding: 0;
  z-index: 10;
  transition: all 0.25s ease;
`
