export const PER_PAGE = 15;

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export type Paginated<T> = { rows: T[]; page: number; perPage: number; total: number; pages: number };

export const param = (params: Record<string, string | string[] | undefined>, key: string): string => {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
};

export function pageArgs(params: Record<string, string | string[] | undefined>, perPage = PER_PAGE) {
  const page = Math.max(1, Math.floor(Number(param(params, 'page')) || 1));
  return { page, perPage, skip: (page - 1) * perPage, take: perPage };
}

export const paginated = <T>(rows: T[], total: number, { page, perPage }: { page: number; perPage: number }): Paginated<T> => ({
  rows,
  page,
  perPage,
  total,
  pages: Math.max(1, Math.ceil(total / perPage)),
});
