import { useEffect, useState } from 'react'
import { commerceService } from '../services/commerceApi'

let settingsRequest

const loadSettings = () => {
  if (!settingsRequest) {
    settingsRequest = commerceService.getPublicStoreStatus().catch((error) => {
      throw error
    }).finally(() => {
      settingsRequest = null
    })
  }

  return settingsRequest
}

export const calculateShipping = (settings, items, method = 'standard') => {
  if (!settings || !items.length) return 0

  const totalQuantity = items.reduce(
    (sum, item) => sum + Math.max(0, Number(item.quantity) || 0),
    0
  )
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * Math.max(0, Number(item.quantity) || 0),
    0
  )

  if (method === 'standard' && subtotal >= Number(settings.free_shipping_threshold)) return 0

  const rates = {
    standard: Number(settings.standard_shipping) || 0,
    express: Number(settings.express_shipping) || 0,
    overnight: Number(settings.overnight_shipping) || 0,
  }

  return Number(((rates[method] ?? rates.standard) * totalQuantity).toFixed(2))
}

export const useShippingSettings = () => {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    let active = true

    loadSettings()
      .then((data) => {
        if (active) setSettings(data)
      })
      .catch(() => {})

    return () => { active = false }
  }, [])

  return settings
}
