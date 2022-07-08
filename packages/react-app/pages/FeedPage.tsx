import React, { useEffect, useState } from "react";
import { useCelo } from "@celo/react-celo";
import { NewsFeed } from "@celo-progressive-dapp-starter/hardhat/types/NewsFeed";
import deployedContracts from "@celo-progressive-dapp-starter/hardhat/deployments/hardhat_contracts.json";
import Link from "next/link";
import FeedList from "../components/FeedList";
import Feed from "./FeedsPage";
import { from } from "@apollo/client";

export default function FeedPage() {
  const { address, network, kit } = useCelo();
  const [relatedFeeds, setRelatedFeeds] = useState([]);

  // state variable to store the current feed
  const [feed, setFeed] = useState<any>([]);

  const contractDataS =
    deployedContracts[network?.chainId?.toString()]?.[
      network?.name?.toLocaleLowerCase()
    ]?.contracts;

  let contractData = contractDataS.NewsFeed;

  const contract = contractData
    ? (new kit.connection.web3.eth.Contract(
        contractData.abi,
        contractData.address
      ) as any as NewsFeed)
    : null;

  // Function to get the feed id from the url
  const getUrlValue = () => {
    let vars = {};
    window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  };

  /*
   * Get Feed
   */
  const getFeed = async () => {
    try {
      let feedId = getUrlValue()["id"];
      console.log("feedid", typeof feedId);
      const allFeed = await contract.methods.getAllFeeds().call();
      // console.log(
      //   "contract data",
      //   await contract.methods.getFeed(feedId).send({ from: address })
      // );
      const singleFeed: any = allFeed.filter((feed: any) => feed.id === feedId);
      console.log("single feed", singleFeed[0].title);

      // Format feed
      const formattedFeed = {
        id: singleFeed[0].id,
        title: singleFeed[0].title,
        description: singleFeed[0].description,
        location: singleFeed[0].location,
        category: singleFeed[0].category,
        coverImageHash: singleFeed[0].coverImageHash,
        date: singleFeed[0].date,
        author: singleFeed[0].author,
      };

      setFeed(formattedFeed);
      console.log("feescjkfkvgld", feed);
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Get Related Feeds
   */
  const getRelatedFeeds = async () => {
    try {
      let feedId = getUrlValue()["id"];
      // Get all feeds and return feeds and filter only the one in the same category as the feed
      const allFeeds = await contract.methods.getAllFeeds().call();
      const singleFeed: any = allFeeds.filter(
        (feed: any) => feed.id === feedId
      );
      // Format feed
      const formattedSingleFeed = {
        id: singleFeed[0].id,
        title: singleFeed[0].title,
        description: singleFeed[0].description,
        location: singleFeed[0].location,
        category: singleFeed[0].category,
        coverImageHash: singleFeed[0].coverImageHash,
        date: singleFeed[0].date,
        author: singleFeed[0].author,
      };
      const relatedFeeds = allFeeds.filter(
        (feed: any) => feed.category === formattedSingleFeed.category
      );

      const formattedFeeds = relatedFeeds.map((feed: any) => {
        return {
          id: feed.id,
          title: feed.title,
          description: feed.description,
          location: feed.location,
          category: feed.category,
          coverImageHash: feed.coverImageHash,
          author: feed.author,
          date: feed.date,
        };
      });

      setRelatedFeeds(formattedFeeds);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeed();
    getRelatedFeeds();
  }, []);

  return (
    <div className="w-full bg-gray-200 h-screen flex flex-row">
      <Link href="/">
        <button className="bg-red-600 hover:bg-red-800 text-white w-20 h-20 mt-10 justify-right font-bold px-2 rounded ml-10">
          Go Back
        </button>
      </Link>
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col m-10 justify-between xl:flex-row">
          <div className="lg:w-4/6 w-6/6">{feed && <Feed feed={feed} />}</div>
          <div className="w-2/6">
            <div className="mt-20">
              <h4 className="text-xl font-bold  ml-5 mb-3 text-green">
                Related Feeds
              </h4>
              {relatedFeeds.map((f) => {
                return (
                  <Link href={`/feed?id=${f.id}`}>
                    <FeedList feed={f} horizontal={true} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
