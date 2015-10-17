contract NewPoll {

  //defines the poll
  struct Poll {
    address owner;
    string title;
    uint votelimit;
    string options;
    bool status;
  }

  //if someone voted, we want to be notified
  event Voted(bytes32 vote_choice);

  //declares the variables
  bytes32[] public votes;
  uint numVotes;
  Poll public p;

  //initiator function that enters the necessary poll information
  function NewPoll(string _options, string _title, uint _votelimit) {
    p.owner = msg.sender;
    p.options = _options;
    p.title = _title;
    p.votelimit = _votelimit;
    p.status = true;
  }

  //function for user vote. input is a hex choice
  function vote(bytes32 choice) returns (bool){
    if (msg.sender != p.owner || p.status != true) {
      return false;
    }
    votes[numVotes] = choice;
    numVotes++;
    Voted(choice);
    if (p.votelimit > 0) {
        if (votes.length >= p.votelimit) {
          endPoll();
        }
    }
    return true;
  }

  //when time or vote limit is reached, set the poll status to false
  function endPoll() returns (bool) {
    if (msg.sender != p.owner) {
      return false;
    }
    p.status = false;
    return true;
  }
}
