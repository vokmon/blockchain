var Election = artifacts.require('./Election.sol');

contract('Election', function(accounts) {
  var electionInstance;
 
  it('initializes with two candidates', async () => {
    electionInstance = await Election.deployed();
    var count = await electionInstance.candidatesCount();
    assert.equal(count, 2);
  });

  it('initializes the candidiates with the correct values', async() => {
    electionInstance = await Election.deployed();
    const candidate1 = await electionInstance.candidates(1);

    assert.equal(candidate1.id, 1, 'contains the correct id');
    assert.equal(candidate1.name, 'Candidate 1', 'contains the correct name');
    assert.equal(candidate1.voteCount, 0, 'contains the correct vote count');

    const candidate2 = await electionInstance.candidates(2);
    assert.equal(candidate2.id, 2, 'contains the correct id');
    assert.equal(candidate2.name, 'Candidate 2', 'contains the correct name');
    assert.equal(candidate2.voteCount, 0, 'contains the correct vote count');
  });
  
  it('allows a voter to cast a vote', async()=> {
    electionInstance = await Election.deployed();
    const candidateId = 1;
    const account = accounts[0];
    await electionInstance.vote(candidateId, {from: account});
    const voted = await electionInstance.voters(account);
    assert(voted, `the voter ${account} was marked as voted`);
    const candidate = await electionInstance.candidates(candidateId);
    assert.equal(candidate.voteCount, 1, 'increments the candidate\'s vote count');
  });

  it('throws an exception for invalid candidates', async() => {
    electionInstance = await Election.deployed();
    const account = accounts[1];
    try {
      await electionInstance.vote(99, {from: account});
    }
    catch(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
    }

    const candidate1 = await electionInstance.candidates(1);
    assert.equal(candidate1.voteCount, 1, 'candidate 1 did not receive any votes');

    const candidate2 = await electionInstance.candidates(2);
    assert.equal(candidate2.voteCount, 0, 'candidate 2 did not receive any votes');
  });

  it('throws an exception for double voting', async() => {
    electionInstance = await Election.deployed();
    const candidateId = 2;
    const account = accounts[1];
    await electionInstance.vote(candidateId, {from: account});
    const voted = await electionInstance.voters(account);
    assert(voted, `the voter ${account} was marked as voted`);

    const candidate = await electionInstance.candidates(candidateId);
    assert.equal(candidate.voteCount, 1, 'accept first vote');

    // vote again
    try {
      await electionInstance.vote(candidateId, {from: account});
    }
    catch(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
    }

    const candidate1 = await electionInstance.candidates(1);
    assert.equal(candidate1.voteCount, 1, 'candidate 1 did not receive any votes');

    const candidate2 = await electionInstance.candidates(2);
    assert.equal(candidate2.voteCount, 1, 'candidate 2 did not receive any votes');
  });
});