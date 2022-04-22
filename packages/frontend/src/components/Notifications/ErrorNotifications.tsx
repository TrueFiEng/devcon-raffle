import * as ToastPrimitive from '@radix-ui/react-toast'
import styled from 'styled-components'

import { NotificationToast } from './NotificationToast'

interface Props {
  error: string | undefined
  setError: (str?: string) => void
}

export const ErrorNotifications = ({ error, setError }: Props) => {
  return (
    <ToastPrimitive.Provider>
      {error && (
        <NotificationToast
          notification={{
            id: error,
            type: 'transactionError',
            submittedAt: Date.now(),
            message: error,
            transactionName: 'Get voucher code',
          }}
          setError={setError}
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
