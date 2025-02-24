import React from "react";
import { Users, Video, Shield, Calendar } from "lucide-react";

const stats = [
  { title: "Active Users", value: "24", icon: Users },
  { title: "Active Meetings", value: "3", icon: Video },
  { title: "Private Rooms", value: "8", icon: Shield },
  { title: "Scheduled Today", value: "12", icon: Calendar },
];

const meetings = [
  {
    id: 1,
    title: "Management Weekly Sync",
    time: "10:00 AM",
    date: "2024-03-20",
    participants: 8,
    status: "Scheduled",
  },
  {
    id: 2,
    title: "Project Review",
    time: "2:30 PM",
    date: "2024-03-20",
    participants: 12,
    status: "In Progress",
  },
  {
    id: 3,
    title: "Team Building Discussion",
    time: "11:00 AM",
    date: "2024-03-21",
    participants: 15,
    status: "Scheduled",
  },
];

const rooms = [
  {
    id: 1,
    name: "Executive Suite",
    participants: 5,
    status: "Active",
  },
  {
    id: 2,
    name: "Project Room A",
    participants: 8,
    status: "Available",
  },
  {
    id: 3,
    name: "Training Room",
    participants: 0,
    status: "Available",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  {stat.title}
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meetings and Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Meetings Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              Today's Meetings
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {meeting.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {meeting.time} · {meeting.participants} participants
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        meeting.status === "In Progress"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {meeting.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Private Rooms</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {room.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {room.participants} participants
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        room.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
