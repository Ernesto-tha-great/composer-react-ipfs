//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NewsFeed {
  uint256 totalFeeds;

  using Counters for Counters.Counter;
  Counters.Counter private _feedIds;

  constructor() {
    console.log("Celo NewsFeed deployed");
  }

  /*
   * I created a struct here named Feed.
   * A struct is a custom datatype where we can customize what we want to hold inside it.
   */
  struct Feed {
    uint256 id;
    string title;
    string description;
    string location;
    string category;
    string coverImageHash;
    string date;
    address author;
  }

  /*
   * A little magic is known as an event in Solidity!
   */
  event FeedCreated(
    uint256 id,
    string title,
    string description,
    string location,
    string category,
    string coverImageHash,
    string date,
    address author
  );

  /*
   * I declare variable feeds that let me store an array of structs.
   * This is what holds all the feeds anyone ever created.
   */
  Feed[] feeds;

  /*
   * This function will be used to get all the feeds.
   */
  function getAllFeeds() public view returns (Feed[] memory) {
    /*
     * This is a function that will return the length of the array.
     * This is how we know how many feeds are in the array.
     */
    return feeds;
  }

  /*
   * This function will be used to get the number of feeds.
   */
  function getTotalFeeds() public view returns (uint256) {
    return totalFeeds;
  }

  /*
   * This is a function that will be used to get a feed.
   * It will take in the following parameters:
   * - _id: The id of the feed
   */
  function getFeed(uint256 _id) public view returns (Feed memory) {
    /*
     * We are using the mapping function to get the feed from the mapping.
     * We are using the _id variable to get the feed from the mapping.
     */
    return feeds[_id];
  }

  /*
   * This function will be used to create a news feed.
   * It will take in the following parameters:
   * - _title: The title of the feed
   * - _description: The description of the feed
   * - _location: The location of the feed
   * - _category: The category of the feed
   * - _coverImageHash: The hash of the cover image of the feed
   * - _date: The date of the feed
   */

  function createFeed(
    string memory _title,
    string memory _description,
    string memory _location,
    string memory _category,
    string memory _coverImageHash,
    string memory _date
  ) public {
    // Validation
    require(bytes(_coverImageHash).length > 0);
    require(bytes(_title).length > 0);
    require(bytes(_description).length > 0);
    require(bytes(_location).length > 0);
    require(bytes(_category).length > 0);
    require(msg.sender != address(0));

    totalFeeds++;

    /* Increment the counter */
    _feedIds.increment();

    /*
         * We are using the struct Feed to create a news feed.
         To create a news feed* We use the id, title, description, location, category, coverImageHash, date, and author variables.
         */
    feeds.push(
      Feed(
        _feedIds.current(),
        _title,
        _description,
        _location,
        _category,
        _coverImageHash,
        _date,
        msg.sender
      )
    );

    /*
         * We are using the event FeedCreated to emit an event.
         To emit an event*, We use the id, title, description, location, category, coverImageHash, date, and author variables.
         */
    emit FeedCreated(
      _feedIds.current(),
      _title,
      _description,
      _location,
      _category,
      _coverImageHash,
      _date,
      msg.sender
    );
  }
}
