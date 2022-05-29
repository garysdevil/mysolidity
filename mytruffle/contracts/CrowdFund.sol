// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**  需求：
制作一个为筹集某个代币的众筹合约；
可以发起多次众筹活动；
众筹发起者只有在众筹已经结束，并且筹集到的金额大于等于众筹目标才能领取金额。
参与者可以在众筹结束前反悔。
*/
contract CrowFund {
    struct Campaign {
        uint256 startAt;
        uint256 endAt;
        uint256 goalAmount;
        uint256 pledgedAmount;
        address creator;
        bool claimed;
    }
    IERC20 public immutable token;
    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;
    mapping(uint256 => mapping(address => uint256)) public pledgedAmount;

    constructor(IERC20 _token) {
        token = IERC20(_token);
    }

    event launchLog(
        uint256 indexed id,
        address indexed creator,
        uint256 startAt,
        uint256 _endAt,
        uint256 goalAmount
    );
    event cancleLog(uint256 indexed id);
    event pledgeLog(uint256 indexed id, address indexed caller, uint256 amount);
    event unpledgeLog(
        uint256 indexed id,
        address indexed caller,
        uint256 amount
    );
    event claimLog(uint256 id);
    event refundLog(uint256 id, address indexed caller, uint256 amount);

    function launch(
        uint256 _startAt,
        uint256 _endAt,
        uint256 _goalAmount
    ) external {
        require(_startAt >= block.timestamp, "Error, starting time < now");
        require(_endAt > _startAt, "Error, ending time >= starting time");
        require(
            _endAt <= block.timestamp + 90 days,
            "Error ending time must be in 90 days"
        );

        campaignCount += 1;
        campaigns[campaignCount] = Campaign({
            startAt: _startAt,
            endAt: _endAt,
            goalAmount: _goalAmount,
            pledgedAmount: 0,
            creator: msg.sender,
            claimed: false
        });
        emit launchLog(
            campaignCount,
            msg.sender,
            _startAt,
            _endAt,
            _goalAmount
        );
    }

    function cancle(uint256 _id) external {
        require(_id <= campaignCount, "Error, this campaign does not exist");
        Campaign memory campaign = campaigns[_id];
        require(
            campaign.creator == msg.sender,
            "Error, you are not the owner of this campaign"
        );
        require(
            campaign.startAt >= block.timestamp,
            "Error, this campaign has started"
        );
        delete campaigns[campaignCount];

        emit cancleLog(_id);
    }

    function pledge(uint256 _id, uint256 _amount) external {
        require(_id <= campaignCount, "Error, this campaign does not exist");
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.endAt >= block.timestamp,
            "Error, this campaign has ended"
        );
        require(
            campaign.startAt <= block.timestamp,
            "Error, this campaign has not started,"
        );

        campaign.pledgedAmount += _amount;
        pledgedAmount[_id][msg.sender] += _amount;
        token.transferFrom(msg.sender, address(this), _amount);

        emit pledgeLog(_id, msg.sender, _amount);
    }

    function unpledge(uint256 _id, uint256 _amount) external {
        require(_id <= campaignCount, "Error, this campaign does not exist");
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.endAt >= block.timestamp,
            "Error, this campaign has ended"
        );

        // 如果_amount大于goalAmount或pledgedAmount，0.8.0^版本的solidity会抛出数学溢出错误，因此不需要对_amount进行约束
        campaign.goalAmount -= _amount;
        pledgedAmount[_id][msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);

        emit unpledgeLog(_id, msg.sender, _amount);
    }

    function claim(uint256 _id) external {
        require(_id <= campaignCount, "Error, this campaign does not exist");
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.endAt <= block.timestamp,
            "Error, this campaign has not ended"
        );
        require(
            campaign.goalAmount <= campaign.pledgedAmount,
            "Error, this campaign has finished the goal"
        );
        require(
            !campaign.claimed,
            "Error, the token of this campaign has been claimed"
        );

        campaign.claimed = true;
        token.transfer(campaign.creator, campaign.pledgedAmount);
        emit claimLog(_id);
    }

    // 众筹已经结束但依然没有达到众筹目标，则用户可以赎回自己的金额
    function refund(uint256 _id) external {
        require(_id <= campaignCount, "Error, this campaign does not exist");
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.endAt <= block.timestamp,
            "Error, this campaign has not ended"
        );
        require(
            campaign.goalAmount >= campaign.pledgedAmount,
            "Error, this campaign has finished the goal"
        );

        uint256 bal = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] = 0;
        token.transfer(msg.sender, bal);

        emit refundLog(_id, msg.sender, bal);
    }
}
