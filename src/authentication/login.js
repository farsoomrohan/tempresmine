import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import Logo from "../images/cllogo.png";
import { showErrorToast, showSuccessToast } from "../utils/toastUtility";
import Loading from "react-loading"; // import the loading component

function LoginForm({ isOpen, setIsOpen, toggleForm }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .matches(/^[\w.%+-]+@cirruslabs\.io$/, "Email is Invalid!")
      .required("Email required"),
    password: Yup.string().required("Password required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsLoading(true); // set loading to true when form is submitted

    try {
      const responseBody = {
        username: values.email,
        password: values.password,
      };
      const response = await Axios.post(
        `${process.env.REACT_APP_URL}/auth/login`,
        responseBody
      );

      const { accessToken } = response.data;
      localStorage.setItem("token", accessToken);

      const decoded = jwtDecode(accessToken);

      localStorage.setItem("decodedToken", JSON.stringify(decoded));
      const expirationTime = decoded.exp * 1000;
      localStorage.setItem("expirationTime", expirationTime);
      showSuccessToast("Successful Login! Welcome back.");
      navigate("/home");
    } catch (error) {
      showErrorToast("Invalid email or password. Please try again.");
      setErrors({ api: "Invalid email or password" });
      values.email = "";
      values.password = "";
    }
    setIsLoading(false); // set loading to false when submission is complete
    setSubmitting(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleModal = () => {
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
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <div className="w-full bg-bgWhite rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 relative">
                <button
                  onClick={toggleModal}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2 right-2"
                >
                  <FontAwesomeIcon icon={faCircleXmark} size="xl" />
                </button>
                <div className="flex items-center justify-center">
                  <img
                    className="h-12 w-auto mt-4 pl-6"
                    src={Logo}
                    alt="logo"
                  />
                </div>
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-textHeading md:text-2xl ">
                    Welcome back !
                  </h1>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({ isSubmitting, errors }) => (
                      <Form className="space-y-4 md:space-y-6">
                        <div>
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-semibold text-normalText "
                          >
                            Email
                          </label>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-normalText sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                            placeholder="name@domain.com"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-semibold text-noramlText "
                          >
                            Password
                          </label>
                          <div className="relative">
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              id="password"
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                              <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                              />
                            </button>
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting || isLoading} // disable button when loading
                          className="flex items-center justify-center w-full text-white bg-btnColor hover:bg-btnHover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-md px-5 h-10 text-center "
                        >
                          {isLoading ? (
                            <Loading
                              type={"bubbles"}
                              color={"#ffffff"}
                              height={"40px"}
                              width={"40px"}
                            /> // display loading animation when loading
                          ) : (
                            "Sign in"
                          )}
                        </button>
                        <p className="text-sm font-light text-lighterText ">
                          Don’t have an account yet?{" "}
                          <button
                            onClick={toggleForm}
                            className="font-bold text-sm text-normalText hover:underline  hover:cursor-pointer"
                          >
                            Sign up
                          </button>
                        </p>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginForm;