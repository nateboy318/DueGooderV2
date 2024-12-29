type FetcherParams = string | [string, string];
type FetcherError = {
  message: string;
  error: Error;
};

export const fetcher = <T>(
  params: FetcherParams,
  ...args: RequestInit[]
): Promise<T> => {
  let url: string;
  let queryString: string | undefined;
  if (typeof params === "string") {
    url = params;
  } else {
    url = params[0];
    queryString = params[1] || undefined;
  }

  return new Promise<T>(async (resolve, reject) => {
    const response = await fetch(
      `${url}${queryString ? "?" + queryString : ""}`,
      ...args
    ).catch((error: Error) => {
      reject({
        message: error?.message,
        error: error,
      } as FetcherError);
      return null;
    });
    
    if (!response) {
      return;
    }
    
    if (response.ok) {
      const data = await response.json();
      resolve(data as T);
      return;
    }
    
    const errorResponse = await response.text();
    reject(errorResponse);
  });
};
