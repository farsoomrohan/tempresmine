import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import { decodeToken, getToken, isTokenExpired } from '../../utils/auth'
import StringAvatar from '../../components/Avatar/stringAvatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { faBellConcierge, faBellSlash } from '@fortawesome/free-solid-svg-icons'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function HeaderAdmin() {
    const token = getToken()
    const decodedToken = token ? decodeToken(token) : null
    const tokenExpired = isTokenExpired(token)
    const [isVisible, setIsVisible] = useState(false)
    const fullName = decodedToken ? decodedToken.fullName : null

    useEffect(() => {
        //refresh navbar when logged in
        if (token && !tokenExpired) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [token, tokenExpired])

    return (
        <Disclosure as="nav" className="bg-gray-50 shadow-md">
            {({ open }) => (
                <div className="mx-auto max-w-8xl px-1 sm:px-1 lg:px-2">
                    <div className="flex justify-end h-20 items-center">
                        {isVisible ? (
                            <>
                                <div className="px-4">
                                    <FontAwesomeIcon
                                        icon={faBell}
                                        size="xl"
                                        color="#2C4B84"
                                    />
                                </div>
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="relative flex mr-3 rounded-full focus:outline-none  focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">
                                                Open user menu
                                            </span>

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
                                                        //   onClick={handleSignOut}
                                                        className={classNames(
                                                            active
                                                                ? 'bg-gray-100 cursor-pointer w-full'
                                                                : '',
                                                            'block px-4 py-2 text-sm text-gray-700 cursor-pointer w-full'
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
                            <div></div>
                        )}
                    </div>
                </div>
            )}
        </Disclosure>
    )
}
