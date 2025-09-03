'use client';

import CreateEvent from '../../components/CreateEvent';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/events-overview');
  };

  return <CreateEvent onClose={handleClose} />;
}

