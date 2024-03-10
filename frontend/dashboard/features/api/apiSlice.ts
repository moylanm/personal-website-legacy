import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Excerpt } from '../excerpts/types';
import { Request } from '../logs/types';

type PublishForm = {
	author: string;
	work: string;
	body: string;
};

const csrfToken = () => document.querySelector('input[name="csrf_token"]')!.getAttribute('value')!;

export const api = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: 'https://mylesmoylan.net' }),
	endpoints: builder => ({
		getExcerpts: builder.query<Excerpt[], void>({
			query: () => '/excerpts/json',
			transformResponse: (rawResult: { excerpts: Excerpt[] }) => {
				return rawResult.excerpts;
			}
		}),
		publishExcerpt: builder.mutation<Excerpt, PublishForm>({
			query: form => {
				const formData = new FormData();
				formData.append('csrf_token', csrfToken());
				formData.append('author', form.author);
				formData.append('work', form.work);
				formData.append('body', form.body);

				return {
					url: '/excerpts',
					method: 'POST',
					headers: { contentType: 'multipart/form-data' },
					body: formData,
				};
			},
			transformResponse: (rawResult: { excerpt: Excerpt }) => {
				return rawResult.excerpt;
			}
		}),
		updateExcerpt: builder.mutation<Excerpt, Excerpt>({
			query: excerpt => {
				const formData = new FormData();
				formData.append('csrf_token', csrfToken());
				formData.append('author', excerpt.author);
				formData.append('work', excerpt.work);
				formData.append('body', excerpt.body);

				return {
					url: `/excerpts/${excerpt.id}`,
					method: 'PATCH',
					headers: { contentType: 'multipart/form-data' },
					body: formData
				};
			},
			transformResponse: (rawResult: { excerpt: Excerpt }) => {
				return rawResult.excerpt;
			}
		}),
		deleteExcerpt: builder.mutation<number, number>({
			query: id => {
				const formData = new FormData();
				formData.append('csrf_token', csrfToken());

				return {
					url: `/excerpts/${id}`,
					method: 'DELETE',
					headers: { contentType: 'multipart/form-data' },
					body: formData
				};
			},
			transformResponse: (rawResult: { id: number }) => {
				return rawResult.id;
			}
		}),
		getLogs: builder.query<Request[], void>({
			query: () => '/dashboard/request-logs',
			transformResponse: (rawResult: { requests: Request[] }) => {
				return rawResult.requests;
			}
		}),
		clearLogs: builder.mutation<string, void>({
			query: () => {
				const formData = new FormData();
				formData.append('csrf_token', csrfToken());

				return {
					url: '/dashboard/request-logs',
					method: 'POST',
					headers: { contentType: 'multipart/form-data' },
					body: formData
				};
			},
			transformResponse: (rawResult: { message: string }) => {
				return rawResult.message;
			}
		})
	})
});

export const {
	useGetExcerptsQuery,
	usePublishExcerptMutation,
	useUpdateExcerptMutation,
	useDeleteExcerptMutation,
	useGetLogsQuery,
	useClearLogsMutation
} = api;
