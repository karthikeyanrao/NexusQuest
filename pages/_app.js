import "../styles/globals.css";
import { RecoilRoot } from "recoil"; // Import RecoilRoot
import MainLayout from "../layout/mainLayout";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <RecoilRoot> 
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </RecoilRoot>
  );
}
export default MyApp;




