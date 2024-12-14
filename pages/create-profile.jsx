import React, { useState } from 'react'
import Link from 'next/link';
import { BsArrowRight, BsUpload } from 'react-icons/bs'
import Image from 'next/image';

export default function Nft() {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log({name, image});
    }

    return (
        <div className='h-screen bg-black'>
            <div className="grid mb-0 pt-5 pb-5 mt-0 md:mb-10 md:grid-cols-2">
                <figure className="flex flex-col pt-10">
                    <div className="text-left align-left w-[650px] p-8 pl-[100px]">
                        <div className="mb-2 bg-gradient-to-r from-[#fff] via-[#fff]/80 to-[#9d9ea1]/50 bg-clip-text 
                    text-transparent font-bold font-Agda text-[80px] uppercase md:max-w-5xl max-w-[575px]">
                            Create Your Profile</div>
                        <p className='text-white pb-10'>
                            Set up your gaming identity
                            <br />
                        </p>
                        <Link href="/explore"
                            className="inline-flex align-left items-center relative text-lg px-8 py-3 bg-white mr-5 uppercase font-Agda font-bold text-black hover:bg-[#f0f0f0] cursor-pointer">
                            EXPLORE PROFILES
                            <BsArrowRight className='ml-2' />
                        </Link>
                    </div>
                </figure>

                <figure className="flex flex-col items-center justify-center pt-10">
                    <div className="text-center px-[50px] align-middle w-[600px] h-[600px] p-8 bg-[#202020] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="text-left">
                                <label className="block text-white text-lg mb-2">Username</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>

                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                            >
                                {preview ? (
                                    <div className="relative w-48 h-48 mx-auto">
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-lg"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-gray-400">
                                        <BsUpload className="w-12 h-12 mx-auto mb-4" />
                                        <p>Drag and drop your profile image here or click to browse</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={(e) => handleFile(e.target.files[0])}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-6 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                            >
                                Create Profile
                            </button>
                        </form>
                    </div>
                </figure>
            </div>
        </div>
    )
}
