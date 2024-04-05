import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import { ScoreAttestationVerifier, ScoreAttestationVerifier__factory } from 'contracts'
import { attestScore } from 'utils/attestScore'
import { BigNumberish, Signer, Wallet, ethers } from 'ethers'
import { MockProvider } from 'ethereum-waffle'
import { _TypedDataEncoder, defaultAbiCoder as abi } from 'ethers/lib/utils'

describe('ScoreAttestationVerifier', function () {
  const loadFixture = setupFixtureLoader()

  let attestor: Wallet
  let scoreAttestationVerifier: ScoreAttestationVerifier

  function createScoreAttestationVerifierFixture(opts: ScoreAttestationVerifierFixtureOptions = {}) {
    return async (wallets: Wallet[], _provider: MockProvider) => {
      const deployer = opts.deployer || wallets[0]
      const version = opts.version || '1'
      const requiredScore = opts.initialRequiredScore || 20 * 10 ** 8
      const initialAttestor = opts.attestor || wallets[1]
      const scoreAttestationVerifier = await new ScoreAttestationVerifier__factory(deployer).deploy(
        version,
        initialAttestor.address,
        requiredScore
      )
      return {
        scoreAttestationVerifier,
        deployer,
        attestor: initialAttestor,
        version,
        requiredScore,
      }
    }
  }

  it('verifies a valid attestation', async () => {
    ;({ scoreAttestationVerifier, attestor } = await loadFixture(createScoreAttestationVerifierFixture()))

    const subject = Wallet.createRandom().address
    const score = '2071087800' // 20.71
    const { digest, signature } = await attestScore(subject, score, attestor, scoreAttestationVerifier.address, {
      chainId: '31337',
      version: '1',
    })
    expect(ethers.utils.recoverAddress(digest, signature)).to.eq(await scoreAttestationVerifier.attestor()) // Sanity
    const payload = abi.encode(['address', 'uint256'], [subject, score])
    await expect(scoreAttestationVerifier.verify(payload, signature)).to.not.be.reverted
  })

  it('rejects an attestation from unauthorised attestor', async () => {
    ;({ scoreAttestationVerifier, attestor } = await loadFixture(createScoreAttestationVerifierFixture()))

    const subject = Wallet.createRandom().address
    const score = '2000000000' // 20
    const wrongAttestor = Wallet.createRandom()
    const { digest, signature } = await attestScore(subject, score, wrongAttestor, scoreAttestationVerifier.address, {
      chainId: '31337',
      version: '1',
    })
    expect(ethers.utils.recoverAddress(digest, signature)).to.not.eq(await scoreAttestationVerifier.attestor()) // Sanity
    const payload = abi.encode(['address', 'uint256'], [subject, score])
    await expect(scoreAttestationVerifier.verify(payload, signature)).to.be.revertedWith('Unauthorised attestor')
  })

  it('rejects if minimum score not met', async () => {
    ;({ scoreAttestationVerifier, attestor } = await loadFixture(createScoreAttestationVerifierFixture()))

    const subject = Wallet.createRandom().address
    const score = '1999999999' // 19.99999999
    const { digest, signature } = await attestScore(subject, score, attestor, scoreAttestationVerifier.address, {
      chainId: '31337',
      version: '1',
    })
    expect(ethers.utils.recoverAddress(digest, signature)).to.eq(await scoreAttestationVerifier.attestor()) // Sanity
    const payload = abi.encode(['address', 'uint256'], [subject, score])
    await expect(scoreAttestationVerifier.verify(payload, signature)).to.be.revertedWith('Score too low')
  })
})

interface ScoreAttestationVerifierFixtureOptions {
  deployer?: Signer
  attestor?: Wallet
  version?: string
  initialRequiredScore?: BigNumberish
}
