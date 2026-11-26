/* eslint-env mocha */
import assert from 'assert';
import { VALID_GBIF_ROLES, VOLUNTEER_ROLES } from './validGbifRoles';

describe('public roles', () => {
  it('does not publish administrative contact roles', () => {
    for (const role of ['FUNDING_CONTACT', 'INVOICE_CONTACT', 'FINANCIAL_CONTACT']) {
      assert.strictEqual(VALID_GBIF_ROLES.has(role), false, role);
    }
  });

  it('only lists volunteer roles that are public roles', () => {
    for (const role of VOLUNTEER_ROLES) {
      assert.ok(VALID_GBIF_ROLES.has(role), role);
    }
  });
});
