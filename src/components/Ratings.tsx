import { Dispatch, SetStateAction, FunctionComponent } from "react";

type RatingProps = {
  setRating: Dispatch<SetStateAction<string | undefined>>;
};

export const Ratings: FunctionComponent<RatingProps> = ({ setRating }) => {
  return (
    <div className="flex flex-wrap">
      <div className="flex items-center mr-4">
        <input
          id="0"
          type="radio"
          value="0"
          name="colored-radio"
          className="w-4 h-4  bg-gray-100 border-blue-300 focus:ring-blue-500 focus:ring-2"
          onClick={(e) => setRating((e.target as HTMLInputElement).value)}
        />
        <label
          htmlFor="red-radio"
          className="ml-2 text-sm font-medium text-gray-900 "
        >
          0
        </label>
      </div>
      <div className="flex items-center mr-4">
        <input
          id="1"
          type="radio"
          value="1"
          name="colored-radio"
          className="w-4 h-4  bg-gray-100 border-blue-300 focus:ring-blue-500 focus:ring-2"
          onClick={(e) => setRating((e.target as HTMLInputElement).value)}
        />
        <label
          htmlFor="red-radio"
          className="ml-2 text-sm font-medium text-gray-900 "
        >
          1
        </label>
      </div>
      <div className="flex items-center mr-4">
        <input
          id="2"
          type="radio"
          value="2"
          name="colored-radio"
          className="w-4 h-4  bg-gray-100 border-blue-300 focus:ring-blue-500 focus:ring-2"
          onClick={(e) => setRating((e.target as HTMLInputElement).value)}
        />
        <label
          htmlFor="red-radio"
          className="ml-2 text-sm font-medium text-gray-900 "
        >
          2
        </label>
      </div>
      <div className="flex items-center mr-4">
        <input
          id="3"
          type="radio"
          value="3"
          name="colored-radio"
          className="w-4 h-4  bg-gray-100 border-blue-300 focus:ring-blue-500 focus:ring-2"
          onClick={(e) => setRating((e.target as HTMLInputElement).value)}
        />
        <label
          htmlFor="red-radio"
          className="ml-2 text-sm font-medium text-gray-900 "
        >
          3
        </label>
      </div>
      <div className="flex items-center mr-4">
        <input
          id="4"
          type="radio"
          value="4"
          name="colored-radio"
          className="w-4 h-4  bg-gray-100 border-blue-300 focus:ring-blue-500 focus:ring-2"
          onClick={(e) => setRating((e.target as HTMLInputElement).value)}
        />
        <label
          htmlFor="red-radio"
          className="ml-2 text-sm font-medium text-gray-900 "
        >
          4
        </label>
      </div>
      <div className="flex items-center mr-4">
        <input
          id="5"
          type="radio"
          value="5"
          name="colored-radio"
          className="w-4 h-4  bg-gray-100 border-blue-300 focus:ring-blue-500 focus:ring-2"
          onClick={(e) => setRating((e.target as HTMLInputElement).value)}
        />
        <label
          htmlFor="red-radio"
          className="ml-2 text-sm font-medium text-gray-900 "
        >
          5
        </label>
      </div>
    </div>
  );
};
