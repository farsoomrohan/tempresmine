import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../images/cllogo.png";
import { decodeToken, getToken, isTokenExpired } from "../utils/auth";
import { showSuccessToast } from "../utils/toastUtility";
import { useNavigate } from "react-router-dom";
import StringAvatar from "./Avatar/stringAvatar";

const navigation = [{ name: "Home", href: "/home", current: true }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const token = getToken();
  const decodedToken = token ? decodeToken(token) : null;
  const tokenExpired = isTokenExpired(token);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("decodedToken");
    showSuccessToast("Successfully signed out.");
    navigate("/");
  };

  useEffect(() => {
    //refresh navbar when logged in
    if (token && !tokenExpired) {
      setMobileMenuOpen(false);
    }
  }, [token, tokenExpired]);


  const fullName = decodedToken ? decodedToken.fullName : null;

  return (
    <Disclosure as="nav" className="bg-gray-50 shadow-md">
      {({ open }) => (
        <div className="mx-auto max-w-8xl px-1 sm:px-1 lg:px-2">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-baseline pl-4">
              <img className="h-14 w-auto" src={Logo} alt="Your Company" />
              {decodedToken && (
                <div className="hidden sm:flex sm:ml-6 space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "text-normalText"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-semibold"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center sm:hidden">
              {decodedToken && (
                <Disclosure.Button
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              )}
            </div>
            <div className="hidden sm:flex sm:items-center sm:ml-6">
              {!tokenExpired ? (
                <>
                  <h4 className="text-normalText font-semibold text-base mr-3">
                    Welcome, {fullName}
                  </h4>
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex mr-3 rounded-full focus:outline-none  focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open user menu</span>

                        <StringAvatar username={fullName} />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={classNames(
                                active ? "bg-gray-100 cursor-pointer w-full" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer w-full"
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              ) : (
                <div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
}
