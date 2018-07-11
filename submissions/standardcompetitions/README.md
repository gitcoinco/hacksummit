# StandardCompetitions

A smart contract to help incentivize open source software development through ongoing competitions.

## About

This project was created for the [Hack.Summit(“Blockchain”) Virtual Hackathon](https://hacksummit.org/hackathon). The StandardCompetitions smart contract is inspired by Bounty Network's [StandardBounties](https://github.com/Bounties-Network/StandardBounties). The goal of the smart contract is to establish a standard for ongoing open source software competitions to help incentivize open source. More information about the challenge can be found at [Hack.Summit(“Blockchain”) Contest Spotlight: Consensys](https://medium.com/deconet/hack-summit-blockchain-contest-spotlight-consensys-2f1962e731dc).

## Implementation

The implementation of StandardCompetitions is similar to that of [StandardBounties](https://github.com/Bounties-Network/StandardBounties). A competition is used to distribute amounts of ETH or a given token to one or several contestants based on the successful submission of projects and the outcome of the judging process. The contract aims to reduce the necessary trust in the competition host by forcing them to transfer sufficient amounts of ETH or a given token to pay out the winning contestants.

#### `createCompetition(host, deadline, specification, judges, prizes, token)`

- `createCompetition()` creates a competition draft.

  - `host` is the address of the competition host.
  - `deadline` is a unix timestamp representing the competition deadline.
  - `specification` is a string representing the specification of the competition.
  - `judges` is an array of addresses representing the judges of the competition.
  - `prizes` is an array of numbers representing the amounts to be distributed to the winning contestants.
  - `token` is the address of the token that the competition will use to receive transfers and distribute prizes.

- _The `host`, `deadline` and `specification` are required. The `host`, `deadline` `specification`, `judges`, `prizes` and `token` cannot be changed once the competition has been activated. The `deadline` must be a date in the future at the time which the competition is created._

#### `updateCompetitionHost(competitionId, host)` _(only host)_

- `updateCompetitionHost()` updates the `host` for the given competition.

  - `competitionId` is the index of the competition.
  - `host` is the address of the competition host.

- _The `host` cannot be changed once the competition has been activated._

#### `updateCompetitionDeadline(competitionId, deadline)` _(only host)_

- `updateCompetitionDeadline()` updates the `deadline` for the given competition.

  - `competitionId` is the index of the competition.
  - `deadline` is a unix timestamp representing the competition deadline.

- _The `deadline` cannot be changed once the competition has been activated._

#### `updateCompetitionSpecification(competitionId, specification)` _(only host)_

- `updateCompetitionSpecification()` updates the `specification` for the given competition.

  - `competitionId` is the index of the competition.
  - `specification` is a string representing the specification of the competition.

- _The `specification` cannot be changed once the competition has been activated._

#### `updateCompetitionJudges(competitionId, judges)` _(only host)_

- `updateCompetitionJudges()` updates the `judges` for the given competition.

  - `competitionId` is the index of the competition.
  - `judges` is an array of addresses representing the judges of the competition.

- _The `judges` must be set before the competition has been activated. The `judges` cannot be changed once the competition has been activated._

#### `updateCompetitionPrizes(competitionId, prizes)` _(only host)_

- `updateCompetitionPrizes()` updates the `prizes` for the given competition.

  - `competitionId` is the index of the competition.
  - `prizes` is an array of numbers representing the amounts to be distributed to the winning contestants.

- _The `prizes` must be set before the competition has been activated. The `prizes` cannot be changed once the competition has been activated._

#### `updateCompetitionToken(competitionId, token)` _(only host)_

- `updateCompetitionToken()` updates the `token` for the given competition.

  - `competitionId` is the index of the competition.
  - `token` is the address of the token that the competition will use to receive transfers and distribute prizes.

- _It is not required to set the token. If the token is not set, the competition will use ETH to receive transfers and distribute prizes. If the host wishes to distribute prizes in a given token, the competition token must be set and the competition must hold the required funds before the competition can be activated. If the competition token has received transfers in a given token or ETH and the host updates the competition token, the balance of the competition will be returned to the host before the competition token is updated._

#### `transferToCompetition(competitionId, amount)`

- `transferToCompetition()` transfers the provided `amount` to the competition.

  - `amount` is the amount of a given token or ETH that the host is transferring from their account.

- _If the competition token is set, the `amount` is the amount in the given token. If the competition token is not set, the `amount` is the amount in ETH measured in wei and must match the `value` sent with the request. Transfers to the competition can be made at any time allowing the host to increase `prizes` after the competition has been activated._

### To be continued...

- ...

## Prerequisites

- Yarn 1.7.0

## Development

#### Install Dependencies

```
yarn
```

#### Run Tests

```
yarn test
```

## Production

#### Install Dependencies

```
yarn
```

#### Compile Contracts

```
yarn build
```
