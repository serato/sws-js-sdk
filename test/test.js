import SwsClient from '../src/index'
import { describe, it } from 'mocha'
import assert from 'assert'

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.strict.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
