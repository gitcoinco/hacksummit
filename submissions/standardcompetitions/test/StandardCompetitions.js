// import contracts
const StandardCompetitions = artifacts.require('../contracts/StandardCompetitions.sol');
const StandardTokenExtended = artifacts.require('../contracts/StandardTokenExtended.sol');

// import utils for error checking
const utils = require('./helpers/Utils');

// generate example token method
const generateExampleToken = async () => {
  const token = await StandardTokenExtended.new(
    1000,               // uint256    _amount,
    'Token',            // string     _name,
    18,                 // uint8      _decimals,
    'TKN',              // string     _symbol
  );
  return token;
}

// testing StandardCompetitions contract
contract('StandardCompetitions', (accounts) => {

  // valid default parameters
  const _host = accounts[0];
  const _deadline = 1577836800;
  const _specification = 'specification';
  const _competitionId = 0;
  const _judges = [accounts[1], accounts[2], accounts[3]];
  const _prizes = [100, 50, 25];
  const _token = 0x0;
  const _amount = 175;
  const _contestant1 = accounts[7];
  const _contestant2 = accounts[8];
  const _contestant3 = accounts[9];
  const _submission1 = 0;
  const _submission2 = 1;
  const _submission3 = 2;

  // valid update parameters
  const newHost = accounts[1];
  const newDeadline = 1704067200;
  const newSpecification = 'updated specification';
  const newJudges = [accounts[4], accounts[5], accounts[6]];
  const newPrizes = [200, 100, 50];

  // valid stages
  const Draft = 0;
  const Active = 1;
  const Completed = 2;
  const Cancelled = 3;

  // valid setup methods
  const validCompetitionCreation = async (registry) => {
    await registry.createCompetition(
      _host,              // address    _host
      _deadline,          // uint       _deadline
      _specification,     // string     _specification
      _judges,            // address[]  _judges
      _prizes,            // uint[]     _prizes
      _token,             // address    _token
    );
  }
  const validCompetitionHostUpdate = async (registry) => {
    await registry.updateCompetitionHost(
      _competitionId,     // uint       _competitionId
      newHost,            // address    _host
    );
  }
  const validCompetitionDeadlineUpdate = async (registry) => {
    await registry.updateCompetitionDeadline(
      _competitionId,     // uint       _competitionId
      newDeadline,        // uint       _deadline
    );
  }
  const validCompetitionSpecificationUpdate = async (registry) => {
    await registry.updateCompetitionSpecification(
      _competitionId,     // uint       _competitionId
      newSpecification,   // string     _specification
    );
  }
  const validCompetitionJudgesUpdate = async (registry) => {
    await registry.updateCompetitionJudges(
      _competitionId,     // uint       _competitionId
      newJudges,          // address[]  _judges
    );
  }
  const validCompetitionPrizesUpdate = async (registry) => {
    await registry.updateCompetitionPrizes(
      _competitionId,     // uint       _competitionId
      newPrizes,          // uint[]     _prizes
    );
  }
  const validCompetitionTokenUpdate = async (registry, tokenAddress) => {
    await registry.updateCompetitionToken(
      _competitionId,     // uint       _competitionId
      tokenAddress,       // address    _token
    );
  }
  const validCompetitionTransfer = async (registry) => {
    await registry.transferToCompetition(
      _competitionId,     // uint       _competitionId
      _amount,            // uint       _amount
      {
        from: accounts[0],
        value: _amount,
      },
    );
  }
  const validCompetitionActivation = async (registry) => {
    await registry.activateCompetition(
      _competitionId,     // uint       _competitionId
    );
  }
  const validCompetitionCompletion = async (registry) => {
    await registry.completeCompetition(
      _competitionId,     // uint       _competitionId
    );
  }
  const validCompetitionCancellation = async (registry) => {
    await registry.cancelCompetition(
      _competitionId,     // uint       _competitionId
    );
  }
  const validSubmissionsCreation = async (registry) => {
    await registry.createSubmission(
      _competitionId,     // uint       _competitionId
      _specification,     // string     _specification
      {
        from: _contestant1,
      }
    );
    await registry.createSubmission(
      _competitionId,     // uint       _competitionId
      _specification,     // string     _specification
      {
        from: _contestant2,
      }
    );
    await registry.createSubmission(
      _competitionId,     // uint       _competitionId
      _specification,     // string     _specification
      {
        from: _contestant3,
      }
    );
  }
  const validSubmissionsAcceptance = async (registry) => {
    await registry.acceptSubmission(
      _competitionId,     // uint       _competitionId
      _submission1,       // uint       _submissionId
      {
        from: _host,
      }
    );
    await registry.acceptSubmission(
      _competitionId,     // uint       _competitionId
      _submission2,       // uint       _submissionId
      {
        from: _host,
      }
    );
    await registry.acceptSubmission(
      _competitionId,     // uint       _competitionId
      _submission3,       // uint       _submissionId
      {
        from: _host,
      }
    );
  }
  const validSubmissionsScoring = async (registry) => {
    for (i = 0; i < 3; i++) {
      await registry.scoreSubmission(
        _competitionId,     // uint       _competitionId
        _submission1,       // uint       _submissionId
        {
          from: _judges[i],
        }
      );
    }
    for (i = 0; i < 3; i++) {
      await registry.scoreSubmission(
        _competitionId,     // uint       _competitionId
        _submission2,       // uint       _submissionId
        {
          from: _judges[i],
        }
      );
    }
    for (i = 0; i < 3; i++) {
      await registry.scoreSubmission(
        _competitionId,     // uint       _competitionId
        _submission3,       // uint       _submissionId
        {
          from: _judges[i],
        }
      );
    }
  }

  // verifies constructor() works
  it('verifies constructor() works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    const owner = await registry.owner();
    assert(
      owner === accounts[0],
      'expected ' + owner + ' to equal ' + accounts[0],
    );
  });

  // verifies createCompetition() works
  it('verifies createCompetition() works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    const competition = await registry.getCompetition(0);
    const host = competition[0]
    const deadline = competition[1].toNumber();
    const specification = competition[2]
    const judges = await registry.getCompetitionJudges(0);
    const prizes = await registry.getCompetitionPrizes(0);
    assert(
      host === _host,
      'expected ' + host + ' to equal ' + _host,
    );
    assert(
      deadline === _deadline,
      'expected ' + deadline + ' to equal ' + _deadline,
    );
    assert(
      specification === _specification,
      'expected ' + specification + ' to equal ' + _specification,
    );
    assert(
      judges.join() === _judges.join(),
      'expected ' + judges + ' to equal ' + _judges,
    );
    assert(
      prizes.join() === _prizes.join(),
      'expected ' + prizes + ' to equal ' + _prizes,
    );
  });

  // verifies createCompetition() fails when parameter "host" is invalid
  it('verifies createCompetition() fails when parameter "host" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    try {
      await registry.createCompetition(
        0x0,              // address    _host
        _deadline,        // uint       _deadline
        _specification,   // string     _specification
        _judges,          // address[]  _judges
        _prizes,          // uint[]     _prizes
        _token,           // address    _token
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies createCompetition() fails when parameter "deadline" is invalid
  it('verifies createCompetition() fails when parameter "deadline" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    try {
      await registry.createCompetition(
        _host,            // address    _host
        0000000000,       // uint       _deadline
        _specification,   // string     _specification
        _judges,          // address[]  _judges
        _prizes,          // uint[]     _prizes
        _token,           // address    _token
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies createCompetition() fails when parameter "specification" is invalid
  it('verifies createCompetition() fails when parameter "specification" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    try {
      await registry.createCompetition(
        _host,            // address    _host
        _deadline,        // uint       _deadline
        '',               // string     _specification
        _judges,          // address[]  _judges
        _prizes,          // uint[]     _prizes
        _token,           // address    _token
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies updateCompetitionHost() works
  it('verifies updateCompetitionHost() works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionHostUpdate(registry);
    const competition = await registry.getCompetition(0);
    const host = competition[0];
    assert(
      host === newHost,
      'expected ' + host + ' to equal ' + newHost,
    );
  });

  // verifies updateCompetitionHost() fails when not competition host
  it('verifies updateCompetitionHost() fails when not competition host', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionHost(
        _competitionId,   // uint       _competitionId
        newHost,          // address    _host
        {
          from: accounts[1],
        },
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionHost() to throw error');
  });

  // verifies updateCompetitionHost() fails when parameter "competitionId" is invalid
  it('verifies updateCompetitionHost() fails when parameter "competitionId" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionHost(
        1,                // uint       _competitionId
        newHost,          // address    _host
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionHost() to throw error');
  });

  // verifies updateCompetitionHost() fails when parameter "host" is invalid
  it('verifies updateCompetitionHost() fails when parameter "host" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionHost(
        _competitionId,   // uint       _competitionId
        0x0,              // address    _host
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionHost() to throw error');
  });

  // verifies updateCompetitionHost() fails when competition is active
  it('verifies updateCompetitionHost() fails when competition is active', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    await validCompetitionActivation(registry);
    try {
      await validCompetitionHostUpdate(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionHost() to throw error');
  });

  // verifies updateCompetitionDeadline() works
  it('verifies updateCompetitionDeadline() works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionDeadlineUpdate(registry);
    const competition = await registry.getCompetition(0);
    const deadline = competition[1].toNumber();
    assert(
      deadline === newDeadline,
      'expected ' + deadline + ' to equal ' + newDeadline,
    );
  });

  // verifies updateCompetitionDeadline() fails when not competition host
  it('verifies updateCompetitionDeadline() fails when not competition host', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionDeadline(
        _competitionId,   // uint       _competitionId
        newDeadline,      // uint       _deadline
        {
          from: accounts[1],
        },
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionDeadline() to throw error');
  });

  // verifies updateCompetitionDeadline() fails when parameter "competitionId" is invalid
  it('verifies updateCompetitionDeadline() fails when parameter "competitionId" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionDeadline(
        1,                // uint       _competitionId
        newDeadline,      // uint       _deadline
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionDeadline() to throw error');
  });

  // verifies updateCompetitionDeadline() fails when parameter "deadline" is invalid
  it('verifies updateCompetitionDeadline() fails when parameter "deadline" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionDeadline(
        _competitionId,   // uint       _competitionId
        0000000000        // uint       _deadline
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionDeadline() to throw error');
  });

  // verifies updateCompetitionDeadline() fails when competition is active
  it('verifies updateCompetitionDeadline() fails when competition is active', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    await validCompetitionActivation(registry);
    try {
      await validCompetitionDeadlineUpdate(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionDeadline() to throw error');
  });

  // verifies updateCompetitionSpecification() works
  it('verifies updateCompetitionSpecification() works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionSpecificationUpdate(registry);
    const competition = await registry.getCompetition(0);
    const specification = competition[2];
    assert(
      specification === newSpecification,
      'expected ' + specification + ' to equal ' + newSpecification,
    );
  });

  // verifies updateCompetitionSpecification() fails when not competition host
  it('verifies updateCompetitionSpecification() fails when not competition host', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionSpecification(
        _competitionId,   // uint       _competitionId
        newSpecification, // string     _specification
        {
          from: accounts[1],
        },
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionSpecification() to throw error');
  });

  // verifies updateCompetitionSpecification() fails when parameter "competitionId" is invalid
  it('verifies updateCompetitionSpecification() fails when parameter "competitionId" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionSpecification(
        1,                // uint       _competitionId
        newSpecification, // string     _specification
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionSpecification() to throw error');
  });

  // verifies updateCompetitionSpecification() fails when parameter "specification" is invalid
  it('verifies updateCompetitionSpecification() fails when parameter "specification" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionSpecification(
        _competitionId,   // uint       _competitionId
        '',               // string     _specification
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionSpecification() to throw error');
  });

  // verifies updateCompetitionSpecification() fails when competition is active
  it('verifies updateCompetitionSpecification() fails when competition is active', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    await validCompetitionActivation(registry);
    try {
      await validCompetitionSpecificationUpdate(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionSpecification() to throw error');
  });

  // verifies updateCompetitionJudges() works
  it('verifies updateCompetitionJudges() works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionJudgesUpdate(registry);
    const judges = await registry.getCompetitionJudges(0);
    assert(
      judges.join() === newJudges.join(),
      'expected ' + judges + ' to equal ' + newJudges,
    );
  });

  // verifies updateCompetitionJudges() fails when not competition host
  it('verifies updateCompetitionJudges() fails when not competition host', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionJudges(
        _competitionId,   // uint       _competitionId
        newJudges,        // address[]  _judges
        {
          from: accounts[1],
        },
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionJudges() to throw error');
  });

  // verifies updateCompetitionJudges() fails when parameter "competitionId" is invalid
  it('verifies updateCompetitionJudges() fails when parameter "competitionId" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionJudges(
        1,                // uint       _competitionId
        newJudges,        // address[]  _judges
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionJudges() to throw error');
  });

  // verifies updateCompetitionJudges() fails when parameter "judges" is invalid
  it('verifies updateCompetitionJudges() fails when parameter "judges" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionJudges(
        _competitionId,   // uint       _competitionId
        [],               // address[]  _judges
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionJudges() to throw error');
  });

  // verifies updateCompetitionJudges() fails when competition is active
  it('verifies updateCompetitionJudges() fails when competition is active', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    await validCompetitionActivation(registry);
    try {
      await validCompetitionJudgesUpdate(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionJudges() to throw error');
  });

  // verifies updateCompetitionPrizes() works
  it('verifies updateCompetitionPrizes() works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionPrizesUpdate(registry);
    const prizes = await registry.getCompetitionPrizes(0);
    assert(
      prizes.join() === newPrizes.join(),
      'expected ' + prizes + ' to equal ' + newPrizes,
    );
  });

  // verifies updateCompetitionPrizes() fails when not competition host
  it('verifies updateCompetitionPrizes() fails when not competition host', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionPrizes(
        _competitionId,   // uint       _competitionId
        newPrizes,        // address[]  _judges
        {
          from: accounts[1],
        },
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionPrizes() to throw error');
  });

  // verifies updateCompetitionPrizes() fails when parameter "competitionId" is invalid
  it('verifies updateCompetitionPrizes() fails when parameter "competitionId" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionPrizes(
        1,                // uint       _competitionId
        newPrizes,        // address[]  _judges
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionPrizes() to throw error');
  });

  // verifies updateCompetitionPrizes() fails when parameter "prizes" is invalid
  it('verifies updateCompetitionPrizes() fails when parameter "prizes" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionPrizes(
        _competitionId,   // uint       _competitionId
        [],               // address[]  _judges
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionPrizes() to throw error');
  });

  // verifies updateCompetitionPrizes() fails when competition is active
  it('verifies updateCompetitionPrizes() fails when competition is active', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    await validCompetitionActivation(registry);
    try {
      await validCompetitionPrizesUpdate(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionPrizes() to throw error');
  });

  // verifies updateCompetitionToken() works
  it('verifies updateCompetitionToken() works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    const exampleToken = await generateExampleToken();
    await validCompetitionTokenUpdate(registry, exampleToken.address);
    const competition = await registry.getCompetition(0);
    const hasToken = competition[6];
    const token = await registry.getCompetitionToken(0);
    assert(
      hasToken,
      'expected ' + competition.hasToken + ' to equal ' + true,
    );
    assert(
      token === exampleToken.address,
      'expected ' + token + ' to equal ' + exampleToken.address,
    );
  });

  // verifies updateCompetitionToken() fails when not competition host
  it('verifies updateCompetitionToken() fails when not competition host', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    const exampleToken = await generateExampleToken();
    try {
      await registry.updateCompetitionToken(
        _competitionId,         // uint       _competitionId
        exampleToken.address,   // address    _token
        {
          from: accounts[1],
        },
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionToken() to throw error');
  });

  // verifies updateCompetitionToken() fails when parameter "competitionId" is invalid
  it('verifies updateCompetitionToken() fails when parameter "competitionId" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    const exampleToken = await generateExampleToken();
    try {
      await registry.updateCompetitionToken(
        1,                      // uint       _competitionId
        exampleToken.address,   // address    _token
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionToken() to throw error');
  });

  // verifies updateCompetitionToken() fails when parameter "token" is invalid
  it('verifies updateCompetitionToken() fails when parameter "token" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await registry.updateCompetitionToken(
        _competitionId,   // uint       _competitionId
        0x0,              // address    _token
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionToken() to throw error');
  });

  // verifies updateCompetitionToken() fails when competition is active
  it('verifies updateCompetitionToken() fails when competition is active', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    await validCompetitionActivation(registry);
    try {
      const exampleToken = await generateExampleToken();
      await validCompetitionTokenUpdate(registry, exampleToken.address);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected updateCompetitionToken() to throw error');
  });

  // verifies transferToCompetition() with ETH works
  it('verifies transferToCompetition() with ETH works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    const competition = await registry.getCompetition(0);
    const rewardsPot = competition[4].toNumber()
    assert(
      rewardsPot === _amount,
      'expected ' + rewardsPot + ' to equal ' + _amount,
    );
  });

  // verifies transferToCompetition() with ETH fails when "amount" is invalid
  it('verifies transferToCompetition() with ETH fails when "amount" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    try {
      await validCompetitionCreation(registry);
      await registry.transferToCompetition(
        _competitionId,   // uint       _competitionId
        0,                // uint       _amount
        {
          from: accounts[0],
          value: _amount,
        },
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies transferToCompetition() with TKN works
  it('verifies transferToCompetition() with TKN works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    const exampleToken = await generateExampleToken();
    await exampleToken.transfer(accounts[0], _amount);
    await exampleToken.approve(registry.address, _amount);
    await validCompetitionTokenUpdate(registry, exampleToken.address);
    await registry.transferToCompetition(
      _competitionId,   // uint       _competitionId
      _amount,          // uint       _amount
      {
        from: accounts[0],
        value: 0,
      },
    );
    const competition = await registry.getCompetition(0);
    const rewardsPot = competition[4].toNumber()
    assert(
      rewardsPot === _amount,
      'expected ' + rewardsPot + ' to equal ' + _amount,
    );
  });

  // verifies transferToCompetition() with TKN fails when "amount" is invalid
  it('verifies transferToCompetition() with TKN fails when "amount" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    const exampleToken = await generateExampleToken();
    await validCompetitionTokenUpdate(registry, exampleToken.address);
    try {
      await validCompetitionCreation(registry);
      await registry.transferToCompetition(
        _competitionId,   // uint       _competitionId
        0,                // uint       _amount
        {
          from: accounts[0],
          value: 0,
        },
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies transferToCompetition() with TKN fails when ETH is attached
  it('verifies transferToCompetition() with TKN fails when ETH is attached', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    const exampleToken = await generateExampleToken();
    await exampleToken.transfer(accounts[0], _amount);
    await exampleToken.approve(registry.address, _amount);
    await validCompetitionTokenUpdate(registry, exampleToken.address);
    try {
      await validCompetitionCreation(registry);
      await registry.transferToCompetition(
        _competitionId,   // uint       _competitionId
        _amount,          // uint       _amount
        {
          from: accounts[0],
          value: _amount,
        },
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies activateCompetition() works
  it('verifies activateCompetition() works', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    await validCompetitionActivation(registry);
    const competition = await registry.getCompetition(0);
    const stage = competition[3].toNumber()
    assert(
      stage === Active,
      'expected ' + stage + ' to equal ' + Active,
    );
  });

  // verifies activateCompetition() fails when parameter "competitionId" is invalid
  it('verifies activateCompetition() fails when parameter "competitionId" is invalid', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    try {
      await registry.activateCompetition(
        1,                  // uint     _competitionId
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies activateCompetition() fails when not competition host
  it('verifies activateCompetition() fails when not competition host', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    try {
      await registry.activateCompetition(
        _competitionId,     // uint     _competitionId
        {
          from: accounts[1],
        },
      );
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies activateCompetition() fails when competition deadline has past
  it('verifies activateCompetition() fails when competition deadline has past', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    const nearFuture = Math.floor(Date.now() / 1000) + 1
    await registry.createCompetition(
      _host,              // address    _host
      nearFuture,         // uint       _deadline
      _specification,     // string     _specification
      _judges,            // address[]  _judges
      _prizes,            // uint[]     _prizes
      _token,             // address    _token
    );
    await validCompetitionTransfer(registry);
    await new Promise(resolve => setTimeout(resolve, 1000))
    try {
      await validCompetitionActivation(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies activateCompetition() fails when competition judges is empty
  it('verifies activateCompetition() fails when competition judges is empty', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await registry.createCompetition(
      _host,              // address    _host
      _deadline,          // uint       _deadline
      _specification,     // string     _specification
      [],                 // address[]  _judges
      _prizes,            // uint[]     _prizes
      _token,             // address    _token
    );
    await validCompetitionTransfer(registry);
    try {
      await validCompetitionActivation(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies activateCompetition() fails when competition prizes is empty
  it('verifies activateCompetition() fails when competition prizes is empty', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await registry.createCompetition(
      _host,              // address    _host
      _deadline,          // uint       _deadline
      _specification,     // string     _specification
      _judges,            // address[]  _judges
      [],                 // uint[]     _prizes
      _token,             // address    _token
    );
    await validCompetitionTransfer(registry);
    try {
      await validCompetitionActivation(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies activateCompetition() fails when competition prizes are not payable
  it('verifies activateCompetition() fails when competition prizes are not payable', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    try {
      await validCompetitionActivation(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies activateCompetition() fails when competition is not active
  it('verifies activateCompetition() fails when competition is not active', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    await validCompetitionActivation(registry);
    try {
      await validCompetitionActivation(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies activateCompetition() fails when competition is not completed
  it('verifies activateCompetition() fails when competition is not completed', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    await validCompetitionActivation(registry);
    await validSubmissionsCreation(registry);
    await validSubmissionsAcceptance(registry);
    await validSubmissionsScoring(registry);
    await validCompetitionCompletion(registry);
    try {
      await validCompetitionActivation(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies activateCompetition() fails when competition is not cancelled
  it('verifies activateCompetition() fails when competition is not cancelled', async () => {
    const registry = await StandardCompetitions.new(accounts[0]);
    await validCompetitionCreation(registry);
    await validCompetitionTransfer(registry);
    await validCompetitionCancellation(registry);
    try {
      await validCompetitionActivation(registry);
    } catch (error) {
      return utils.ensureException(error);
    }
    assert(false, 'expected createCompetition() to throw error');
  });

  // verifies cancelCompetition()

  // verifies createSubmission()

  // verifies acceptSubmission()

});
