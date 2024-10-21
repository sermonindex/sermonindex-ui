import { IErrorResponse } from './interfaces';

// TODO: Add SI_API_URL to .env
const SI_API_URL = 'http://localhost:3000';

export async function fetchApi<T>(path: string): Promise<T | IErrorResponse> {
  const response = await fetch(`${SI_API_URL}${path}`);
  const data = (await response.json()) as T;

  if (response.status >= 300) {
    return data as IErrorResponse;
  }
  return data;
}
