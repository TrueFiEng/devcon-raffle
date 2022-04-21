import * as ToastPrimitive from '@radix-ui/react-toast'
import { useNotifications } from '@usedapp/core'
import styled from 'styled-components'

import { NotificationToast, TransactionNotification } from './NotificationToast'

interface Props {
  error?: string
}

export const Notifications = ({ error }: Props) => {
  const { notifications } = useNotifications()

  const transactionNotifications: TransactionNotification[] = [
    ...(notifications.filter(({ type }) => type !== 'walletConnected') as TransactionNotification[]),
  ].sort((a, b) => b.submittedAt - a.submittedAt)

  return (
    <ToastPrimitive.Provider>
      {transactionNotifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
      {error && (
        <NotificationToast
          notification={{
            id: error,
            type: 'transactionSignError',
            submittedAt: 1,
            message: error,
            transactionName: 'Get voucher code',
          }}
        />
      )}
      <NotificationsList />
    </ToastPrimitive.Provider>
  )
}

export const NotificationsList = styled(ToastPrimitive.Viewport)`
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
