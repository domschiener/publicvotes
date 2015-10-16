contract NewPoll {

  enum PollStatus {Live, Voted}

  struct Poll {
    address owner;
    bytes32 title;
    uint votelimit;
    string options;
    PollStatus status;
  }

  event Voted(bytes32 vote_choice);

  //publicly lists all registered votes and the poll
  bytes16[] public votes;
  uint numVotes;
  Poll public p;

  function NewPoll(bytes32 _title, uint _votelimit, string _options) {
    p.owner = msg.sender;
    p.title = _title;
    p.votelimit = _votelimit;
    p.options = _options;
    p.status = PollStatus.Live;
  }

  function vote(bytes16 choice) returns (bool successful){
    if (msg.sender != p.owner || p.status == PollStatus.Voted) {
      return false;
    }
    votes[numVotes] = choice;
    numVotes++;
    Voted(choice);
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
