import React from "react";

export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className={`animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-75`}
      ></div>
    </div>
  );
};
