export async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    if (text.trim().startsWith('<')) throw new Error('The server returned an HTML error instead of JSON. Check the terminal for the server error.');
    throw new Error(text || 'The server returned an empty response.');
  }
}
