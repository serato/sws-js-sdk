import Sws from '../../src/index'
import { describe, it } from 'mocha'
import { expect } from 'chai'

const appId = 'myClientAppId'

describe('Slow Tests', function () {
  it(`tests handling timeout on accessing /licenses endpoint`, function () {
    let sws = new Sws({ appId: appId, timeout: 1 })
    return sws.license.getLicenses().then().catch((err) => {
      expect(err.code).to.equal('ECONNABORTED')
    })
  })
})
