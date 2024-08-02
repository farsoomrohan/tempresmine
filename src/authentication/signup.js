import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Logo from "../images/cllogo.png";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import { showErrorToast, showSuccessToast } from "../utils/toastUtility";
import Loading from "react-loading"; // import the loading component

const SignUpForm = ({ isOpen, setIsOpen, toggleForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const url = `${process.env.REACT_APP_URL}`;

  const initialValues = {
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Name required"),
    email: Yup.string()
      .email("Invalid email format")
      .matches(/^[\w.%+-]+@cirruslabs\.io$/, "Email is Invalid!")
      .required("Email required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsLoading(true);
    try {
      const response = await Axios.post(`${url}/auth/signup`, {
        fullName: values.fullname,
        username: values.email,
        password: values.password,
      });

      const { accessToken } = response.data;
      localStorage.setItem("token", accessToken);

      const decoded = jwtDecode(accessToken);
      localStorage.setItem("decodedToken", JSON.stringify(decoded));
      const expirationTime = decoded.exp * 1000;
      localStorage.setItem("expirationTime", expirationTime);
      showSuccessToast("Successful Sign Up! Welcome to our community.");
      navigate("/home");
    } catch (error) {
      if (error.response.data.message === "Username is already taken") {
        showErrorToast("Email is already taken. Please try again.");
      } else {
        showErrorToast("Something went wrong. Please try again.");
      }
      setErrors({ api: "Something went wrong. Please try again." });
    }
    setIsLoading(false);
    setSubmitting(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
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
              <div className="w-full bg-bgWhite rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0  relative">
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
                    Sign up and join us!
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
                            htmlFor="fullname"
                            className="block mb-2 text-sm font-semibold text-normalText "
                          >
                            Full Name
                          </label>
                          <Field
                            type="text"
                            name="fullname"
                            id="fullname"
                            className="bg-gray-50 border border-gray-300 text-normalText sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="John Doe"
                          />
                          <ErrorMessage
                            name="fullname"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
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
                            className="bg-gray-50 border border-gray-300 text-normalText sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                            className="block mb-2 text-sm font-semibold text-normalText "
                          >
                            Password
                          </label>
                          <div className="relative">
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              id="password"
                              className="bg-gray-50 border border-gray-300 text-normalText sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block mb-2 text-sm font-semibold text-normalText "
                          >
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Field
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              id="confirmPassword"
                              className="bg-gray-50 border border-gray-300 text-normalText sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={toggleConfirmPasswordVisibility}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                              <FontAwesomeIcon
                                icon={showConfirmPassword ? faEyeSlash : faEye}
                              />
                            </button>
                          </div>
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
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
                            "Sign Up"
                          )}
                        </button>
                        <p className="text-sm font-light text-lighterText ">
                          Already have an account?{" "}
                          <button
                            onClick={toggleForm}
                            className="font-bold text-sm text-normalText hover:underline  hover:cursor-pointer"
                          >
                            Sign In
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
};

export default SignUpForm;
