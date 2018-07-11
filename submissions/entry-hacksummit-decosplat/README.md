# Decentralized Open Source platform (DecOSplat) but actually Partly-decentralized Open Source platform (PdOSplat)


![Just truth](https://source.deco.network/krboktv/entry-hacksummit-DecOSPlat/raw/branch/master/README_docs/OPenSource.png)


## Navigation in our repository

We have several branches, in Master branch there is only README information

Branches: 
1. **Solidity** branch - a truffle solution with smart contract 
2. **Offchain** = **Frontend** (web3.js + material design) +  **Backend** (node.js with [caching server](http://104.45.16.70:3000/main))
3. **master** - just README 


## Abstract

PdoSplat helps to stimulate open source solutions by rewarding developers.

## Motivation

We are Nick Kozlov & Kirill Kuznecov. We are Solidity developers, hackathon lovers, lazy students and we love open source. Moreover, we love principles of decentralization and publicity. So, it will be a good idea to use some Blockchain technologies principles to stimulate open source. 
We are Solidity developers, so we think that we can make a prototype of a platform where open source developers can be rewarded for thier solutions. 
We love to use combination of good solutions to make a new one even better. In our case we want to use gitcoin and some parts of other open source projects to create this platform.

## Specification

![Image of flow](https://source.deco.network/krboktv/entry-hacksummit-DecOSPlat/raw/branch/master/README_docs/Viz.png)

1. Client make a task and send ETH as reward to our smart contract platform
2. Anybody can accept it and solve it by creating Git repository with solution
3. If client accept solution - all sum goes to developer
4. If client disagrees - our platfrom trigger vote module 
5. After all - developer get reward

##### Vote module

1. There are some account's that we call Validators (Because of them we are not decentralized)
2. Validators are some serius experts with reputation (maybe some companies, like OpenZeppelin, BANKEX, Consensys, IBM etc)
3. Validators solve argue between client and developer by code audit
4. After that they vote for parts that will be sent to clien and developer
5. Our main contract is autmatically triggered after end of vote

##### Another possibilities

1. Anyone can propose solution to task by providing other open source repository 
2. Our smart contract make a fund for contributors of this repo
3. Contributors can get their reward if they proof that they are contributors by their RSA key in GIT (RSA lib for Solidity
4. We can reward users not only via ETH but with **Gitcoin** 
5. We can use multi tokens for rewards (ERC-888)

## License 
MIT

## Authors
1. Nick Kozlov
2. Kirill Kuznecov 



