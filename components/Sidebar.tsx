// components/Sidebar.tsx
import Link from "next/link";
import {
  Calendar,
  Home,
  Settings,
  Shield,
  Users,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
}) {
  const menuItems = [
    { icon: Video, label: "Dashboard", href: "/admin" },
    { icon: Shield, label: "Users", href: "/admin/users" },
    // { icon: Users, label: "Employees", href: "/employees" },
    // { icon: Calendar, label: "Schedule", href: "/schedule" },
    // { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0
          w-64 bg-gray-800 text-white
          z-50 lg:z-30
          transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-200 ease-in-out
          flex flex-col
        `}
      >
        <div className="flex justify-between items-center p-4">
          {/* <div className="relative w-36 h-8 lg:w-44 lg:h-10">
            <Link href="/admin">
              <Image
                src="/assests/logowhite.png"
                alt="Admin Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div> */}
          <div className="flex items-center space-x-4">
            <Video className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold">Bredware</h1>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="px-4 py-2 space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
