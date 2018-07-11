pragma solidity ^0.4.23;

import './StandardTokenExtended.sol';

// @title StandardCompetitions
// @dev Used to manage open source software competitions through the
// following steps: submission, acceptance, voting, and distribution
// @author Ryan Christoffersen <ryan@ryanchristo.com>

// StandardCompetitions is inspired by StandardBounties
// (https://github.com/Bounties-Network/StandardBounties)

contract StandardCompetitions {

  // Storage

  address public owner;

  Competition[] public competitions;

  // mapping competition id mapping address to judge
  mapping(uint => mapping (address => bool)) judge;

  // mapping competition id to submissions
  mapping(uint => Submission[]) submissions;

  // mapping competition id to submissions
  mapping(uint => Submission[]) rankedSubmissions;

  // mapping competition id to token contracts
  mapping(uint => StandardTokenExtended) tokens;

  // Structs

  struct Competition {
    address host;
    uint deadline;
    string specification;
    Stages stage;
    address[] judges;
    uint[] prizes;
    uint prizesPot;
    uint prizesTotal;
    bool hasToken;
  }

  struct Submission {
    bool accepted;
    address contestor;
    string specification;
    address[] judges;
    uint totalPoints;
  }

  // Enums

  enum Stages {
    Draft,
    Active,
    Completed,
    Cancelled
  }

  // Events

  event CompetitionActivated(
    uint competitionId,
    address indexed host
  );

  event CompetitionCancelled(
    uint competitionId,
    address indexed host
  );

  event CompetitionCompleted(
    uint competitionId,
    address indexed host
  );

  event CompetitionCreated(
    uint competitionId,
    address indexed host
  );

  event CompetitionHostUpdated(
    uint competitionId,
    address indexed newHost
  );

  event CompetitionJudgesUpdated(
    uint competitionId,
    address indexed host,
    address[] judges
  );

  event CompetitionPrizesDistributed(
    uint competitionId,
    address indexed host,
    uint[] prizes
  );

  event CompetitionPrizesUpdated(
    uint competitionId,
    address indexed host,
    uint[] prizes
  );

  event CompetitionPrizesPotUpdated(
    uint competitionId,
    address indexed sender,
    uint prizesPot
  );

  event CompetitionTokenUpdated(
    uint competitionId,
    address indexed host,
    address indexed token
  );

  event CompetitionUpdated(
    uint competitionId,
    address indexed host
  );

  event SubmissionAccepted(
    uint competitionId,
    address indexed contestor,
    uint indexed submissionId
  );

  event SubmissionAdded(
    uint competitionId,
    address indexed contestor,
    uint indexed submissionId
  );

  event SubmissionsRanked(
    uint competitionId,
    address indexed host
  );

  event SubmissionScored(
    uint competitionId,
    address indexed judge,
    uint indexed submissionId
  );

  event SubmissionUpdated(
    uint competitionId,
    address indexed contestor,
    uint indexed submissionId
  );

  // Modifiers

  // require message sender is submission contestor
  modifier onlyContestor(uint _competitionId, uint _submissionId) {
    require(msg.sender == submissions[_competitionId][_submissionId].contestor);
    _;
  }

  // require message sender is competition host
  modifier onlyHost(uint _competitionId) {
    require(msg.sender == competitions[_competitionId].host);
    _;
  }

  // require message sender is competition judge
  modifier onlyJudge(uint _competitionId) {
    require(judge[_competitionId][msg.sender]);
    _;
  }

  // require now is before competition deadline
  modifier validateBeforeDeadline(uint _competitionId) {
    require(now < competitions[_competitionId].deadline);
    _;
  }

  // require competition id is valid competition id
  modifier validateCompetition(uint _competitionId) {
    require(_competitionId < competitions.length);
    _;
  }

  // require contestor is not competition host or judge
  modifier validateContestor(uint _competitionId) {
    require(
      msg.sender != competitions[_competitionId].host &&
      judge[_competitionId][msg.sender] == false
    );
    _;
  }

  // require competition deadline is after now
  modifier validateDeadline(uint _competitionId) {
    require(competitions[_competitionId].deadline > now);
    _;
  }

  // require competition judges is greater than zero
  modifier validateJudgesLength(uint _competitionId) {
    require(competitions[_competitionId].judges.length > 0);
    _;
  }

  // require competition is draft or has no submissions
  modifier validateCancellable(uint _competitionId) {
    require(
      competitions[_competitionId].stage == Stages.Draft ||
      submissions[_competitionId].length == 0
    );
    _;
  }

  // require amount parameter is not zero
  modifier validateParameterAmount(uint _amount) {
    require(_amount != 0);
    _;
  }

  // require deadline parameter is greater than now
  modifier validateParameterDeadline(uint _deadline) {
    require(_deadline > now);
    _;
  }

  // require host parameter is not zero equivelant
  modifier validateParameterHost(address _host) {
    require(_host != 0);
    _;
  }

  // require judges parameter is greater than zero
  modifier validateParameterJudges(address[] _judges) {
    require(_judges.length > 0);
    _;
  }

  // require prizes parameter is greater than zero
  modifier validateParameterPrizes(uint[] _prizes) {
    require(_prizes.length > 0);
    _;
  }

  // require specification parameter is not empty string
  modifier validateParameterSpecification(string _specification) {
    require(bytes(_specification).length > 0);
    _;
  }

  // require token parameter is not zero equivelant
  modifier validateParameterToken(address _token) {
    require(_token != 0);
    _;
  }

  // require competition prizes is greater than zero
  modifier validatePrizesLength(uint _competitionId) {
    require(competitions[_competitionId].prizes.length > 0);
    _;
  }

  // require prizes pot is greater than or equal to prizes total
  modifier validatePrizesPayable(uint _competitionId) {
    require(
      competitions[_competitionId].prizesPot >=
      competitions[_competitionId].prizesTotal
    );
    _;
  }

  // require competition is at given stage
  modifier validateStage(uint _competitionId, Stages _stage) {
    require(competitions[_competitionId].stage == _stage);
    _;
  }

  // require competition is not at given stage
  modifier validateStageIsNot(uint _competitionId, Stages _stage) {
    require(competitions[_competitionId].stage != _stage);
    _;
  }

  // require submission id is valid submission id
  modifier validateSubmission(uint _competitionId, uint _submissionId) {
    require(_submissionId < submissions[_competitionId].length);
    _;
  }

  // require submission has not already been accepted
  modifier validateSubmissionNotAccepted(uint _competitionId, uint _submissionId) {
    require(submissions[_competitionId][_submissionId].accepted == false);
    _;
  }

  // require submission has not already been accepted
  modifier validateSubmissionAccepted(uint _competitionId, uint _submissionId) {
    require(submissions[_competitionId][_submissionId].accepted == false);
    _;
  }

  // require submissions ordered by total points
  modifier validateSubmissionsRanked(uint _competitionId) {

    // TODO verify submissions ordered by total points

    require(true);
    _;
  }

  // Public Functions

  constructor(address _owner) public {
    owner = _owner;
  }

  // @dev createCompetition(): creates a competition
  // @param _host the address of the competition host
  // @param _deadline a unix timestamp representing the competition deadline
  // @param _specification the competition specification
  function createCompetition(
    address _host,
    uint _deadline,
    string _specification,
    address[] _judges,
    uint[] _prizes,
    address _token
  )
    public
    validateParameterHost(_host)
    validateParameterDeadline(_deadline)
    validateParameterSpecification(_specification)
  {
    competitions.push(Competition(
      _host,            // address    host
      _deadline,        // uint       deadline
      _specification,   // string     specification
      Stages.Draft,     // Stages     stage
      _judges,          // address[]  judges
      _prizes,          // uint[]     prizes
      0,                // uint       prizesPot
      0,                // uint       prizesTotal
      false             // bool       hasToken
    ));
    if (_judges.length > 0) {
      updateCompetitionJudges(competitions.length - 1, _judges);
    }
    if (_prizes.length > 0) {
      updateCompetitionPrizes(competitions.length - 1, _prizes);
    }
    if (_token != 0) {
      updateCompetitionToken(competitions.length - 1, _token);
    }
    emit CompetitionCreated(competitions.length - 1, _host);
  }

  // @dev updateCompetitionHost(): updates the competition host
  // @param _competitionId the id of the competition
  // @param _host the address of the competition host
  function updateCompetitionHost(uint _competitionId, address _host)
    public
    onlyHost(_competitionId)
    validateCompetition(_competitionId)
    validateParameterHost(_host)
    validateStage(_competitionId, Stages.Draft)
  {
    competitions[_competitionId].host = _host;
    emit CompetitionHostUpdated(_competitionId, _host);
  }

  // @dev updateCompetitionDeadline(): updates the competition deadline
  // @param _competitionId the id of the competition
  // @param _deadline a unix timestamp representing the competition deadline
  function updateCompetitionDeadline(uint _competitionId, uint _deadline)
    public
    onlyHost(_competitionId)
    validateCompetition(_competitionId)
    validateParameterDeadline(_deadline)
    validateStage(_competitionId, Stages.Draft)
  {
    competitions[_competitionId].deadline = _deadline;
    emit CompetitionUpdated(_competitionId, msg.sender);
  }

  // @dev updateCompetitionSpecification(): updates the competition specification
  // @param _competitionId the id of the competition
  // @param _specification the competition specification
  function updateCompetitionSpecification(
    uint _competitionId,
    string _specification
  )
    public
    onlyHost(_competitionId)
    validateCompetition(_competitionId)
    validateParameterSpecification(_specification)
    validateStage(_competitionId, Stages.Draft)
  {
    competitions[_competitionId].specification = _specification;
    emit CompetitionUpdated(_competitionId, msg.sender);
  }

  // @dev updateCompetitionJudges(): updates the competition judges
  // @param _competitionId the id of the competition
  // @param _judges an array of addresses representing the competition judges
  function updateCompetitionJudges(uint _competitionId, address[] _judges)
    public
    onlyHost(_competitionId)
    validateCompetition(_competitionId)
    validateParameterJudges(_judges)
    validateStage(_competitionId, Stages.Draft)
  {
    competitions[_competitionId].judges = _judges;
    for (uint i = 0; i < _judges.length; i++) {
      judge[_competitionId][_judges[i]] = true;
    }
    emit CompetitionJudgesUpdated(_competitionId, msg.sender, _judges);
  }

  // @dev updateCompetitionPrizes(): updates the competition prizes
  // @param _competitionId the id of the competition
  // @param _prizes an array of amounts representing the competition prizes
  function updateCompetitionPrizes(uint _competitionId, uint[] _prizes)
    public
    onlyHost(_competitionId)
    validateCompetition(_competitionId)
    validateParameterPrizes(_prizes)
    validateStage(_competitionId, Stages.Draft)
  {
    competitions[_competitionId].prizes = _prizes;
    for (uint i = 0; i < _prizes.length; i++) {
      competitions[_competitionId].prizesTotal += _prizes[i];
    }
    emit CompetitionPrizesUpdated(_competitionId, msg.sender, _prizes);
  }

  // @dev updateCompetitionToken(): updates the token
  // @param _competitionId the id of the competition
  // @param _tokenAddress the address of the token
  function updateCompetitionToken(uint _competitionId, address _tokenAddress)
    public
    onlyHost(_competitionId)
    validateCompetition(_competitionId)
    validateParameterToken(_tokenAddress)
    validateStage(_competitionId, Stages.Draft)
  {
    if (competitions[_competitionId].prizesPot > 0) {
      transferFromCompetition(_competitionId);
    }
    if (competitions[_competitionId].hasToken == false) {
      competitions[_competitionId].hasToken = true;
    }
    tokens[_competitionId] = StandardTokenExtended(_tokenAddress);
    emit CompetitionTokenUpdated(_competitionId, msg.sender, _tokenAddress);
  }

  // @dev transferToCompetition(): transfers the amount
  // @param _competitionId the id of the competition
  // @param _amount a value in wei representing the transfer amount
  function transferToCompetition(uint _competitionId, uint _amount)
    public
    payable
    validateCompetition(_competitionId)
    validateParameterAmount(_amount)
  {
    if (competitions[_competitionId].hasToken) {
      require(msg.value == 0);
      require(tokens[_competitionId].transferFrom(msg.sender, this, _amount));
    } else {
      require((_amount * 1 wei) == msg.value);
    }
    competitions[_competitionId].prizesPot += _amount;
    emit CompetitionPrizesPotUpdated(
      _competitionId, msg.sender, competitions[_competitionId].prizesPot
    );
  }

  // @dev activateCompetition(): activates the competition
  // @param _competitionId the id of the competition
  function activateCompetition(uint _competitionId)
    public
    payable
    validateCompetition(_competitionId)
    onlyHost(_competitionId)
    validateBeforeDeadline(_competitionId)
    validateJudgesLength(_competitionId)
    validatePrizesLength(_competitionId)
    validatePrizesPayable(_competitionId)
    validateStageIsNot(_competitionId, Stages.Active)
    validateStageIsNot(_competitionId, Stages.Completed)
    validateStageIsNot(_competitionId, Stages.Cancelled)
  {
    updateCompetitionStage(_competitionId, Stages.Active);
    emit CompetitionActivated(_competitionId, msg.sender);
  }

  // @dev cancelCompetition(): cancels the competition
  // @param _competitionId the id of the competition
  function cancelCompetition(uint _competitionId)
    public
    validateCompetition(_competitionId)
    onlyHost(_competitionId)
    validateCancellable(_competitionId)
  {
    updateCompetitionStage(_competitionId, Stages.Cancelled);
    if (competitions[_competitionId].prizesPot > 0) {
      transferFromCompetition(_competitionId);
    }
    emit CompetitionCancelled(_competitionId, msg.sender);
  }

  // @dev getCompetition(): returns the competition
  // @param _competitionId the id of the competition
  function getCompetition(uint _competitionId)
    public
    constant
    validateCompetition(_competitionId)
    returns (
      address,    // host
      uint,       // deadline
      string,     // specification
      Stages,     // stage
      uint,       // prizesPot
      uint,       // prizesTotal
      bool        // hasToken
    )
  {
    return (
      competitions[_competitionId].host,
      competitions[_competitionId].deadline,
      competitions[_competitionId].specification,
      competitions[_competitionId].stage,
      competitions[_competitionId].prizesPot,
      competitions[_competitionId].prizesTotal,
      competitions[_competitionId].hasToken
    );
  }

  // @dev getCompetitionJudges(): returns the competition judges
  // @param _competitionId the id of the competition
  function getCompetitionJudges(uint _competitionId)
    public
    constant
    validateCompetition(_competitionId)
    returns (address[])
  {
    return (competitions[_competitionId].judges);
  }

  // @dev getCompetitionPrizes(): returns the competition prizes
  // @param _competitionId the id of the competition
  function getCompetitionPrizes(uint _competitionId)
    public
    constant
    validateCompetition(_competitionId)
    returns (uint[])
  {
    return (competitions[_competitionId].prizes);
  }

  // @dev getCompetitionToken(): returns the competition token
  // @param _competitionId the id of the competition
  function getCompetitionToken(uint _competitionId)
    public
    constant
    validateCompetition(_competitionId)
    returns (StandardTokenExtended)
  {
    return (tokens[_competitionId]);
  }

  // @dev getCompetitionsCount(): return the number of competitions
  function getCompetitionsCount()
    public
    constant
    returns (uint)
  {
    return competitions.length;
  }

  // @dev createSubmission(): creates a submission
  // @param _competitionId the id of the competition
  // @param _specification the submission specification
  function createSubmission(uint _competitionId, string _specification)
    public
    validateCompetition(_competitionId)
    validateBeforeDeadline(_competitionId)
    validateStage(_competitionId, Stages.Active)
    validateContestor(_competitionId)
  {
    address[] memory judges;
    submissions[_competitionId].push(Submission(
      false,            // bool       accepted
      msg.sender,       // address    contestor
      _specification,   // string     specification
      judges,           // address[]  judges
      0                 // uint       totalPoints
    ));
    emit SubmissionAdded(
      _competitionId,
      msg.sender,
      (submissions[_competitionId].length - 1)
    );
  }

  // @dev updateSubmissionSpecification(): updates the submission specification
  // @param _competitionId the id of the competition
  // @param _submissionId the id of the submission
  // @param _specification the updated specification
  function updateSubmissionSpecification(
    uint _competitionId,
    uint _submissionId,
    string _specification
  )
    public
    validateCompetition(_competitionId)
    validateSubmission(_competitionId, _submissionId)
    onlyContestor(_competitionId, _submissionId)
    validateSubmissionNotAccepted(_competitionId, _submissionId)
  {
    submissions[_competitionId][_submissionId].specification = _specification;
    emit SubmissionUpdated(_competitionId, msg.sender, _submissionId);
  }

  // @dev acceptSubmission(): accepts the submission
  // @param _competitionId the id of the competition
  // @param _submissionId the id of the submission
  function acceptSubmission(uint _competitionId, uint _submissionId)
    public
    validateCompetition(_competitionId)
    onlyHost(_competitionId)
    validateStage(_competitionId, Stages.Active)
    validateSubmission(_competitionId, _submissionId)
    validateSubmissionNotAccepted(_competitionId, _submissionId)
  {
    submissions[_competitionId][_submissionId].accepted = true;
    emit SubmissionAccepted(_competitionId, msg.sender, _submissionId);
  }

  // @dev scoreSubmission(): scores the submission
  // @param _competitionId the id of the competition
  // @param _submissionId the id of the submission
  function scoreSubmission(uint _competitionId, uint _submissionId, uint _score)
    public
    validateCompetition(_competitionId)
    onlyJudge(_competitionId)
    validateStage(_competitionId, Stages.Active)
    validateSubmission(_competitionId, _submissionId)
    validateSubmissionAccepted(_competitionId, _submissionId)
  {
    submissions[_competitionId][_submissionId].totalPoints += _score;
    submissions[_competitionId][_submissionId].judges.push(msg.sender);
    emit SubmissionScored(_competitionId, msg.sender, _submissionId);
  }

  // @dev getSubmissionsCount(): returns the number of submissions
  // @param _competitionId the id of the competition
  function getSubmissionsCount(uint _competitionId)
    public
    constant
    validateCompetition(_competitionId)
    returns (uint)
  {
    return submissions[_competitionId].length;
  }

  // @dev completeCompetition(): completes competition
  // @param _competitionId the id of the competition
  function completeCompetition(uint _competitionId)
    public
    validateCompetition(_competitionId)
    onlyHost(_competitionId)
    validateSubmissionsRanked(_competitionId)
    validateStage(_competitionId, Stages.Active)
  {
    submissions[_competitionId] = rankedSubmissions[_competitionId];
    rankSubmissions(_competitionId);
    distributePrizes(_competitionId);
    updateCompetitionStage(_competitionId, Stages.Completed);
    emit CompetitionCompleted(_competitionId, msg.sender);
  }

  // Internal functions

  // @dev updateCompetitionStage(): update competition stage
  // @param _competitionId the id of the competition
  // @param _Stage the updated stage for the competition
  function updateCompetitionStage(uint _competitionId, Stages _Stage)
    internal
  {
    competitions[_competitionId].stage = _Stage;
  }

  // @dev transferFromCompetition(): withdraws from competition
  // @param _competitionId the id of the competition
  function transferFromCompetition(uint _competitionId)
    internal
  {
    if (competitions[_competitionId].hasToken) {
      tokens[_competitionId].transfer(
        competitions[_competitionId].host,
        competitions[_competitionId].prizesPot
      );
      competitions[_competitionId].prizesPot = 0;
    } else {
      address(this).transfer(
        competitions[_competitionId].prizesPot
      );
      competitions[_competitionId].prizesPot = 0;
    }
    emit CompetitionPrizesPotUpdated(
      _competitionId,
      msg.sender,
      competitions[_competitionId].prizesPot
    );
  }

  // @dev rankSubmissions(): sort submissions by total points
  // @param _competitionId the id of the competition
  // @returns contestants ranked by total points of submissions
  function rankSubmissions(uint _competitionId)
    internal
  {
    uint i = 0;
    uint j = rankedSubmissions[_competitionId].length;
    uint pivot = rankedSubmissions[_competitionId][0 + (rankedSubmissions[_competitionId].length - 0) / 2].totalPoints;
    while (i <= j) {
      while (rankedSubmissions[_competitionId][i].totalPoints < pivot) i++;
      while (pivot < rankedSubmissions[_competitionId][j].totalPoints) j--;
      if (i <= j) {
        (
          rankedSubmissions[_competitionId][i].totalPoints,
          rankedSubmissions[_competitionId][j].totalPoints
        ) = (
          rankedSubmissions[_competitionId][j].totalPoints,
          rankedSubmissions[_competitionId][i].totalPoints
        );
        i++;
        j--;
      }
    }
    if (0 < j) {
      rankSubmissions(_competitionId);
    }
    if (i < rankedSubmissions[_competitionId].length) {
      rankSubmissions(_competitionId);
    }
    emit SubmissionsRanked(_competitionId, competitions[_competitionId].host);
  }

  // @dev distributePrizes(): distributes prizes
  // @param _competitionId the id of the competition
  // @param _competitionId an array of ranked contestants
  function distributePrizes(uint _competitionId)
    internal
  {
    if (competitions[_competitionId].hasToken) {
      for (uint i = 0; i < competitions[_competitionId].prizes.length; i++) {
        tokens[_competitionId].transferFrom(
          rankedSubmissions[_competitionId][i].contestor,
          this,
          competitions[_competitionId].prizes[i]
        );
        competitions[_competitionId].prizesPot -= competitions[_competitionId].prizes[i];
      }
    } else {

      // make claimable

    }
    emit CompetitionPrizesDistributed(
      _competitionId,
      msg.sender,
      competitions[_competitionId].prizes
    );
    emit CompetitionPrizesPotUpdated(
      _competitionId,
      msg.sender,
      competitions[_competitionId].prizesPot
    );
  }

}
