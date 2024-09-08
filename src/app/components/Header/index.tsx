import React, { Dispatch, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Action, State } from "@/app/reducers/filtersReducer";
import Image from "next/image";

interface HeaderProps {
  state: State;
  dispatch: Dispatch<Action>;
}

const Header: React.FC<HeaderProps> = ({ state, dispatch }) => {
  const [searchInputText, setSearchInputText] = useState("");

  const fetchNews = async () => {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY as string;

    const params: {
      apiKey: string;
      category: string;
      q?: string;
    } = {
      apiKey,
      category: state.category,
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

    return response.data.articles;
  };

  const { isError } = useQuery({
    queryKey: ["news", state.searchQuery, state.category],
    queryFn: fetchNews,
    enabled: !!state.searchQuery || !!state.category,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = () => {
    dispatch({ type: "SET_SEARCH", payload: searchInputText });
    dispatch({ type: "SET_CATEGORY", payload: "" });
  };

  const handleCategoryChange = (category: string) => {
    dispatch({ type: "SET_CATEGORY", payload: category });
    dispatch({ type: "SET_SEARCH", payload: "" });
    setSearchInputText("");
  };

  return (
    <header className="bg-blue-800 text-white py-2 pt-4 pb-2  ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* App Title */}
        <div className="mb-4 md:mb-0 flex-shrink-0 text-center md:text-left rounded-full overflow-hidden">
          <Image
            src="/logo/newsite.png"
            alt="Your Site Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        {/* Search Bar */}
        <div className="flex flex-row md:flex-row w-full md:w-auto gap-4 items-center">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-[70%] ml-2 md:w-80 p-1.5 text-sm rounded-md text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchInputText}
            onChange={(e) => setSearchInputText(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="w-[25%] mr-4 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 text-sm rounded-md transition-colors"
          >
            Search
          </button>
        </div>

        {/* Categories and Reset Button */}
        <nav className="flex gap-2 pl-2 pb-2 w-[100%] overflow-auto justify-start md:justify-end mt-4 md:mt-0">
          {["business", "technology", "sports", "entertainment"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                state.category === cat
                  ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
                  : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Displaying Error */}
      <div className="mt-4 text-center">
        {isError && <p>Failed to fetch articles.</p>}
      </div>
    </header>
  );
};

export default Header;
