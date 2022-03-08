import React from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'


export const Hello = () => <HelloHeader>Hello World!</HelloHeader>

const HelloHeader = styled.h1`
  font-weight: 700;
  color: ${Colors.Waterloo};
`
