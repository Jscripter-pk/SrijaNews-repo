"use client";

import { State } from "@/app/reducers/filtersReducer";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { Key } from "react";
import { Loader } from "../Loader";

type ArticleType = {
  url: Key | null | undefined;
  urlToImage: string | undefined;
  title: string | null | undefined;
  description: string | number | null | undefined;
  source: {
    name: string | number | null | undefined;
  };
  publishedAt: string | number | Date;
};

export const NewList: React.FC<{ state: State }> = ({ state }) => {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  console.log("category", state.category === "" ? "general" : state.category);
  console.log("search", state?.searchQuery || "");

  const cachedNewsData = queryClient.getQueryData([
    "news",
    state?.searchQuery || "",
    state.category,
  ]) as ArticleType[];

  // Filter out articles without images
  const articlesWithImages = cachedNewsData?.filter(
    (article) => !!article.urlToImage
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 border-b-4 border-blue-500 inline-block ml-[18px] mt-[54px]">
        Latest News
      </h2>

      {articlesWithImages && !isFetching ? (
        articlesWithImages.length > 0 && (
          <ul className="grid grid-cols-1 p-4 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 md:p-8 ">
            {articlesWithImages.map((article: ArticleType) => (
              <li
                key={article.url}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative"
              >
                <a href={article.url as string} className="block flex-1">
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
        )
      ) : (
        <p>{isFetching ? <Loader /> : "No cached data available"}</p>
      )}
    </div>
  );
};
