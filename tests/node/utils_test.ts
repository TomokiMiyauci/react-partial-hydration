import { isServer } from '@/utils'

describe('isServer', () => {
  it('should be true', () => {
    expect(isServer).toBeTruthy()
  })
})
