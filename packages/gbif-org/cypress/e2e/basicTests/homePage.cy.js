/// <reference types="cypress" />

describe('homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the homepage', () => {
    cy.get('[data-cy="heading"]').should('have.text', 'Pages with a Contentful ID');
  });
});
