import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({
    params,
  }: LoaderFunctionArgs) {
    console.log(params);

    return null;
  }

export default function Index() {
    return <h1>#Sermons by topic Page</h1>;
  }
  