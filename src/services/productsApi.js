import { apiSlice } from './api'

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/products',
      transformResponse: (response) => response.data,
      providesTags: [{ type: 'Products', id: 'LIST' }],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => response.data ?? response,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getCategories: builder.query({
      query: () => '/categories',
      transformResponse: (response) => response.data,
      providesTags: ['Categories'],
    }),
    getCategory: builder.query({
      query: (slug) => `/categories/${encodeURIComponent(slug)}`,
      transformResponse: (response) => response.data ?? response,
      providesTags: (result, error, slug) => [{ type: 'Categories', id: slug }],
    }),
    getProductsByCategory: builder.query({
      query: (category) => `/products/category/${encodeURIComponent(category)}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, category) => [
        { type: 'Products', id: `CATEGORY_${category}` },
      ],
    }),
    getLimitedProducts: builder.query({
      query: ({ limit = 8 } = {}) => `/products?sort=price_asc`,
      transformResponse: (response, meta, { limit } = {}) => response.data.slice(0, limit || 8),
      providesTags: [{ type: 'Products', id: 'LIMITED' }],
    }),
    searchProducts: builder.query({
      query: (query) => `/products/search?q=${encodeURIComponent(query)}`,
      transformResponse: (response) => response.data,
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetProductsByCategoryQuery,
  useGetLimitedProductsQuery,
  useSearchProductsQuery,
} = productsApiSlice
