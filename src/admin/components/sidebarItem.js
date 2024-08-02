import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Upload, List } from 'lucide-react'
import Sidebar, { SidebarItem } from './sidebar'

const sideMenuData = [
    {
        to: '/admin',
        label: 'Dashboard',
        icon: () => <LayoutDashboard size={20} />,
    },
    {
        to: '/admin/upload-bench',
        label: 'Upload Bench',
        icon: () => <Upload size={20} />,
    },
    {
        to: '/admin/bench-lists',
        label: 'Bench List',
        icon: () => <List size={20} />,
    },
]

function SidebarContainer() {
    const [activeItem, setActiveItem] = useState('Dashboard')
    const location = useLocation()

    useEffect(() => {
        const currentPath = location.pathname
        const activeMenuItem = sideMenuData.find(
            (menu) => menu.to === currentPath
        )
        if (activeMenuItem) {
            setActiveItem(activeMenuItem.label)
        }
    }, [location.pathname])

    return (
        <div className="flex">
            <Sidebar>
                {sideMenuData.map((menu, index) => (
                    <NavLink
                        to={menu.to}
                        key={index}
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <SidebarItem
                            icon={<menu.icon />}
                            text={menu.label}
                            active={activeItem === menu.label}
                        />
                    </NavLink>
                ))}
            </Sidebar>
        </div>
    )
}

export default SidebarContainer
