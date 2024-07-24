/// <reference types="cypress" />

const title = 'Ocean Biodiversity Information System (OBIS)';
const path = '/network/2b7c7b4f-4d4f-40d3-94de-c28b6fa054a6';

describe('network page', () => {
  beforeEach(() => {
    cy.visit(path);
  });

  it('renders the title', () => {
    cy.get('[data-cy="network-heading"]').should('have.text', title);
  });

  it('renders the banner', () => {
    // https://glebbahmutov.com/cypress-examples/recipes/image-loaded.html#a-single-image
    cy.get('[data-cy="network-banner"]')
      .should('be.visible')
      .and('have.prop', 'naturalWidth')
      .should('be.greaterThan', 0);
  });

  it('renders the metadata', () => {
    cy.get('[data-cy="network-homepage-link"]')
      .contains('obis.org')
      .should('have.attr', 'href', 'https://obis.org/');

    cy.get('[data-cy="network-occurrence-count"]').contains('59.077.094 occurrences');

    cy.get('[data-cy="network-datset-count"]').contains('2.740 datasets');

    cy.get('[data-cy="network-citation-count"]').contains('1.919 citations');
  });
});
