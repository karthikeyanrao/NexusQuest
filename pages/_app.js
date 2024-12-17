import "../styles/globals.css";
import { RecoilRoot } from "recoil"; // Import RecoilRoot
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3"; // Import Web3 to create the library for Web3ReactProvider
import MainLayout from "../layout/mainLayout"; 
import { useRouter } from "next/router";

// Web3ReactProvider setup
function getLibrary(provider) {
  return new Web3(provider); // Return Web3 instance
}

function MyApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <RecoilRoot>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </RecoilRoot>
    </Web3ReactProvider>
  );
}

export default MyApp;
