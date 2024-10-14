import {LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {SermonPlayer} from "~/components/player";
import {StandardHeader} from "~/common/section";

export async function loader({params}: LoaderFunctionArgs) {
  const sermonId = params.id; // Access the 'id' parameter
  console.log(params);

  // todo: Need Caleb's newest changes to fetch the sermon by id
  // const sermonResponse = await fetch(`http://localhost:3000/sermons/id/${sermonId}`, {
  //   headers: {
  //     Authorization: `Bearer ${process.env.API_TOKEN}`,
  //   },
  // });
  // return sermonResponse;

  // todo remove this block that just grabs the featured message
  const featured = await fetch("http://localhost:3000/sermons/featured", {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
  const featuredSermons = await featured.json();

  // todo: need to fetch the speaker bio, icon, etc and add to the loaded data

  return await featuredSermons[0];

}

export default function Component() {
  const sermon: Sermon = useLoaderData<typeof loader>();

  return (<div className={"p-10"}>
      <StandardHeader text={sermon.title}/>
      <div className={"p-2"}>
        <SermonPlayer sermon={sermon}/>
      </div>

      <div className="flex flex-col sm:flex-row items-start justify-center pt-8 space-x-0 sm:space-x-8">
        <div className="flex-grow sm:w-2/3">
          {/* ... Speaker bio ... */}
          <StandardHeader text={"Speaker"}/>
          <div className={"p-4 flex"}>
            <img className="flex-none rounded-lg bg-slate-100"
                 loading={"lazy"}
                 src={sermon.contributor?.imageUrl ?? ""}
                 alt={sermon.contributor?.fullName ?? ""}
            />
            <p className={"text-slate-800 p-4"}>
              Lots of words around the image that describe the life of the speaker
            </p>
          </div>
        </div>
        <div className="flex-grow sm:w-1/3">
          {/* ... Scriptures content ... */}
          <StandardHeader text={"Scriptures"}/>
          <div className={"p-4"}>
            {sermon.bibleReferences.map((reference) => (
              <div key={reference.id} className={"text-slate-800"}>
                {reference.text}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        {/* ... Sermon summary ... */}
        <div className={"pt-8"}>
          <StandardHeader text={"Summary Of Sermon Page"}/>
          <div className={"p-4"}>
            <p className={"text-slate-800"}>
              This is going to be a concise summary of the message
              The fact that this is going to be SEO will be :fire:
            </p>
          </div>
        </div>
        {/* ... Sermon summary ... */}
        <div className={"pt-8"}>
          <StandardHeader text={"Transcription OR Text Sermon"}/>
          <div className={"p-4"}>
            <p className={"text-slate-800"}>
              This is going to be the full transcription of the sermon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
