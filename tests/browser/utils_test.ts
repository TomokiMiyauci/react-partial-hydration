import { isServer } from '@/utils'
describe('isServer', () => {
  it('should be false', () => {
    expect(isServer).toBeFalsy()
  })
})
