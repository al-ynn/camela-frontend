import {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductsByCategoryQuery,
} from '../services/productsApi'

export const useProducts = () => {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useGetProductsQuery()

  return {
    data,
    isLoading,
    isError,
    error,
  }
}

export const useProductsByCategory = (category) => {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useGetProductsByCategoryQuery(category, {
    skip: !category,
  })

  return {
    data,
    isLoading,
    isError,
    error,
  }
}

export const useProduct = (id) => {
  const {
    data = null,
    isLoading,
    isError,
    error,
  } = useGetProductQuery(id, {
    skip: !id,
  })

  return {
    data,
    isLoading,
    isError,
    error,
  }
}