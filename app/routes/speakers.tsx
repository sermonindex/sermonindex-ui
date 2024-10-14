import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Contributor, ListResponse } from "~/api/interfaces";
import { fetchApi } from "~/api/sdk";
import { SpeakerList } from "~/components/speaker-list";

export async function loader({ params }: LoaderFunctionArgs) {
  const [featured, contributors] = await Promise.all([
    fetchApi<ListResponse<Contributor>>("/contributors/featured"),
    fetchApi<ListResponse<Contributor>>("/contributors"),
  ]);

  if ("statusCode" in featured || "statusCode" in contributors) {
    throw new Response("Oh no! Something went wrong!", {
      status: 500,
    });
  }

  return { featured, contributors };
}

export default function Index() {
  const { featured, contributors } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>("");

  return (
    <div className="flex flex-col space-y-8 pt-6 px-8 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col w-full p-4 bg-white text-black">
        <h1 className="text-2xl pl-4 py-2 bg-gray-300 rounded-lg w-full">
          Featured Speakers
        </h1>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-12 py-4">
          {featured.values.map((contributor, index) => (
            <Link
              to={`/speakers/${contributor.fullName
                .toLowerCase()
                .replace(/ /g, "-")}`}
              key={index}
            >
              <div
                key={index}
                className="flex flex-col items-center m-2 hover:underline"
              >
                <img
                  src={contributor.imageUrl}
                  alt={contributor.fullName}
                  className="w-14 h-14 rounded-full"
                />
                <p className="text-center mt-2 text-sm text-slate-800">
                  {contributor.fullName}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <h1 className="text-2xl pl-4 py-2 bg-gray-300 rounded-lg w-full">
          All Speakers
        </h1>
        <div className="">
          <input
            className="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Find a speaker..."
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            required
          />
          <SpeakerList
            contributors={contributors.values.filter((c) =>
              c.fullName.toLowerCase().includes(filter)
            )}
          />
        </div>
      </div>
    </div>
  );
}
