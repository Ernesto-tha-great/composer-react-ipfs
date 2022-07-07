import * as React from "react";
import deployedContracts from "@celo-progressive-dapp-starter/hardhat/deployments/hardhat_contracts.json";
import { useCelo } from "@celo/react-celo";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "./HomePage";
import UploadPage from "./UploadPage";

export default function App() {
  const { network } = useCelo();

  const contracts =
    deployedContracts[network?.chainId?.toString()]?.[
      network?.name?.toLocaleLowerCase()
    ]?.contracts;

  return (
    <AppLayout title="Celo Starter" description="Celo Starter">
      <HomePage contractData={contracts?.NewsFeed} />
      {/* <UploadPage contractData={contracts?.NewsFeed} /> */}
    </AppLayout>
  );
}
