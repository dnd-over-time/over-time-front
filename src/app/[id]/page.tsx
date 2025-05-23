'use client';

import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = use(params);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <h1 className='text-4xl font-bold'>ID: {id}</h1>
    </div>
  );
}
