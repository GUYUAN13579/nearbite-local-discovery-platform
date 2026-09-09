export type ApiResult<T> = {
  success: boolean;
  data: T;
  errorMsg?: string;
  total?: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4500);
  const token = window.sessionStorage.getItem('xunwei-token');
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json');
  if (token) headers.set('authorization', token);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = (await response.json()) as ApiResult<T>;
    if (!result.success) throw new Error(result.errorMsg || '请求失败');
    return result.data;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function normalizeAsset(path?: string) {
  if (!path) return '/imgs/blogs/4/7/863cc302-d150-420d-a596-b16e9232a1a6.jpg';
  if (path.startsWith('/types/')) return `/imgs${path}`;
  return path;
}
