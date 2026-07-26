import axios from 'axios'
import { API_BASE_URL } from '../constants/config'

const client = (token) => axios.create({
  baseURL: API_BASE_URL,
  headers: { Authorization: `Bearer ${token}` },
})


const cartItem = (item) => ({
  key: String(item.id),
  id: item.product.id,
  cartItemId: item.id,
  title: item.product.title,
  price: item.price,
  image: item.product.image,
  category: item.product.category,
  quantity: item.quantity,
})

const order = (value) => ({
  id: value.order_number,
  orderId: value.id,
  status: value.order_status,
  createdAt: value.created_at,
  items: (value.items || []).map((item) => ({
    key: String(item.id),
    id: item.product.id,
    title: item.product.title,
    image: item.product.image,
    category: item.product.category,
    price: item.price,
    quantity: item.quantity,
  })),
  totals: {
    subtotal: value.subtotal,
    shipping: value.shipping_fee,
    discount: value.discount,
    tax: value.tax,
    total: value.grand_total,
  },
  payment: { method: value.payment_method, status: value.payment_status },
})

const adminProduct = (product) => ({
    id: product.id,
    title: product.title,
    sku: product.sku,
    price: product.price,
    stock: product.stock,
    status: product.status,
    active: product.status === 'ACTIVE',

    category: product.category,
    category_id: product.category_id,

    image: product.image,
    images: product.images,

    description: product.description,
    short_description: product.short_description,
})

export const commerceService = {
  async getCart(token) {
    const response = await client(token).get('/cart')
    return response.data.data.items.map(cartItem)
  },

   async getStoreSettings(token) {

      const response = await client(token).get(
          '/admin/store-settings'
      )

      return response.data.data ?? response.data

  },
  
  async addToCart(token, productId, quantity) {
    await client(token).post('/cart', { product_id: productId, quantity })
    return this.getCart(token)
  },
  async updateCartItem(token, cartItemId, quantity) {
    await client(token).patch(`/cart/${cartItemId}`, { quantity })
    return this.getCart(token)
  },
  async removeCartItem(token, cartItemId) {
    await client(token).delete(`/cart/${cartItemId}`)
    return this.getCart(token)
  },
  async clearCart(token) {
    await client(token).delete('/cart')
  },
  async checkout(

      token,

      paymentMethod,

      shippingAddressId,

      billingAddressId = null,

      shippingMethod = 'standard'

  ) {

      const payload = {

          payment_method: paymentMethod,

          shipping_address_id: shippingAddressId,

          billing_address_id: billingAddressId,

          shipping_method: shippingMethod,

      }

      const response = await client(token).post(

          '/checkout',

          payload

      )

      return order(

          response.data.data?.data ||

          response.data.data

      )

  },

  async createHitPayPayment(token) {
    const response = await client(token).post('/payments/create')
    return response.data
  },
  async getOrders(token) {
    const response = await client(token).get('/orders')
    return response.data.data.map(order)
  },
  async updateProfile(token, data) {
    const response = await client(token).patch('/profile', data)
    return response.data.user?.data || response.data.user
  },
  async getAdminDashboard(token) {
    const response = await client(token).get('/admin/dashboard')
    return response.data
  },

  async getAdminOrders(token) {

      const response = await client(token).get('/admin/orders');

      return response.data.data.map((order) => ({

          id: order.id,                    // <-- database ID
          orderNumber: order.order_number, // <-- display value

          customer: order.customer?.name ?? "",

          email: order.customer?.email ?? "",

          items: order.items?.length ?? 0,

          total: order.grand_total,

          payment: order.payment_method,

          date: order.created_at,

          status: order.order_status.toLowerCase(),

      }));

  },

  async getAdminProducts(token) {
    const response = await client(token).get('/admin/products')
    return response.data.data.map(adminProduct)
  },
  async createAdminProduct(token, payload) {
    const response = await client(token).post('/admin/products', payload)
    return adminProduct(response.data.data)
  },
  async updateAdminProduct(token, id, payload) {
    const response = await client(token).patch(`/admin/products/${id}`, payload)
    return adminProduct(response.data.data)
  },
  async deleteAdminProduct(token, id) {
    await client(token).delete(`/admin/products/${id}`)
  },

  async getStoreSettings(token) {

      const response =
          await client(token).get(
              '/admin/store-settings'
          )

      return response.data.data
  },

  async submitMembershipApplication(payload) {
      const response = await client().post('/membership/apply', payload)
      return response.data
  },

  async getAdminNotifications(token) {
      const response = await client(token).get('/admin/notifications')
      return response.data.data
  },

  async markAdminNotificationRead(token, notificationId) {
      const response = await client(token).patch(
          `/admin/notifications/${notificationId}/read`
      )
      return response.data.data
  },

  async markAllAdminNotificationsRead(token) {
      const response = await client(token).post('/admin/notifications/read-all')
      return response.data.data
  },
  
  async updateStoreSettings(token, payload) {

      const response = await client(token).put(
          '/admin/store-settings',
          payload,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: 'application/json',
              },
          }
      )

      return response.data.data
  },

  async adjustInventory(token, productId, type, quantity) {
    await client(token).post(`/admin/products/${productId}/inventory`, { type, quantity })
  },
  async getAddresses(token) {
    const response = await client(token).get('/addresses')
    return response.data.data
  },
  async createAddress(token, address) {
    const response = await client(token).post('/addresses', address)
    return response.data.data
  },
  async updateAddress(token, id, address) {
    const response = await client(token).patch(`/addresses/${id}`, address)
    return response.data.data
  },
  async deleteAddress(token, id) {
    await client(token).delete(`/addresses/${id}`)
  },
  async setDefaultAddress(token, id) {
    const response = await client(token).patch(`/addresses/${id}/default`)
    return response.data.data
  },
  async uploadProductImages(token, productId, files) {
    if (!files.length) return []
    const formData = new FormData()
    files.forEach(({ file }) => formData.append('images[]', file))
    const response = await client(token).post(`/admin/products/${productId}/images`, formData)
    return response.data.data
  },

  async getAdminCustomers(token) {

      const response = await client(token).get('/admin/customers');

      return response.data.data.map((customer) => ({

          ...customer,

          displayId: customer.display_id,

      }));

  },

    async updateOrderStatus(token, orderId, orderStatus) {

      const response = await client(token).patch(

          `/admin/orders/${orderId}/status`,

          {
              order_status: orderStatus
          }

      );

      return response.data.data;

  },
}
