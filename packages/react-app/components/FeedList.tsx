import React from "react";
import { BiCheck } from "react-icons/bi";

export default function FeedList({ horizontal, feed }) {
  return (
    <div
      className={`${
        horizontal
          ? "flex mx-5  mb-5 item-center justify-center"
          : "flex flex-col mx-5  px-4 rounded-xl shadow-xl"
      } `}
    >
      <img
        className={
          horizontal
            ? "object-contain rounded-lg w-60 h-40"
            : "object-contain rounded-lg w-full h-40"
        }
        src={`https://ipfs.infura.io/ipfs/${feed.coverImageHash}`}
        alt="cover"
      />
      <div className={horizontal && "ml-3  w-80"}>
        <h4 className="text-md font-bold dark:text-gray-600 font-semibold mt-3 text-black">
          {feed.title}
        </h4>
        {horizontal && (
          <p className="text-sm font-semibold flex items-center text-textSubTitle mt-1">
            {feed.category} •
          </p>
        )}
        {horizontal && (
          <p className="text-sm font-medium flex items-center text-textSubTitle mt-1">
            {feed.description.slice(0, 30)}...
          </p>
        )}
        <p className="text-sm flex font-semibold items-center text-textSubTitle mt-1">
          {horizontal ? null : feed.category + " • "}
          {feed?.author?.slice(0, 12)}...{" "}
          <BiCheck size="20px" color="green" className="ml-1" />
        </p>
      </div>
    </div>
  );
}
