import type { ApiOrder } from '#shared/types/account'
import { requireUser } from '../../utils/mock-auth'
import { orderDetail } from '../../utils/mock-orders'
import { useMockState } from '../../utils/mock-state'

// GET /api/orders/{number} — one order, for a deep link to a single order.
export default defineEventHandler((event): ApiOrder => {
  const user = requireUser(event)
  const number = getRouterParam(event, 'number') ?? ''
  const order = (useMockState().orders.get(user.id) ?? []).find(
    (candidate) => candidate.number === number,
  )

  if (!order) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Order not found' })
  }

  return orderDetail(order)
})
