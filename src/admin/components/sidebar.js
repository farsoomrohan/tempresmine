import { AlignJustify } from 'lucide-react'
import logo from '../../images/cllogo.png'
import profile from '../../images/prf.png'
import { createContext, useContext, useState } from 'react'
// import ReactPaginate from 'react-paginate';

const SidebarContext = createContext()

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true)
    return (
        <>
            <aside className="h-screen">
                <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <img
                            src={logo}
                            className={`overflow-hidden transition-all ${
                                expanded ? 'ml-10 w-32' : 'w-0'
                            }`}
                        />
                        <button
                            onClick={() => setExpanded((curr) => !curr)}
                            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                            {expanded ? <AlignJustify /> : <AlignJustify />}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>

                    <div className="border-t flex p-3">
                        <img src={profile} className="w-10 h-10 rounded-md" />
                        <div
                            className={`flex justify-between items-center overflow-hidden transition-all ${
                                expanded ? 'w-52 ml-3' : 'w-0'
                            } `}
                        >
                            <div className="leading-4">
                                <h4 className="font-semibold">Rajesab</h4>
                                <span className="text-xs text-gray-600">
                                    rajesab@cirruslabs.io{' '}
                                </span>
                            </div>
                            {/* <MoreVertical size={20} /> */}
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    )
}

export function SidebarItem({ icon, text, active, alert }) {
    const { expanded } = useContext(SidebarContext)

    return (
        <li
            className={`relative flex items-center py-3 px-3 my-2 mt-8 font-medium rounded-md cursor-pointer transition-colors group ${
                active
                    ? 'bg-textHeading from-indigo-200 to-indigo-100 text-white'
                    : 'hover:bg-indigo-50 text-textHeading font-semibold '
            }`}
        >
            {icon}
            <span
                className={`overflow-hidden transition-all ${
                    expanded ? 'w-52 ml-3' : 'w-0'
                }`}
            >
                {text}
            </span>
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
                        expanded ? '' : 'top-2'
                    }`}
                ></div>
            )}

            {!expanded && (
                <div
                    className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                >
                    {text}
                </div>
            )}
        </li>
    )
}
