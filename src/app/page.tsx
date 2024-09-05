"use client";
import { useReducer } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";
import { NewList } from "./components/News List/newsList";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { filtersReducer, initialState } from "./reducers/filtersReducer";
const queryClient = new QueryClient();

export default function Home() {
  const [state, dispatch] = useReducer(filtersReducer, initialState);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
        <Header state={state} dispatch={dispatch} />
        <main className="flex flex-col gap-8">
          <NewList state={state} />
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}
