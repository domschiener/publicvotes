contract NewPoll {

  //defines the poll
  struct Poll {
    address owner;
    string title;
    uint votelimit;
    string options;
    uint deadline;
    bool status;
    bytes32[] votes;
  }

  //declares the variables
  uint numVotes = 0;
  Poll public p;

  //initiator function that stores the necessary poll information
  function NewPoll(string _options, string _title, uint _votelimit, uint _deadline) {
    p.owner = msg.sender;
    p.options = _options;
    p.title = _title;
    p.votelimit = _votelimit;
    p.deadline = _deadline;
    p.status = true;
  }

  //function for user vote. input is a string choice
  function vote(bytes32 choice) returns (bool) {
    if (msg.sender != p.owner || p.status != true) {
      return false;
    }
    p.votes[numVotes] = choice;
    numVotes++;
    if (p.votelimit > 0) {
        if (numVotes >= p.votelimit) {
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
