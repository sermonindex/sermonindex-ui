import type {MetaFunction} from "@remix-run/node";
import {AllSpeakers, FeaturedSpeakers} from "~/components/speakers";
import {FeaturedMessage} from "~/components/featured";

export const meta: MetaFunction = () => {
  return [
    {title: "SermonIndex"},
    {name: "description...", content: "This is a PoC..."},
  ];
};

export default function Index() {
  return (
    <div className="pt-20">{/* The top padding if for the header which is a fixed height */}
      <FeaturedMessage/>
      <FeaturedSpeakers/>
      <AllSpeakers/>
    </div>
  );
}
