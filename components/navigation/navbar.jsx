import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import logo from "../../public/images/logo-betting.png";
import { CgProfile } from "react-icons/cg";
import {ConnectButton} from '@suiet/wallet-kit';

const style = {
    wrapper: `bg-gradient-to-r from-gray-900 via-black to-gray-900 w-screen px-[1.2rem] py-[0.8rem] flex justify-between border-b border-[#F3BA2F] shadow-[0_4px_12px_rgba(243,186,47,0.3)]`,
    logoContainer: `flex items-center cursor-pointer hover:opacity-90 transition-all duration-300`,
    logoText: `ml-[0.8rem] text-transparent bg-clip-text bg-gradient-to-r from-[#F3BA2F] to-[#FFD700] font-semibold text-2xl`,
    headerItems: `font-Outfit font-light flex items-center`,
    headerItem: `font-Outfit text-white bg-clip-text bg-gradient-to-r from-gray-300 to-white px-4 font-bold hover:from-[#F3BA2F] hover:to-[#FFD700] cursor-pointer transition-all duration-300`,
    headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-[#F3BA2F] cursor-pointer transition-colors duration-300`,
};

export default function Navbar() {
    const router = useRouter();
    const [navbar, setNavbar] = useState(false);

    return (
        <div className={style.wrapper}>
            <Link href="/">
                <div className={style.logoContainer}>
                    <Image 
                        src={logo} 
                        height={60} 
                        width={180} 
                        alt="mantle logo"
                        className="object-contain" 
                    />
                    <div className={style.logoText}></div>
                </div>
            </Link>

            {/* HAMBURGER BUTTON FOR MOBILE */}
            <div className="md:hidden">
                <button
                    className="p-2 text-[#F3BA2F] rounded-md outline-none focus:border-[#F3BA2F] focus:border"
                    onClick={() => setNavbar(!navbar)}
                >
                    {navbar ? (
                        <Image src="/close.svg" width={30} height={30} alt="logo" className="filter invert" />
                    ) : (
                        <Image
                            src="/hamburger-menu.svg"
                            width={30}
                            height={30}
                            alt="logo"
                            className="filter invert focus:border-none active:border-none"
                        />
                    )}
                </button>
            </div>

            <div className={style.headerItems}>
                <div
                    className={style.headerItem}
                    onClick={() => {
                        router.push("/");
                    }}
                >
                    Explore
                </div>

                <div
                    className={style.headerItem}
                    onClick={() => {
                        router.push("/mybets");
                    }}
                >
                    MyBets
                </div>

                <div
                    className={style.headerItem}
                    onClick={() => {
                        router.push("/leaderboard");
                    }}
                >
                    Leaderboard
                </div>

                <div
                    className={style.headerItem}
                    onClick={() => {
                        router.push("/profile");
                    }}
                >
                    <CgProfile size={30} />
                </div>

                <div className="ml-4 hover:scale-105 transition-transform duration-300">
                    <ConnectButton/>
                </div>
            </div>
        </div>
    );
}