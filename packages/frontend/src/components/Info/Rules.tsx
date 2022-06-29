import { ReactNode } from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface RuleProps {
  heading: string
  rule: string | ReactNode
  example?: string | ReactNode
}

export const Rule = ({ heading, rule, example }: RuleProps) => {
  return (
    <RuleWrapper>
      <RuleHeading>{heading}</RuleHeading>
      <RuleText>
        {rule}
        {example && <RuleExample><Bold>Example:</Bold> {example}</RuleExample>}
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

const Bold = styled.span`
  font-weight: 600;
  display: contents;
`

export const RuleText = styled.div`
  font-size: 16px;
  line-height: 24px;
  color: ${Colors.Black};
`

const RuleExample = styled.p`
  color: ${Colors.BlueDark};
  margin: 0;
`
