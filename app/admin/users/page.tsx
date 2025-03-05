"use client";

import useUsers from "@/hooks/useUsers";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function UsersPage() {
  const { data, loading, error } = useUsers();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
