import { LoaderFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';

export const loader: LoaderFunction = ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const { A } = params;

  return redirect(`https://sermonindex3.b-cdn.net/give/${A}`);
};

export default function Index() {
  return null;
}
