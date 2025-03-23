import { IErrorResponse } from './interfaces';

// TODO: Add SI_API_URL to .env
const SI_API_URL = 'http://localhost:3000';

export async function fetchApi<T>(
  path: string,
  queries?: Record<string, string | number | undefined | null>,
): Promise<T | IErrorResponse> {
  const url = new URL(`${SI_API_URL}${path}`);

  if (queries) {
    const validQueries = Object.entries(queries).reduce(
      (acc: Record<string, string>, [key, value]) => {
        if (value) {
          acc[key] = String(value);
        }
        return acc;
      },
      {},
    );

    if (Object.keys(validQueries).length > 0) {
      url.search = new URLSearchParams(validQueries).toString();
    }
  }

  const response = await fetch(url.toString());
  const data = (await response.json()) as T;

  if (response.status >= 300) {
    return data as IErrorResponse;
  }
  return data;
}
