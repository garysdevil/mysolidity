// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721 {
    function transferForm(
        address _from,
        address _to,
        uint256 _nftId
    ) external;
}

// 每次，当某个NFT进行荷兰拍卖时，都需要部署合约
contract DutchAuction {
    uint256 private constant DURATION = 7 days; // 被保存时，单位为秒

    IERC721 public immutable nft;
    uint256 public immutable nftId;

    address payable public immutable seller;
    uint256 public immutable startPrice;
    uint256 public immutable startAt;
    uint256 public immutable expireAt;
    uint256 public immutable discountRate; // 每秒折损多少钱

    constructor(
        address _nft,
        uint256 _nftId,
        uint256 _startPrice,
        uint256 _discountRate
    ) {
        require(
            _startPrice > _discountRate * DURATION,
            "starting price <  discountRate * DURATION"
        );
        nft = IERC721(_nft);
        nftId = _nftId;
        startPrice = _startPrice;
        discountRate = _discountRate;

        startAt = block.timestamp;
        expireAt = block.timestamp + DURATION;
        seller = payable(msg.sender);
    }

    function getPrice() public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - startAt;
        uint256 price = startPrice - discountRate * timeElapsed;
        return price;
    }

    function buy() external payable {
        require(msg.value >= getPrice(), "your ETH < nft price");
        nft.transferForm(seller, msg.sender, nftId); // 报错 Note: The called function should be payable if you send value and the value you send should be less than your current balance.
        selfdestruct(seller);
    }

    function destroy() external {
        require(block.timestamp > expireAt, "the auction have not expired");
        require(msg.sender == seller, "you are not the owner of this contract");
        selfdestruct(seller);
    }
}
