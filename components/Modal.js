// components/Modal.js
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

const CustomModal = ({ isOpen, onRequestClose, children }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="overlay"
        >
            <div className="bg-white p-4 rounded-lg shadow-md">
                <button className="absolute top-0 right-0 m-4" onClick={onRequestClose}>
                    Close
                </button>
                {children}
            </div>
        </Modal>
    );
};

export default CustomModal;
