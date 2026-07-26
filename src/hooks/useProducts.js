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
  } = useGetProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })

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
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
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
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })

  return {
    data,
    isLoading,
    isError,
    error,
  }
}
