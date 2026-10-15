"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSidebar } from "@/shared/presentation/stores/useSidebarStore";
import { cn } from "@/shared/utils";
import {
  ChevronDownIcon,
  ListIcon,
  UserCircleIcon,
} from "@/shared/presentation/components/icons";
import { BookOpen, CreditCard, InfoIcon, Sparkles, X } from "lucide-react";

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
    path: "/guide",
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
  },
  {
    name: "Detail Profil",
    icon: <UserCircleIcon />,
    path: "/profile",
  },
];

// Menu Administrasi Sakuin
const templateNavItems: NavItem[] = [
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
    path: "/admin/guide",
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
];

const AppSidebar: React.FC = () => {
  const { isOpen, closeSidebar, setActiveTitle } = useSidebar();
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
        "fixed top-0 left-0 z-50 flex h-full flex-col border-r border-border-subtle bg-surface text-text-primary shadow-2xl transition-transform duration-300 ease-in-out",
        "w-[290px] sm:w-[310px]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Top Header: Logo + Close Button */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle shrink-0">
        <Link
          href="/card"
          onClick={() => {
            setActiveTitle("SakuCard");
            closeSidebar();
          }}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-text-inverse shadow-ds-sm group-hover:scale-105 transition-transform">
            <svg
              className="h-5 w-5 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="4" />
              <path d="M2 10h20" />
              <circle cx="7" cy="15" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold tracking-tight text-text-primary truncate">
              Sakuin<span className="text-secondary font-medium">.id</span>
            </h1>
            <span className="text-[10px] text-text-tertiary block -mt-0.5 tracking-wider uppercase font-semibold">
              Virtual Card
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={closeSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
          title="Tutup Menu"
          aria-label="Tutup Menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav List with custom scrollbar */}
      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 py-4 duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-6">
            {/* Sakuin Menu */}
            <div>
              <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                MENU PENGGUNA
              </h2>
              {renderMenuItems(sakuinNavItems, "sakuin")}
            </div>

            {/* Template Navigation */}
            <div>
              <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
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
