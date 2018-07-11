pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract StandardTokenExtended is StandardToken {

  string public name;
  uint8 public decimals;
  string public symbol;
  uint256 public totalSupply;

  constructor(
    uint256 _amount,
    string _name,
    uint8 _decimals,
    string _symbol
  )
    public
  {
    balances[msg.sender] = _amount;
    totalSupply = _amount;
    name = _name;
    decimals = _decimals;
    symbol = _symbol;
  }

  function approveAndCall(
    address _spender,
    uint256 _value,
    bytes _extraData
  )
    public
    returns (bool success)
  {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    require(
      _spender.call(
        bytes4(
          bytes32(
            keccak256("receiveApproval(address,uint256,address,bytes)")
          )
        ),
        msg.sender,
        _value,
        this,
        _extraData
      )
    );
    return true;
  }

}
