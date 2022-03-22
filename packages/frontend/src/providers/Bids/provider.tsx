import { ReactNode } from "react"
import { Bid } from "src/models/Bid"
import { BidsContext } from "./context"

interface Props {
  children: ReactNode
}

export const BidsProvider = ({ children }: Props) => {
  const bids: Bid[] = []

  return <BidsContext.Provider value={{ bids }}>{children}</BidsContext.Provider>
}
