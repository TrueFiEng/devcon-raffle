import { setupFixtureLoader } from "../setup";
import { configuredDevcon6Fixture } from "fixtures/devcon6Fixture";
import { expect } from "chai";

describe("Config", function() {
  const loadFixture = setupFixtureLoader()

  describe("constructor", function() {
    it("reverts for zero auction winners count", async function() {
      await expect(loadFixture(configuredDevcon6Fixture({auctionWinnersCount: 0})))
        .to.be.revertedWith("Config: auction winners count must be greater than 0")
    });

    it("reverts for zero raffle winners count", async function() {
      await expect(loadFixture(configuredDevcon6Fixture({raffleWinnersCount: 0})))
        .to.be.revertedWith("Config: raffle winners count must be greater than 0")
    });

    it("reverts for raffle winners count non-divisible by 8", async function() {
      await expect(loadFixture(configuredDevcon6Fixture({raffleWinnersCount: 7})))
        .to.be.revertedWith("Config: raffle winners count must be divisible by 8")
    });
  });
});
