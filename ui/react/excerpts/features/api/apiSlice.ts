import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Excerpt } from '../excerpts/types';

export const api = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: 'https://mylesmoylan.net' }),
	endpoints: builder => ({
		getExcerpts: builder.query<Excerpt[], void>({
			query: () => '/excerpts/json',
			transformResponse: (rawResult: { excerpts: Excerpt[] }) => {
				return rawResult.excerpts;
			}
		})
	})
});

export const { useGetExcerptsQuery } = api;
