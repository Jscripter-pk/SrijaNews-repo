import {
  searchAndCategoryReducer,
  initialState,
} from "@/app/reducers/searchAndCategoryReducer";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback, useReducer } from "react";
import Header from "../Header";
import { NewList } from "../News List/newsList";

export const NewsFeed = () => {
  const [state, dispatch] = useReducer(searchAndCategoryReducer, initialState);

  const fetchNews = async ({ pageParam = 1 }) => {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY as string;

    const params: {
      apiKey: string;
      category: string;
      q?: string;
      pageSize: number;
      page: number;
    } = {
      apiKey,
      category: state.category,
      pageSize: 20, // Assuming you want 20 articles per page
      page: pageParam, // Pass pageParam for pagination
    };

    // Only add searchQuery to params if it exists
    if (state.searchQuery) {
      params.q = state.searchQuery;
    }

    const response = await axios.get(
      `https://newsapi.org/v2/${
        state.searchQuery ? "everything" : "top-headlines"
      }`,
      {
        params,
      }
    );

    return {
      articles: response.data.articles,
      nextPage: pageParam + 1, // Increment page number
      hasMore: response.data.articles.length <= 100, // Determine if there are more articles
      totalResults: response.data.totalResults,
    };
  };

  const {
    data,
    fetchNextPage, // Function to fetch the next page
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["news", state.searchQuery, state.category],
    queryFn: fetchNews,
    enabled: !!state.searchQuery || !!state.category,
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    maxPages: 5,
  });

  const handleLoadMore = useCallback(() => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, fetchNextPage]);

  return (
    <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Header state={state} dispatch={dispatch} />
      <main className="flex flex-col gap-8">
        <NewList
          query={{
            data,
            handleLoadMore,
            isFetching,
            isFetchingNextPage,
          }}
        />
      </main>
    </div>
  );
};
