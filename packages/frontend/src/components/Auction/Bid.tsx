import { Colors } from 'src/styles/colors'
import { Form, FormRow } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import styled from 'styled-components'

export const Bid = () => {
  return (
    <Wrapper>
      <h2>Place bid</h2>
      <Form>
        <FormRow>
          <span>Raffle price (min. bid)</span>
          <span>0.15 ETH</span>
        </FormRow>
        <Input />
        <FormRow>
          <span>Your place in the raffle after the bid</span>
          <span>No. -</span>
        </FormRow>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: -135px;
  position: relative;
  z-index: 100;
  width: 724px;
  height: 450px;
  background-color: ${Colors.Blue};
  border-radius: 0px 0px 0px 99px;
`
