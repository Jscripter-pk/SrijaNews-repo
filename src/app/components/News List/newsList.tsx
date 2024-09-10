"use client";

import { InfiniteData } from "@tanstack/react-query";
import { Key, useEffect, useMemo, useState } from "react";
import { Loader } from "../Loader";

type ArticleType = {
  url: Key | null | undefined;
  urlToImage: string | undefined;
  title: string | null | undefined;
  description: string | number | null | undefined;
  source: {
    name: string | number | null | undefined;
  };
  author: string | null | undefined;
  publishedAt: string | number | Date;
};

export const NewList: React.FC<{
  query: {
    data:
      | InfiniteData<
          {
            articles: ArticleType[];
            nextPage: number;
            hasMore: boolean;
            totalResults: number;
          },
          unknown
        >
      | undefined;
    handleLoadMore: () => void;
    isFetching: boolean;
    isFetchingNextPage: boolean;
  };
}> = ({ query }) => {
  const {
    data: queryData,
    handleLoadMore,
    isFetching,
    isFetchingNextPage,
  } = query;

  const pagesData = useMemo(
    () =>
      queryData?.pages.flatMap(
        (page: { articles: ArticleType[] }) => page.articles
      ) || [],
    [queryData]
  );

  // State for filtering by categories, sources, authors, and date range
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [articles, setFilteredArticles] = useState<ArticleType[]>();

  useEffect(() => {
    setFilteredArticles(pagesData);
  }, [pagesData]);

  // Function to handle filtering the articles based on user preferences
  const filterArticles = () => {
    let filteredArticles = pagesData;

    if (selectedSource) {
      filteredArticles = filteredArticles?.filter(
        (article: ArticleType) =>
          article.source.name === selectedSource &&
          !article.title?.includes("Removed")
      );
    }
    if (selectedAuthor) {
      filteredArticles = filteredArticles?.filter(
        (article: ArticleType) =>
          article.author === selectedAuthor &&
          !article.title?.includes("Removed")
      );
    }
    if (startDate) {
      filteredArticles = filteredArticles?.filter(
        (article: ArticleType) =>
          new Date(article.publishedAt.toString().slice(0, 10)) >=
            new Date(startDate) && !article.title?.includes("Removed")
      );
    }
    if (endDate) {
      filteredArticles = filteredArticles?.filter(
        (article: ArticleType) =>
          new Date(article.publishedAt.toString().slice(0, 10)) <=
            new Date(endDate) && !article.title?.includes("Removed")
      );
    }

    return filteredArticles;
  };

  const handleFilteredArticles = () => {
    const filteredArticles = filterArticles();
    setFilteredArticles(filteredArticles);
  };

  const resetFilters = () => {
    setSelectedSource(null);
    setSelectedAuthor(null);
    setStartDate("");
    setEndDate("");
    setFilteredArticles(pagesData || []);
  };

  const uniqueSources = Array.from(
    new Set(pagesData?.map((article: ArticleType) => article.source.name))
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 border-b-4 border-blue-500 inline-block ml-[18px] mt-[54px]">
          Latest News
        </h2>
        <button
          onClick={() => setFilterModalOpen(true)}
          className="self-end bg-gray-200 hover:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors mr-8 mb-3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={"/icons/filtericon.png"}
            alt={"filtering icon"}
            width={20}
            height={20}
            color="white"
          />
        </button>
      </div>

      {/* Modal for Filtering */}
      {filterModalOpen && (
        <div className="fixed px-3 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-8 rounded-md shadow-md max-w-lg w-full">
            <button
              className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600"
              aria-label="Close"
              onClick={() => {
                setFilterModalOpen(false);
              }}
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Filter and Personalize News
            </h3>

            {/* Source */}
            <div className="mb-4">
              <label className="block text-gray-700">Source:</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedSource || ""}
                onChange={(e) => setSelectedSource(e.target.value || null)}
              >
                <option value="">All Sources</option>
                {uniqueSources.map((source) => (
                  <option key={source as string} value={source as string}>
                    {source as string}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="mb-4">
              <label className="block text-gray-700">Author:</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter author name"
                value={selectedAuthor || ""}
                onChange={(e) => setSelectedAuthor(e.target.value || null)}
              />
            </div>

            {/* Date Range */}
            <div className="mb-4">
              <label className="block text-gray-700">From Date:</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">To Date:</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  resetFilters();
                  setFilterModalOpen(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  handleFilteredArticles();
                  setFilterModalOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {articles &&
        (articles.length > 0 ? (
          <>
            <div className="px-[28px] mt-[24px] grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-12 mb-8 w-full">
              {articles.slice(0, 4).map((article, index) => (
                <div
                  key={`${article.url}-${index}`}
                  className="relative h-[150px] bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row"
                >
                  <a
                    href={article.url as string}
                    className="flex flex-col lg:flex-row w-full"
                  >
                    {article.urlToImage ? (
                      <div className="relative flex-shrink-0 w-full lg:w-48 h-48 lg:h-auto">
                        <img
                          src={article.urlToImage}
                          alt={article.title as string}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 lg:h-auto w-full lg:w-48 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-center">
                          No Image Available
                        </span>
                      </div>
                    )}
                    <div className="p-4 flex flex-col justify-between w-full">
                      <h3 className="text-xl font-semibold text-blue-600">
                        {article.title}
                      </h3>
                      {/* Show description on mobile (small screens) */}
                      <p className="text-gray-700 mt-2 block lg:hidden">
                        {article.description}
                      </p>
                      <span className="text-sm text-gray-500 italic mt-4">
                        {article.source.name} -{" "}
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-8">
              {articles.slice(4).map((article: ArticleType, index: number) => (
                <li
                  key={`${article.url}-${index}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative"
                >
                  <a href={article.url as string} className="block flex-1">
                    {article.urlToImage ? (
                      <div className="relative w-full h-48">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.urlToImage}
                          alt={article.title as string}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-2 text-white text-xs">
                          <div className="flex justify-between">
                            <span className="italic">
                              {article.source.name}
                            </span>
                            <span>
                              {new Date(
                                article.publishedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                        <span>No Image Available</span>
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 flex-1">
                        {article.description}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            {articles?.length < queryData?.pages?.[0]?.totalResults && (
              <button
                onClick={() => {
                  handleLoadMore();
                }}
                className="mt-4 mb-4 mx-auto block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                {isFetchingNextPage ? (
                  <Loader />
                ) : (
                  <>
                    <span>{"Load More"}</span>
                    <svg
                      className="w-5 h-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </button>
            )}
          </>
        ) : null)}
      {articles && articles.length === 0 && !isFetching && (
        <div className="flex items-center justify-center h-[60%]">
          <p className="text-2xl text-gray-500">No News Found</p>
        </div>
      )}
      <p>
        {isFetching && !isFetchingNextPage && articles?.length === 0 && (
          <Loader />
        )}
      </p>
    </div>
  );
};
