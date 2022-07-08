import React, { useState, useEffect } from "react";
import { useCelo } from "@celo/react-celo";
import { NewsFeed } from "@celo-progressive-dapp-starter/hardhat/types/NewsFeed";
import FeedList from "../components/FeedList";
import Link from "next/link";
import { error } from "../utils/response";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage({ contractData }) {
  const { kit } = useCelo();
  const [loading, setLoading] = useState(false);
  const [loadingArray] = useState(15);

  // Create a state variable to store the feeds in the blockchain
  const [feeds, setFeeds] = useState<any>([]);

  const contract = contractData
    ? (new kit.connection.web3.eth.Contract(
        contractData.abi,
        contractData.address
      ) as any as NewsFeed)
    : null;

  const getFeeds = async () => {
    try {
      setLoading(true);
      const AllFeeds = await contract.methods.getAllFeeds().call();
      /*
       * We only need title, category, coverImageHash, and author
       * pick those out
       */
      const formattedFeed = AllFeeds.map((feed: any) => {
        return {
          id: feed.id,
          title: feed.title,
          category: feed.category,
          coverImageHash: feed.coverImageHash,
          author: feed.author,
          date: new Date(feed.date * 1000),
        };
      });

      setFeeds(formattedFeed);
      setLoading(false);
    } catch (err) {
      error(`${err.message}`);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    getFeeds();
  }, []);

  return (
    <div className="w-full  flex flex-row">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-row flex-wrap mt-8">
          {feeds
            ?.map((feed, index) => {
              return (
                <Link href={`/FeedPage?id=${feed.id}`} key={index}>
                  <div className="w-80 h-80 m-2">
                    <FeedList feed={feed} />
                  </div>
                </Link>
              );
            })
            .reverse()}
          {loading && (
            <div className="flex-1 flex flex-row flex-wrap">
              {Array(loadingArray)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="w-80">
                    <Loader />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Loader = () => {
  return (
    <div className="flex flex-col m-5 animate-pulse">
      <div className="w-full bg-gray-300 dark:bg-borderGray h-40 rounded-lg "></div>
      <div className="w-50 mt-3 bg-gray-300 dark:bg-borderGray h-6 rounded-md "></div>
      <div className="w-24 bg-gray-300 h-3 dark:bg-borderGray mt-3 rounded-md "></div>
    </div>
  );
};
