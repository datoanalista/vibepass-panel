"use client";
import EventAdminDashboard from '../../components/EventAdminDashboard';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main>
        <EventAdminDashboard />
      </main>
    </ProtectedRoute>
  );
}