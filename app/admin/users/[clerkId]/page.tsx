"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Briefcase,
  Mail,
  AtSign,
  ExternalLink,
  X,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface Recording {
  id: string;
  clerk_user_id: string;
  recording_url: string;
  title: string;
  description: string;
  duration: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  id: string;
  clerk_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  department: string;
}

export default function UserDetailPage() {
  const { clerkId } = useParams();
  const router = useRouter();
  const [userRecordings, setUserRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [activeVideo, setActiveVideo] = useState<Recording | null>(null);

  // Date filter state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get user data from sessionStorage (saved during navigation from table)
  useEffect(() => {
    try {
      const userData = sessionStorage.getItem(`user_${clerkId}`);
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        // If user data isn't in sessionStorage, redirect back to users list
        setError("User data not found");
      }
    } catch (e) {
      setError("Error retrieving user data");
    }
  }, [clerkId]);

  // Fetch recordings for the selected date
  useEffect(() => {
    async function fetchUserRecordingsByDate() {
      if (!clerkId || !selectedDate) return;

      setIsLoading(true);
      try {
        const dateParam = format(selectedDate, "yyyy-MM-dd");
        const response = await fetch(
          `/api/videos/get-videos?clerkId=${clerkId}&date=${dateParam}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user recordings");
        }

        const data = await response.json();
        setUserRecordings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch recordings"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRecordingsByDate();
  }, [clerkId, selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state with date picker visible
  if (isLoading && user) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>

        {/* User profile card */}
        <div className="mb-10 bg-card rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(user.first_name, user.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-3xl font-bold">
                  {user.first_name} {user.last_name}
                </h1>
                <Badge variant="outline" className="mt-1">
                  {user.department}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AtSign className="h-4 w-4 text-muted-foreground" />
                  <span>{user.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-mono">{user.clerk_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recordings section with date filter and loading skeletons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            User Recordings
          </h2>

          {/* Date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Initial loading state
  if (isLoading && !user) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        <div className="mb-10 bg-card rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="flex justify-center items-center h-64">
          <div className="bg-destructive/10 p-6 rounded-lg text-center max-w-md">
            <div className="text-destructive text-xl font-semibold mb-2">
              Error
            </div>
            <p className="text-destructive-foreground">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleBackClick}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Return to Users
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="flex justify-center items-center h-64">
          <div className="bg-muted p-6 rounded-lg text-center max-w-md">
            <div className="text-xl font-semibold mb-2">User not found</div>
            <p className="text-muted-foreground">
              The requested user information could not be found.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleBackClick}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Return to Users
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6">
      {/* Back button */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Users
        </Button>
      </div>

      {/* User profile card */}
      <div className="mb-10 bg-card rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl font-bold">
                {user.first_name} {user.last_name}
              </h1>
              <Badge variant="outline" className="mt-1">
                {user.department}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                <span>{user.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{user.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-mono">{user.clerk_id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video player modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-bold truncate">{activeVideo.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative w-full aspect-video bg-black">
              <video
                src={activeVideo.recording_url}
                controls
                className="w-full h-full"
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span>{activeVideo.duration}</span>
                <span className="mx-1">•</span>
                <Calendar className="h-4 w-4" />
                <span>{formatDate(activeVideo.created_at)}</span>
              </div>
              <p className="text-sm">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recordings section with date filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          User Recordings
          {userRecordings.length > 0 && (
            <Badge variant="secondary">{userRecordings.length}</Badge>
          )}
        </h2>

        {/* Date picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {userRecordings.length === 0 ? (
        <div className="bg-muted p-8 rounded-lg text-center">
          <p className="text-muted-foreground">
            No recordings found for {format(selectedDate, "MMMM d, yyyy")}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userRecordings.map((recording) => (
            <Card
              key={recording.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="p-0">
                <div
                  className="aspect-video bg-muted relative cursor-pointer group"
                  onClick={() => setActiveVideo(recording)}
                >
                  {/* Video thumbnail - using a placeholder background */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground group-hover:bg-primary transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {recording.duration}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-1 line-clamp-1">
                  {recording.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(recording.created_at)}
                </p>
                <p className="text-sm line-clamp-2">{recording.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setActiveVideo(recording)}
                >
                  Play Video
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(recording.recording_url, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
