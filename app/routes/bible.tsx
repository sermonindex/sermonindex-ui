import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  // Dynamical routing -> name

  const apiUrl = "http://localhost:3000/creators/details?fullName=Zac%20Poonen";
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  const speaker = await res.json();


  return speaker;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data);

  return (
  <>
    <img src={data.imageUrl}></img>
    <h1>#Bible Page</h1>
  </>);
}
