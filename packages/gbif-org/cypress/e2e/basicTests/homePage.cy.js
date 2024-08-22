/// <reference types="cypress" />

describe('homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the homepage', () => {
    cy.get('[data-cy="heading"]').should('have.text', 'Free and open access to biodiversity data');
  });
});
