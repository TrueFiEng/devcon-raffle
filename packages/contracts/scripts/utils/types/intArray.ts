import { CLIArgumentType } from 'hardhat/src/types'
import { HardhatError } from 'hardhat/internal/core/errors'
import { ERRORS } from 'hardhat/internal/core/errors-list'

export const intArray: CLIArgumentType<any> = {
  name: 'intArray',
  parse(argName: string, strValue: string): number[] {
    try {
      return parseIntArray(strValue)
    } catch (error) {
      if (error instanceof Error) {
        throw new HardhatError(
          ERRORS.ARGUMENTS.INVALID_VALUE_FOR_TYPE,
          {
            value: strValue,
            name: argName,
            type: intArray.name,
          },
          error,
        )
      }
      throw error
    }
  },

  validate: (argName: string, value: any): void => {
    if (value === undefined) {
      throw new HardhatError(ERRORS.ARGUMENTS.INVALID_VALUE_FOR_TYPE, {
        value,
        name: argName,
        type: intArray.name,
      })
    }
  },
}

function parseIntArray(strValue: string): number[] {
  const possiblyIntArray: unknown = JSON.parse(strValue)
  if (!Array.isArray(possiblyIntArray)) {
    throw new Error('not an array')
  }

  return possiblyIntArray.map(parseInt)
}

function parseInt(possiblyInt: any): number {
  if (!Number.isInteger(possiblyInt)) {
    throw new Error('not all elements are integers')
  }
  return possiblyInt
}
