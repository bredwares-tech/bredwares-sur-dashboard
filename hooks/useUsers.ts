import { useEffect, useState } from "react";
export interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  username: string;
  department: string;
}
const fetchUsers = async () => {
  const res = await fetch("/api/users/get-users");

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

const useUsers = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const users = await fetchUsers();
        setData(users);
      } catch (error) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchUsers,
  };
};

export default useUsers;
