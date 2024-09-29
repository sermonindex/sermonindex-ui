import type {MetaFunction} from "@remix-run/node";
import {AllSpeakers, FeaturedSpeakers} from "~/components/speakers";

export const meta: MetaFunction = () => {
  return [
    {title: "SermonIndex"},
    {name: "description...", content: "This is a PoC..."},
  ];
};

export default function Index() {
  return (
    <div>
      <FeaturedSpeakers/>
      <AllSpeakers/>
    </div>
  );
}
