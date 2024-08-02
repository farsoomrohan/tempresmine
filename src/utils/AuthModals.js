import React, { useState } from "react";
import LoginForm from "../authentication/login";
import SignUpForm from "../authentication/signup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AuthModals = ({ isOpen, setIsOpen }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-30 backdrop-blur-sm"
        >
          <div className="relative container mx-auto p-4 w-full max-w-3xl">
            <FontAwesomeIcon icon="fa-regular fa-circle-xmark"
              className="absolute top-2 right-2 cursor-pointer"
              onClick={closeModal}
            /> {/* Close icon */}
            {isLogin ? (
              <LoginForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                toggleForm={toggleForm}
              />
            ) : (
              <SignUpForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                toggleForm={toggleForm}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModals;