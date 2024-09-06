"use client";

import { State } from "@/app/reducers/filtersReducer";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { Key, useEffect, useState } from "react";
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

export const NewList: React.FC<{ state: State }> = ({ state }) => {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  const cachedNewsData = queryClient.getQueryData([
    "news",
    state?.searchQuery || "",
    state.category,
  ]) as ArticleType[];

  // State for filtering by categories, sources, authors, and date range
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [articles, setFilteredArticles] = useState<ArticleType[]>();

  useEffect(() => {
    setFilteredArticles(cachedNewsData);
  }, [cachedNewsData]);

  // Function to handle filtering the articles based on user preferences
  const filterArticles = () => {
    let filteredArticles = cachedNewsData;

    if (selectedSource) {
      filteredArticles = filteredArticles?.filter(
        (article) =>
          article.source.name === selectedSource &&
          !article.title?.includes("Removed")
      );
    }
    if (selectedAuthor) {
      filteredArticles = filteredArticles?.filter(
        (article) =>
          article.author === selectedAuthor &&
          !article.title?.includes("Removed")
      );
    }
    if (startDate) {
      filteredArticles = filteredArticles?.filter(
        (article) =>
          new Date(article.publishedAt.toString().slice(0, 10)) >=
            new Date(startDate) && !article.title?.includes("Removed")
      );
    }
    if (endDate) {
      filteredArticles = filteredArticles?.filter(
        (article) =>
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
    setFilteredArticles(cachedNewsData || []);
  };

  const uniqueSources = Array.from(
    new Set(cachedNewsData?.map((article) => article.source.name))
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
                  <option key={source} value={source as string}>
                    {source}
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

      {articles && !isFetching ? (
        articles.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-8">
            {articles.map((article: ArticleType, index: number) => (
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
                          <span className="italic">{article.source.name}</span>
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString()}
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
        ) : (
          <p className="text-center text-gray-500">No articles found.</p>
        )
      ) : (
        <p>{isFetching ? <Loader /> : "No cached data available"}</p>
      )}
    </div>
  );
};
