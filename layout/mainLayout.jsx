import { OktoWalletProvider } from "@/providers/OktoWalletProvider";
import Navbar from "../components/navigation/navbar";
import {WalletProvider} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import dynamic from 'next/dynamic';

// Dynamically import WalletProvider with ssr disabled to avoid useLayoutEffect warning
const WalletProviderNoSSR = dynamic(
  () => import('@suiet/wallet-kit').then((mod) => mod.WalletProvider),
  { ssr: false }
);

export default function MainLayout({ children }) {
	return (
		<div>
			<WalletProviderNoSSR>
				<OktoWalletProvider>
					<Navbar />
					{children}
				</OktoWalletProvider>
			</WalletProviderNoSSR>
		</div>
	);
}
