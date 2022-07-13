import { CLIArgumentType } from 'hardhat/src/types'
import { HardhatError } from 'hardhat/src/internal/core/errors'
import { ERRORS } from 'hardhat/src/internal/core/errors-list'
import { utils } from 'ethers'

export const bytes32: CLIArgumentType<Uint8Array> = {
  name: 'bytes32',
  parse(argName: string, strValue: string): Uint8Array {
    try {
      return parseBytes32(strValue)
    } catch (error) {
      if (error instanceof Error) {
        throw new HardhatError(
          ERRORS.ARGUMENTS.INVALID_VALUE_FOR_TYPE,
          {
            strValue,
            name: argName,
            type: bytes32.name,
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
        type: bytes32.name,
      })
    }
  },
}

function parseBytes32(strValue: string): Uint8Array {
  if (!utils.isHexString(strValue, 32)) {
    throw new Error('not bytes32')
  }
  return utils.arrayify(strValue)
}
