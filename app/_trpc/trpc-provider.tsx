'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc as Trpc } from './client';
import { hostUrl } from '@/lib/constants';

export default function TRPCProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    Trpc.createClient({
      links: [
        httpBatchLink({
          url: `${hostUrl}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <Trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Trpc.Provider>
  );
}
