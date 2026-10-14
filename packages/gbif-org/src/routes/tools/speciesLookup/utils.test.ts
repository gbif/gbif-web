import { describe, expect, it } from 'vitest';
import { withPreferredKingdom } from './utils';

describe('withPreferredKingdom', () => {
  it('fills in the chosen kingdom for rows without one', () => {
    const rows = withPreferredKingdom([{ verbatimScientificName: 'Oenanthe' }], 'animalia');
    expect(rows[0].preferedKingdom).toBe('animalia');
  });

  it('keeps a kingdom given in the file', () => {
    const rows = withPreferredKingdom(
      [{ verbatimScientificName: 'Oenanthe', preferedKingdom: 'plantae' }],
      'animalia'
    );
    expect(rows[0].preferedKingdom).toBe('plantae');
  });

  it('leaves rows without a kingdom when none is chosen', () => {
    const rows = withPreferredKingdom([{ verbatimScientificName: 'Oenanthe' }], undefined);
    expect(rows[0].preferedKingdom).toBeUndefined();
  });

  it('does not change the rows passed in', () => {
    const input = [{ verbatimScientificName: 'Oenanthe' }];
    withPreferredKingdom(input, 'animalia');
    expect(input[0]).toEqual({ verbatimScientificName: 'Oenanthe' });
  });
});
