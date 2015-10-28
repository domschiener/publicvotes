contract NewPoll {

  //defines the poll
  struct Poll {
    address owner;
    string title;
    uint votelimit;
    string options;
    uint deadline;
    bool status;
    uint numVotes;
  }

  // event tracking of all votes
  event NewVote(string votechoice);

  // declare a public poll called p
  Poll public p;

  //initiator function that stores the necessary poll information
  function NewPoll(string _options, string _title, uint _votelimit, uint _deadline) {
    p.owner = msg.sender;
    p.options = _options;
    p.title = _title;
    p.votelimit = _votelimit;
    p.deadline = _deadline;
    p.status = true;
    p.numVotes = 0;
  }

  //function for user vote. input is a string choice
  function vote(string choice) returns (bool) {
    if (msg.sender != p.owner || p.status != true) {
      return false;
    }

    p.numVotes += 1;
    NewVote(choice);

    // if votelimit reached, end poll
    if (p.votelimit > 0) {
      if (p.numVotes >= p.votelimit) {
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
