import Link from "next/link";
import { useCelo } from "@celo/react-celo";
import { truncateAddress } from "@/utils";

export default function Header({ ToastContainer }) {
  const { address, network, connect, destroy, kit } = useCelo();

  return (
    <header className="w-full flex bg-gray-800 justify-between h-20 items-center border-b p-4 border-borderWhiteGray dark:border-borderGray">
      <div className=" w-1/3">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-white">Home</h1>
        </Link>
      </div>
      <div className=" w-1/3 flex justify-center items-center">
        <h1 className="text-2xl font-bold text-blue-300 dark:text-blue-300">
          Newsworthy
        </h1>
      </div>

      {address ? (
        <div className="w-1/3 flex justify-end items-center">
          <li className="bg-green-100 py-1 px-4 mx-4 rounded-full cursor-pointer hover:bg-green-200">
            <h4 className="font-medium self-center -mt-6 px-3">
              {truncateAddress(address)}
            </h4>
          </li>
          <Link href="/UploadPage">
            <button className="items-center bg-green-600 rounded-lg font-medium p-1  color-blue-500 hover:bg-green-500 focus:outline-none focus:shadow-outline text-white">
              <span className="">Create a New Feed</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className=" w-1/3 flex justify-end">
          <button
            className="items-center bg-green-600 rounded-md font-medium p-3 shadow-lg color-blue-500 hover:bg-green-500 focus:outline-none focus:shadow-outline text-white"
            onClick={() => connect().catch((e) => console.log(e))}
          >
            <span className="">Connect your wallet</span>
          </button>
        </div>
      )}
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
    </header>
  );
}
