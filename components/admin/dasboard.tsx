"use client";

import { useEffect, useState } from "react";
import { Users, Video, Shield, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Define TypeScript types
interface User {
  clerk_id: string;
  first_name?: string;
  last_name?: string;
  department?: string;
}

interface Recording {
  recording_url: string | undefined;
  id: string;
  title?: string;
  created_at: string;
  clerk_user_id: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersResponse = await fetch("/api/users/get-users");
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData: User[] = await usersResponse.json();
        setUsers(usersData);

        // Fetch all recordings
        const recordingsResponse = await fetch(
          "/api/videos/get-all-recordings"
        );
        if (!recordingsResponse.ok) {
          throw new Error("Failed to fetch recordings");
        }
        const recordingsData: Recording[] = await recordingsResponse.json();
        setRecordings(recordingsData);
      } catch (err) {
        setError((err as Error).message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate unique departments count
  const uniqueDepartments = new Set(users.map((user) => user.department)).size;

  // Calculate stats
  const stats = [
    { title: "Active Users", value: users.length.toString(), icon: Users },
    {
      title: "Total Recordings",
      value: recordings.length.toString(),
      icon: Video,
    },
    {
      title: "Total Departments",
      value: uniqueDepartments.toString(),
      icon: Shield,
    },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full p-4 rounded-lg bg-destructive/10 text-destructive">
        <p className="font-medium">Error loading dashboard: {error}</p>
        <p className="text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full px-2 sm:px-4 md:px-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden w-full">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-xl md:text-2xl font-semibold">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recordings Section */}
      <Card className="w-full">
        <CardHeader className="px-4 md:px-6 py-3 md:py-4">
          <CardTitle className="text-base md:text-lg">
            Recent Recordings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {recordings.length === 0 ? (
            <div className="text-center py-8">
              <Video className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No recordings found</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {recordings
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .slice(0, 5)
                .map((recording) => (
                  <a
                    key={recording.id}
                    href={recording.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 md:p-4 border rounded-lg hover:bg-accent/50 transition-colors w-full"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">
                        {recording.title || "Untitled Recording"}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(recording.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-primary mt-2 sm:mt-0">
                      <span>View Recording</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 w-full px-2 sm:px-4 md:px-6">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Recordings Section Skeleton */}
      <Card>
        <CardHeader className="px-4 md:px-6 py-3 md:py-4">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-3 md:p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full max-w-[250px]" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-28" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
