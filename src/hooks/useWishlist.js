import { useDispatch, useSelector } from 'react-redux'
import {
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
  selectWishlistItems,
  selectWishlistCount,
  selectIsInWishlist,
} from '../features/wishlist/wishlistSlice'

export const useWishlist = (productId) => {
  const dispatch = useDispatch()
  const items = useSelector(selectWishlistItems)
  const count = useSelector(selectWishlistCount)
  const isInWishlist = useSelector(productId ? selectIsInWishlist(productId) : () => false)

  const handleToggleWishlist = (product) => dispatch(toggleWishlist(product))
  const handleRemoveFromWishlist = (id) => dispatch(removeFromWishlist(id))
  const handleClearWishlist = () => dispatch(clearWishlist())

  return {
    items,
    count,
    isInWishlist,
    toggleWishlist: handleToggleWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    clearWishlist: handleClearWishlist,
  }
}
