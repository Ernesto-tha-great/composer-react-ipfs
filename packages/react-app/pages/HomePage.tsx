import React, { useState, useEffect } from "react";
import { useCelo } from "@celo/react-celo";
import { NewsFeed } from "@celo-progressive-dapp-starter/hardhat/types/NewsFeed";
import { ToastContainer } from "react-toastify";
import FeedList from "../components/FeedList";
import Link from "next/link";

import { success, error, warn } from "../utils/response";

import "react-toastify/dist/ReactToastify.css";
import { Header } from "@/components/Header";

export default function HomePage({ contractData }) {
  const { address, connect, kit } = useCelo();
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
      console.log("all feeds", AllFeeds);
      /*
       * We only need title, category, coverImageHash, and author
       * pick those out
       */
      const formattedFeed = AllFeeds.map((feed) => {
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

    const onFeedCreated = async (
      id,
      title,
      description,
      location,
      category,
      coverImageHash,
      date,
      author
    ) => {
      setFeeds((prevState) => [
        ...prevState,
        {
          id,
          title,
          description,
          location,
          category,
          coverImageHash,
          date,
          author,
        },
      ]);
    };

    // if (address) {
    //   contract.on("FeedCreated", onFeedCreated);
    // }

    // return () => {
    //   if (contract) {
    //     contract.off("FeedCreated", onFeedCreated);
    //   }
    // };
  }, []);

  return (
    <div className="w-full  flex flex-row">
      <div className="flex-1 flex flex-col">
        <Header ToastContainer={ToastContainer} />
        <div className="flex-1 flex flex-row flex-wrap">
          {feeds?.map((feed, index) => {
            return (
              <Link href={`/feed?id=${feed.id}`} key={index}>
                <div className="w-80 h-80 m-2">
                  <FeedList feed={feed} />
                </div>
              </Link>
            );
          })}
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
