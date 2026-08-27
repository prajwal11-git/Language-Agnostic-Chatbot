type UnauthorizedHandler = () => Promise<string | null>;

let getAccessToken: () => string | null = () => null;
let onUnauthorized: UnauthorizedHandler | null = null;

export const configureApiClient = (config: {
  getToken: () => string | null;
  handleUnauthorized: UnauthorizedHandler;
}) => {
  getAccessToken = config.getToken;
  onUnauthorized = config.handleUnauthorized;
};

type ApiCallOptions = RequestInit & {
  token?: string;
  _retried?: boolean;
};

export async function apiCall(url: string, options: ApiCallOptions = {}) {
  const { token, _retried = false, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});

  const accessToken = token ?? getAccessToken();
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && !_retried && onUnauthorized) {
    const newToken = await onUnauthorized();
    if (newToken) {
      return apiCall(url, { ...options, _retried: true, token: newToken });
    }
  }

  return response;
}
