import React from 'react'
import styled from 'styled-components'

import { Colors } from '../styles/colors'

export const Hello = () => <HelloHeader>Hello World!</HelloHeader>

const HelloHeader = styled.h1`
  font-weight: 700;
  color: ${Colors.Waterloo};
`
