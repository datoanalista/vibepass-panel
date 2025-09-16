"use client";
import EventsOverview from '../../components/EventsOverview';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function EventsOverviewPage() {
  return (
    <ProtectedRoute>
      <main>
        <EventsOverview />
      </main>
    </ProtectedRoute>
  );
}