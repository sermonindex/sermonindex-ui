import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { formatDownloads } from "~/common/format-downloads";
import { FeaturedMessage } from "~/components/featured";
import SermonCarousel from "~/components/sermon-carosel";

export const meta: MetaFunction = () => {
  return [
    { title: "SermonIndex" },
    { name: "description...", content: "This is a PoC..." },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  // TODO: Fetch the sermons from the API in parallel (Promise.all or rxjs forkJoin)
  // TODO: handle errors
  const popular = await fetch("http://localhost:3000/sermons/popular", {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
  const popularSermons = await popular.json();

  const recent = await fetch("http://localhost:3000/sermons/recent", {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
  const recentSermons = await recent.json();

  const featured = await fetch("http://localhost:3000/sermons/featured", {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
  const featuredSermons = await featured.json();

  return { popularSermons, recentSermons, featuredSermons };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col space-y-8 pt-6 px-8 min-h-[calc(100vh-80px)]">
      <div className="flex w-full bg-white">
        <FeaturedMessage sermon={data.featuredSermons[0]} />
      </div>

      <SermonCarousel
        title={"Recent Uploads"}
        sermons={data.recentSermons}
        customizer={(sermon) => {
          // TODO: Remove the partial Sermon constriant on the SermonCarousel component
          // TODO: Use a better date library (moment or dayjs)
          const date = new Date(sermon.createdAt as string);
          const prettyDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return <span className="font-thin">{`${prettyDate} `}</span>;
        }}
      />

      <SermonCarousel
        title={"Popular Sermons"}
        sermons={data.popularSermons}
        customizer={(sermon) => (
          <span className="font-thin">{`${formatDownloads(
            sermon.hits
          )} Downloads`}</span>
        )}
      />
    </div>
  );
}
