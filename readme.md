# what

hack.summit(blockchain) grant analysis. 

## marching orders

from vivek:

> this generally was a consensys sponsorship and annelie asked us to get involved (and eventually, play a lead role)... the bounty we put up was 'oss incentive tools' basically searching for the next dev grants / kudos (edited)

# kevin's analysis

## submission

### standard competitions

https://github.com/ryanchristo/StandardCompetitions

Its an interesting use case of Standard Bounties.

I agree with Beylin that the foundational architecture of this is somewhat flawed.  The core contributors seem open to re-architecting it with Beylin/our input

This could be an intersting product to put together and build into Gitcoin to support our use in the blockchain space.  

I ran the tests and those seem to work well. Double points for that!

Side note: I need to learn more about yarn.  Seems useful.

### DecOSplat

https://source.deco.network/krboktv/entry-hacksummit-DecOSPlat

Looks like this team put together an incentive mechanism for open source, similar to Gitcoin, but with a voting mechanism (arbitration) on top of it

Docuemntation is pretty good.  I liek the flowchart!

I see a bunch of readmes in their repo, but no code.  Its a good idea, but without having some code, I feel the submission is lacking.  I would ahve prefered WIP code to no code at all.

### entry-hacksummit-GivemeGitcoin

https://source.deco.network/zhe_li/entry-hacksummit-GivemeGitcoin

Looks like a staking mechanism that helps coders be incentivied to follow through on their work by staking some ETH which will not be returned if they don't turn around the code.

In practice, might suffer some problems with liquidity.  Who wants to bet against a developer finishing their code?!?

I could see this re-implemented as a application scheme within gitcoin. i.e. if you want to work on my issue, you need to stake some ETH to show you're serious.

they have code in this repo, but no documentation about how to spin it up.  I wish I was better at remix / react to spin it up.

It'd be nice to have a link to the demo.


### Recommendation

I recommend paying out the bounty in the following order

1. GivemeGitcoin
2. Standard Competitions
3. DecoSplat

# Saptak's Analysis

### GivemeGitcoin
It seems like it's a simple react app (which is okay) but pretty badly structured according to me (from a developer perspective). Though the MVP works, but code wise I feel things might have been written better. Also, from linting and design perspective I see shortcoming.

### Standard Competitions
I can't really comment on the architecture as proposed, but it's MVP works as well. Also the project is well sturctured, well documented, it has TESTS!!! So from a developer's perspective, I really love it.

### DecoSplat
I have the exact same opinion as Kevin on this one project. I wish they had written a WIP code at least.

### My Recommendation

1. Standard Competitions
2. GivemeGitcoin
3. DecoSplat (sadly)



