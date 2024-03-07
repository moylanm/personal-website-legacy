import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Excerpt } from '../excerpts/types';

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://mylesmoylan.net' }),
	endpoints: builder => ({
		getExcerpts: builder.query<Excerpt[], void>({
			query: () => '/excerpts/json'
		})
	})
});

export const { useGetExcerptsQuery } = apiSlice;
