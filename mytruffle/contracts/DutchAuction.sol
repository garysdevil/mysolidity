// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721{
    function transferForm(
        address _from,
        address _to,
        uint _nftId
    ) external;
}

contract DutchAuction{
    uint private constant DURATION = 7 days; // 被保存时，单位为秒

    IERC721  public immutable nft;
    uint public immutable nftId;

    address payable public immutable seller;
    uint public immutable startPrice;
    uint public immutable startAt;
    uint public immutable expireAt;
    uint public immutable discountRate; // 每秒折损多少钱


    constructor(address _nft, uint _nftId, uint _startPrice, uint _discountRate){
        require(_startPrice >  _discountRate * DURATION, "starting price <  discountRate * DURATION");
        nft = IERC721(_nft);
        nftId = _nftId;
        startPrice = _startPrice;
        discountRate = _discountRate;

        startAt = block.timestamp;
        expireAt = block.timestamp + DURATION;
        seller = payable(msg.sender);
    }

    function getPrice() public view returns(uint){
        uint timeElapsed = block.timestamp - startAt;
        uint price = startPrice - discountRate * timeElapsed;
        return price;
    }

    function buy() payable external{
        require(msg.value >= getPrice(), "your ETH < nft price");
        nft.transferForm(seller, msg.sender, nftId); // 报错 Note: The called function should be payable if you send value and the value you send should be less than your current balance.
        selfdestruct(seller);
    }

    function destroy() external{
        require(block.timestamp > expireAt, "the auction have not expired");
        require(msg.sender == seller, "you are not the owner of this contract");
        selfdestruct(seller);
    }

}