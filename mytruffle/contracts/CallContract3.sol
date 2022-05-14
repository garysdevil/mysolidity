// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

// 合约间的相互调用 方式三 低级调用。
contract CallTestContract {
    address public temp11;
    uint256 public temp22;
    bytes public data;

//    // call // 当设置gas时，可能因为gas不足而导致调用失败
//    function call_test1_failed(address contractAddr) public {
//         // 调用函数并发送100个Wei过去
//         (bool success,) = contractAddr.call{value: 100, gas: 50000}(abi.encodeWithSignature("setFunc1()")); require(success);
//     }
    // call // 调用函数并发送100个Wei过去
    function call_test2(address contractAddr) payable public {
        (bool success,) = contractAddr.call{value: 100}(abi.encodeWithSignature("setFunc1()")); require(success);
    }
    // call // 调用函数
    function call_test3(address contractAddr) public {
        (bool success,) = contractAddr.call(abi.encodeWithSignature("setFunc1()")); require(success);
    }
    // call // 调用函数，传递参数，并获取返回值
    function call_test4(address contractAddr) public {
        // 假如被调用合约的输入参数为test2(uint)，则这里必须写为uint256，不能写uint，否则找不到对应的函数而触发被调用合约的fallback函数
        (bool success, bytes memory _data) = contractAddr.call(abi.encodeWithSignature("setFunc2(uint256)",22)); require(success);
        data = _data;
    }
    // call // 调用函数，传递参数
    function call_test5_encodeWithSelector(address contractAddr) public {
        // 使用 Selector 进行abi编码，而不是 Signature 进行abi编码。
        // Signature 方式的abi编码最终也会编译为 Selector 。
        // 通过 Selector 方式，可以防止由于输入参数写错了而导致调用失败。
        // 但是必须知道合约的接口代码
        (bool success,) = contractAddr.call(abi.encodeWithSelector(TestContract.setFunc2.selector,22)); require(success);
    }

    // delegatecall
    function delegatecall_test1(address contractAddr) public {
        (bool success,) = contractAddr.delegatecall(abi.encodeWithSignature("setFunc1()")); require(success);      
    }

} 

contract TestContract {
   address public temp1;
   uint256 public temp2;    
   function setFunc1() payable public {
      temp1 = msg.sender;        
      temp2 = 11;    
   }
   // function setFunc2(uint _temp) payable public returns(address temp1,uint temp2){
   function setFunc2(uint _temp) payable public returns(address, uint){
      temp1 = msg.sender;        
      temp2 = _temp;
      return(temp1, temp2);
   }
   function reset() payable public {
      temp1 = address(0);        
      temp2 = 0;    
   }

   event Log(string func, address sender, uint value, bytes data);
   // 当只发生以太币时会调用receive函数。
   receive() payable external {
      emit Log("MyLog receive", msg.sender, msg.value, '');
   }
   // msg.data 不为空时会调用fallback函数。
   fallback() payable external {
      emit Log("MyLog fallback", msg.sender, msg.value, msg.data);
   }
}