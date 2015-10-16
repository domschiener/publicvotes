contract NewPoll {

  enum PollStatus {Live, Voted}

  struct Poll {
    address owner;
    uint256 title;
    uint votelimit;
    string options;
    PollStatus status;
  }

  event UserVoted(bytes32 vote_choice);

  //publicly lists all registered votes and the poll
  bytes32[] public votes;
  uint numVotes;
  Poll public p;

  function newPoll(address creator, uint256 _title, uint _votelimit, string _options) {
    p.owner = creator;
    p.title = _title;
    p.votelimit = _votelimit;
    p.options = _options;
    p.status = PollStatus.Live;
  }

  function vote(bytes32 choice) returns (bool successful){
    if (msg.sender != p.owner || p.status == PollStatus.Voted) {
      return false;
    }
    votes[numVotes] = choice;
    numVotes++;
    UserVoted(choice);
    if (votes.length >= p.votelimit) {
      endPoll();
    }
    return true;
  }

  function endPoll() returns (bool result) {
    if (msg.sender != p.owner) {
      return false;
    }
    p.status = PollStatus.Voted;
    return true;
  }
}
