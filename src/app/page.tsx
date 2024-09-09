"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NewsFeed } from "./components/NewsFeed";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <NewsFeed />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}
