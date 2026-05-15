const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function assetPath(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE_PATH}${path}`;
}
