import { Toaster } from "@/components/Toaster";
import React, { useState } from "react";

const ratingsData = [
  { rating: 0, percentage: 10 },
  { rating: 1, percentage: 30 },
  { rating: 2, percentage: 20 },
  { rating: 3, percentage: 40 },
  { rating: 4, percentage: 60 },
  { rating: 5, percentage: 10 },
];

const getBarHeight = (percentage: number) => {
  return `${percentage}%`;
};

export default function Results() {
  return (
    <main className="flex flex-col min-h-[75vh] mx-auto justify-center items-center w-full p-4">
      <div className="max-w-4xl w-full">
        <h2 className="text-[90px] font-rajdhani text-center font-medium leading-none">
          VOTING RESULTS
        </h2>
      </div>
      <div className="flex justify-center items-end space-x-4 w-full max-w-4xl p-4">
        {ratingsData.map((data) => (
          <div
            className="flex flex-col font-rajdhani font-medium items-center"
            key={data.rating}
          >
            <div className="w-24 h-48 flex flex-col-reverse relative">
              <div className="w-full h-full bg-[#FFF9ED] flex flex-col-reverse">
                <div
                  style={{ height: getBarHeight(data.percentage) }}
                  className="bg-[#FD8B0E]"
                ></div>
                <div className="absolute inset-0 flex justify-center items-start pt-1">
                  <span className="text-black font-bold">{data.rating}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-center text-gray-500">
              {data.percentage}%
            </div>
          </div>
        ))}
      </div>
      <p className="font-lg">
        If you try to vote again with the same QR Code, you won’t be able to do
        so because of your{" "}
        <a
          target={"_blank"}
          rel={"noreferrer"}
          href="https://anon-aadhaar-documentation.vercel.app/docs/quick-setup"
          className="underline"
        >
          nullifier
        </a>
        .
      </p>
    </main>
  );
}
