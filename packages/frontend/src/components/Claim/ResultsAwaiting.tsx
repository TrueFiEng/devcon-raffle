import { FormHeading, FormWideWrapper, FormText } from 'src/components/Form/Form'

export const ResultsAwaiting = () => {
  return (
    <FormWideWrapper>
      <FormHeading>Wait for results ⏳</FormHeading>
      <FormText>The bidding window has closed. Waiting for the organizers to settle the contest.</FormText>
    </FormWideWrapper>
  )
}
