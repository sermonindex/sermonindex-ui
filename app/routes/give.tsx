import { LoaderFunction, redirect } from '@remix-run/node';

export const loader: LoaderFunction = () => {
  return redirect('/md/support'); // or '/md/support' for absolute path
};

export default function Index() {
  return null;
}
