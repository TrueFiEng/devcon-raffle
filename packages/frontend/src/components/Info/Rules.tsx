import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface RuleProps {
  heading: string
  rule: string
  example?: string
}

export const Rule = ({ heading, rule, example }: RuleProps) => {
  return (
    <RuleWrapper>
      <RuleHeading>{heading}</RuleHeading>
      <RuleText>
        {rule}
        {example && (
          <RuleExample>
            <span>Example:</span> {example}
          </RuleExample>
        )}
      </RuleText>
    </RuleWrapper>
  )
}

const RuleWrapper = styled.div`
  width: 100%;
`

const RuleHeading = styled.h4`
  margin: 0;
`

export const RuleText = styled.div`
  font-size: 16px;
  line-height: 24px;
  color: ${Colors.Grey};
`

const RuleExample = styled.p`
  margin: 0;
  & span {
    color: ${Colors.Black};
  }
`
