export const DEVCON6_ABI = [
  'event NewBid(address bidder, uint256 bidID, uint256 bidAmount)',
  'function bid() external payable',
  'function claim(uint256 bidderID) external',
  'function biddingStartTime() external view returns (uint256)',
  'function biddingEndTime() external view returns (uint256)',
]
