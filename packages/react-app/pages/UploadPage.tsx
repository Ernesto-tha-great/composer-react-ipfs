import React, { useState, useRef, useEffect } from "react";
import { useCelo } from "@celo/react-celo";
import { NewsFeed } from "@celo-progressive-dapp-starter/hardhat/types/NewsFeed";
import deployedContracts from "@celo-progressive-dapp-starter/hardhat/deployments/hardhat_contracts.json";
import { create } from "ipfs-http-client";
import { BiCloud, BiPlus } from "react-icons/bi";
import { ToastContainer } from "react-toastify";

import { success, error, defaultToast } from "../utils/response";
import { ImportCandidate } from "ipfs-core-types/dist/src/utils";

export default function Upload() {
  const { address, connect, kit } = useCelo();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [coverImage, setCoverImage] = useState<any>("");

  const { network } = useCelo();

  const contractDataS =
    deployedContracts[network?.chainId?.toString()]?.[
      network?.name?.toLocaleLowerCase()
    ]?.contracts;

  /*
   * Create an IPFS node
   */
  const client = create("https://ipfs.infura.io:5001/api/v0");
  const coverImageRef = useRef();

  let contractData = contractDataS.NewsFeed;

  const contract = contractData
    ? (new kit.connection.web3.eth.Contract(
        contractData.abi,
        contractData.address
      ) as any as NewsFeed)
    : null;

  const handleSubmit = async () => {
    if (
      title === "" ||
      description === "" ||
      location === "" ||
      coverImage === ""
    ) {
      error("Please, all the fields are required!");
      return;
    }

    uploadCoverImage(coverImage);
  };

  const uploadCoverImage = async (coverImage: ImportCandidate) => {
    defaultToast("Uploading Cover Image...");

    try {
      const image = await client.add(coverImage);
      await saveFeed(image.path);
    } catch (err) {
      error("Error Uploading Cover Image");
    }
  };

  const saveFeed = async (coverImage: string) => {
    defaultToast("Saving Feed...");
    console.log(title, description, category, location, coverImage);

    try {
      const UploadedDate = String(new Date());
      console.log("contract", contract);
      const gasPriceMinimumContract = await kit.contracts.connection.gasPrice();
      await contract.methods
        .createFeed(
          title,
          description,
          location,
          category,
          coverImage,
          UploadedDate
        )
        .send({ from: address, gasPrice: gasPriceMinimumContract });

      success("Feed Saved Successfully");

      // reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setCoverImage("");

      // Redirect to Home Page
      window.location.href = "/";
    } catch (err) {
      console.log(err);
      error("Error Saving Feed");
    }
  };

  // Handles redirect to Home Page or previous page
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="w-full bg-gray-200 h-screen flex flex-row">
      <div className="flex-1 flex flex-col">
        <div className="mt-5 mr-10 flex  justify-end">
          <div className="flex items-center">
            <button
              className="bg-red  dark:text-[#9CA3AF] py-2 px-6 border rounded-lg  border-gray-600  mr-6"
              onClick={() => {
                goBack();
              }}
            >
              {title ? "Discard" : "Back"}
            </button>
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg flex px-4 justify-between flex-row items-center"
            >
              <BiCloud />
              <p className="ml-2">Upload</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col m-10 mt-5 lg:flex-row lg:justify-center">
          <div className="flex lg:w-3/4 flex-col ">
            <label className="text-green-600  text-lg font-bold mb-2">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Celo launches a $20m connect the world fund."
              className="w-[60%]  dark:placeholder:text-gray-600 rounded-lg mt-2 h-12 p-2 border border-borderWhiteGray bg-white  dark:border-[#444752] focus:outline-none"
            />
            <label className="text-green-600  mt-10 text-md font-bold">
              Body
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="In line with Celo's connect the world initiative, the foundation has set aside $20m to assist CICO ...."
              className="w-[60%] dark:placeholder:text-gray-600 rounded-xl mt-2 h-32 p-2 border border-borderWhiteGray bg-white  dark:border-[#444752] focus:outline-none"
            />

            <div className="flex flex-row mt-10 w-[60%] justify-between">
              <div className="flex flex-col w-2/5	">
                <label className="text-green-600  text-md font-bold">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                  placeholder=""
                  className="rounded-md mt-2 dark:placeholder:text-gray-600 h-12 p-2 border border-borderWhiteGray bg-white  dark:border-[#444752] focus:outline-none"
                />
              </div>
              <div className="flex flex-col w-2/5">
                <label className="text-green-600  text-md font-bold">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className=" mt-2 h-12 p-2 dark:border-gray-600 border rounded-xl border-borderWhiteGray bg-white  dark:text-[#9CA3AF] focus:outline-none"
                >
                  <option>Music</option>
                  <option>Sports</option>
                  <option>Gaming</option>
                  <option>News</option>
                  <option>Entertainment</option>
                  <option>Education</option>
                  <option>Technology</option>
                  <option>Travel</option>
                </select>
              </div>
            </div>
            <label className="text-green-600  mt-10 text-md font-bold">
              Cover Image
            </label>

            <div
              onClick={() => {
                coverImageRef.current.click();
              }}
              className="border-2 w-64 dark:border-gray-600 border-dashed border-border-gray-300 rounded-md mt-2 p-2 h-46 items-center justify-center flex flex-row"
            >
              {coverImage ? (
                <img
                  onClick={() => {
                    coverImageRef.current.click();
                  }}
                  src={URL.createObjectURL(coverImage)}
                  alt="coverImage"
                  className="h-full rounded-md w-full"
                />
              ) : (
                <BiPlus size={60} color="gray" />
              )}
            </div>

            <input
              type="file"
              className="hidden"
              ref={coverImageRef}
              onChange={(e) => {
                setCoverImage(e.target.files[0]);
              }}
            />
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
