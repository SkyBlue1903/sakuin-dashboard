"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/utils";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "@/icons";
import { BookOpen, CreditCard, InfoIcon, Sparkles, X } from "lucide-react";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  new?: boolean;
  target?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    target?: string;
  }[];
};

// Menu Utama Sakuin
const sakuinNavItems: NavItem[] = [
  {
    name: "SakuCard",
    icon: <CreditCard className="w-5 h-5" />,
    path: "/card",
  },
  {
    name: "Panduan",
    icon: <BookOpen className="w-5 h-5" />,
    path: "/panduan",
  },
  {
    name: "Informasi",
    icon: <InfoIcon className="w-5 h-5" />,
    path: "/info",
  },
  {
    name: "Promo",
    icon: <Sparkles className="w-5 h-5" />,
    path: "/promo",
    new: true,
  },
  {
    name: "Detail Profil",
    icon: <UserCircleIcon />,
    path: "/profile",
  },
];

// Menu Bawaan Template (TailAdmin)
const templateNavItems: NavItem[] = [
  // {
  //   icon: <GridIcon />,
  //   name: "Dashboard",
  //   subItems: [{ name: "eCommerce", path: "/" }],
  // },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  {
    icon: <UserCircleIcon />,
    name: "Pelanggan",
    path: "/profile",
  },
  {
    name: "Informasi",
    icon: <InfoIcon className="w-5 h-5" />,
    path: "/admin/info",
  },
  {
    name: "Panduan",
    icon: <BookOpen className="w-5 h-5" />,
    path: "/admin/panduan",
  },
  {
    name: "Promo",
    icon: <Sparkles className="w-5 h-5" />,
    path: "/admin/promo",
  },
  {
    name: "Kategori Merchant",
    icon: <ListIcon />,
    path: "/admin/merchant",
  },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank" },
  //     { name: "404 Error", path: "/error-404" },
  //   ],
  // },
];

// const othersItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Charts",
//     subItems: [
//       { name: "Line Chart", path: "/line-chart", pro: false },
//       { name: "Bar Chart", path: "/bar-chart", pro: false },
//     ],
//   },
//   {
//     icon: <BoxCubeIcon />,
//     name: "UI Elements",
//     subItems: [
//       { name: "Alerts", path: "/alerts" },
//       { name: "Avatar", path: "/avatars" },
//       { name: "Badge", path: "/badge" },
//       { name: "Buttons", path: "/buttons" },
//       { name: "Images", path: "/images" },
//       { name: "Videos", path: "/videos" },
//     ],
//   },
//   {
//     icon: <PlugInIcon />,
//     name: "Authentication",
//     subItems: [
//       { name: "Sign In", path: "/login", pro: false },
//       { name: "Sign Up", path: "/signup", pro: false },
//     ],
//   },
// ];

const AppSidebar: React.FC = () => {
  const { isOpen, closeSidebar, activeTitle, setActiveTitle } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "sakuin" | "template" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => {
      if (!path) return false;
      return pathname === path;
    },
    [pathname]
  );

  const isItemActive = useCallback(
    (nav: NavItem) => {
      if (nav.path) {
        return pathname === nav.path;
      }
      if (nav.subItems) {
        return nav.subItems.some((sub) => pathname === sub.path);
      }
      return false;
    },
    [pathname]
  );

  const isSubItemActive = useCallback(
    (subItem: { name: string; path: string }) => {
      return pathname === subItem.path;
    },
    [pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    const groups: { type: "sakuin" | "template" | "others"; items: NavItem[] }[] = [
      { type: "sakuin", items: sakuinNavItems },
      { type: "template", items: templateNavItems },
      // { type: "others", items: othersItems },
    ];

    groups.forEach(({ type, items }) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      // Keep state
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "sakuin" | "template" | "others"
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (
    items: NavItem[],
    menuType: "sakuin" | "template" | "others"
  ) => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={cn(
                "group menu-item cursor-pointer",
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              )}
            >
              <span
                className={cn(
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                )}
              >
                {nav.icon}
              </span>
              <span className="menu-item-text">{nav.name}</span>
              {nav.new && (
                <span
                  className={cn(
                    "inset-e-10 absolute ms-auto",
                    openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                      ? "menu-dropdown-badge-active"
                      : "menu-dropdown-badge-inactive",
                    "menu-dropdown-badge"
                  )}
                >
                  BARU
                </span>
              )}
              <ChevronDownIcon
                className={cn(
                  "ms-auto h-5 w-5 transition-transform duration-200",
                  openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                )}
              />
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                target={nav.target}
                onClick={() => {
                  setActiveTitle(nav.name);
                  closeSidebar();
                }}
                className={cn(
                  "group menu-item",
                  isItemActive(nav)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                )}
              >
                <span
                  className={cn(
                    isItemActive(nav)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  )}
                >
                  {nav.icon}
                </span>
                <span className="menu-item-text">{nav.name}</span>
                {nav.new && (
                  <span
                    className={cn(
                      "ms-auto menu-dropdown-badge",
                      isItemActive(nav)
                        ? "menu-dropdown-badge-active"
                        : "menu-dropdown-badge-inactive"
                    )}
                  >
                    BARU
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`] ?? 50}px`
                    : "0px",
              }}
            >
              <ul className="ms-9 mt-2 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      target={subItem.target}
                      onClick={() => {
                        setActiveTitle(subItem.name);
                        closeSidebar();
                      }}
                      className={cn(
                        "menu-dropdown-item",
                        isSubItemActive(subItem)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      )}
                    >
                      {subItem.name}
                      <span className="ms-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={cn(
                              "ms-auto menu-dropdown-badge",
                              isSubItemActive(subItem)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            )}
                          >
                            NEW
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={cn(
                              "ms-auto menu-dropdown-badge-pro",
                              isSubItemActive(subItem)
                                ? "menu-dropdown-badge-pro-active"
                                : "menu-dropdown-badge-pro-inactive"
                            )}
                          >
                            PRO
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 flex h-full flex-col border-r border-gray-200/80 bg-white text-gray-900 shadow-2xl transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900",
        "w-[290px] sm:w-[310px]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Top Header: Logo + Close Button */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <Link
          href="/card"
          onClick={() => {
            setActiveTitle("SakuCard");
            closeSidebar();
          }}
          className="flex items-center gap-2.5"
        >
          {/* <Image
            className="dark:hidden"
            src="/images/logo/logo.svg"
            alt="Sakuin"
            width={130}
            height={36}
            priority
            style={{ width: "auto", height: "auto" }}
          />
          <Image
            className="hidden dark:block"
            src="/images/logo/logo-dark.svg"
            alt="Sakuin"
            width={130}
            height={36}
            priority
            style={{ width: "auto", height: "auto" }}
          /> */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate">
              Sakuin.id
            </h1>
          </div>
        </Link>

        <button
          type="button"
          onClick={closeSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          title="Tutup Menu"
          aria-label="Tutup Menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav List with custom scrollbar */}
      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 py-4 duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-5">
            {/* Sakuin Menu */}
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                MENU PENGGUNA
              </h2>
              {renderMenuItems(sakuinNavItems, "sakuin")}
            </div>

            {/* Template Navigation */}
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                MENU ADMINISTRASI
              </h2>
              {renderMenuItems(templateNavItems, "template")}
            </div>

            {/* Others */}
            {/* <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                OTHERS
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>

        {/* Sidebar Widget Banner */}
        {/* <SidebarWidget /> */}
      </div>
    </aside>
  );
};

export default AppSidebar;
