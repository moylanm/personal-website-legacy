import { Excerpt } from "./types";

export const transformExcerptData = (rawData: Excerpt[]): Excerpt[] => {
  return rawData.map(excerpt => ({
    id: excerpt.id,
    author: excerpt.author,
    work: excerpt.work,
    body: excerpt.body
  }));
};

export const extractUniqueAuthors = (excerpts: Excerpt[]): string[] => {
  return [...new Set(excerpts.map(excerpt => excerpt.author))];
};
