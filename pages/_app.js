import "../styles/globals.css";

import MainLayout from "../layout/mainLayout";
import { useRouter } from "next/router";


function MyApp({ Component, pageProps }) {
  const router = useRouter()
  
  return (
    
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      
  );
}

export default MyApp;
