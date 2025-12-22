import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button className="bg-primarygreen-500 text-primarygreen-50 hover:bg-primarygreen-700 transition-all duration-300 hidden md:block">
      log out
    </Button>
  );
}
