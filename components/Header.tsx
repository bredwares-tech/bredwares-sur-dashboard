import { useState, useRef, useEffect } from "react";
import { User, Menu, LogOut, Settings, UserCircle, Mail } from "lucide-react";
import { signOutAction } from "@/app/actions";

export default function Header({
  setIsMobileMenuOpen,
}: {
  setIsMobileMenuOpen: (value: boolean) => void;
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userMenuItems = [
    {
      icon: LogOut,
      label: "Logout",
      onClick: () => {
        signOutAction();
      },
    },
  ];

  return (
    <header className="bg-white border-b p-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">Bredware Surveillance</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative" ref={userMenuRef}>
            <button
              className={`p-2 hover:bg-gray-100 rounded-full ${
                isUserMenuOpen ? "bg-gray-100" : ""
              }`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User className="h-5 w-5" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                {userMenuItems.map((item) => (
                  <div
                    key={item.label}
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <item.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
