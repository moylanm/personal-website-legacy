import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: 'https://mylesmoylan.net' }),
	endpoints: builder => ({
		getExcerpts: builder.query({
			query: () => '/excerpts/json'
		})
	})
});

export const { useGetExcerptsQuery } = apiSlice;
