import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Excerpt } from '../excerpts/types';
import { Request } from '../logs/types';

const csrfToken = () => document.querySelector('input[name="csrf_token"]')!.getAttribute('value')!;

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: 'https://mylesmoylan.net' }),
	endpoints: builder => ({
		getExcerpts: builder.query<Excerpt[], void>({
			query: () => '/excerpts/json',
			transformResponse: (rawResult: { excerpts: Excerpt[] }) => {
				return rawResult.excerpts;
			}
		}),
		getLogs: builder.query<Request[], void>({
			query: () => '/dashboard/request-logs',
			transformResponse: (rawResult: { requests: Request[] }) => {
				return rawResult.requests;
			}
		})
	})
});

export const { useGetExcerptsQuery, useGetLogsQuery } = apiSlice;
