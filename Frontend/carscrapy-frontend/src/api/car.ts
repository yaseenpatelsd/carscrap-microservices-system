import { api } from './client'
import type { CarPriceRequest, CarPriceResponse, MetalPrice } from '@/types/api'

/** Car-service — /car and /metal. */
export const carApi = {
  /** USER + GUEST — returns the estimate and stores the request. */
  getPrice: (body: CarPriceRequest) =>
    api.post<CarPriceResponse>('/car/get-price', body),

  /** USER + GUEST — re-read one stored request by id. */
  getDetail: (id: number) => api.post<CarPriceResponse>('/car/get-detail', { id }),

  /** All price requests belonging to the caller. */
  allRequests: () => api.list<CarPriceResponse>('/car/all-request'),

  /** Public — current scrap metal rates. */
  getMetalPrice: () => api.get<MetalPrice>('/metal/get-metal-price'),

  /** SUPER_ADMIN — patch any subset of metal rates. */
  changeMetalPrice: (body: Partial<MetalPrice>) =>
    api.patch<MetalPrice>('/metal/change-metal-price', body),
}