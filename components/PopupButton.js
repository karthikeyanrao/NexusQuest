// components/PopupButton.js
import React, { useState } from 'react';
import CustomModal from './Modal';

const PopupButton = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={openModal}
            >
                Open Popup
            </button>

            <CustomModal isOpen={modalIsOpen} onRequestClose={closeModal}>
                {/* Content of the modal */}
                <iframe
                    title="Transak Popup"
                    src="https://global-stg.transak.com/?apiKey=4aae77ea-df1a-4a88-9095-89625873c08e"
                    className="w-full h-full"
                />
            </CustomModal>
        </div>
    );
};

export default PopupButton;
