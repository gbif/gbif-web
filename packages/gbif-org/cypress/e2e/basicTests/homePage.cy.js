/// <reference types="cypress" />

describe('homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders a non-empty hero heading', () => {
    cy.get('[data-cy="heading"]').should('be.visible').invoke('text').should('match', /\S/);
  });

  it('renders at least one CMS block below the counts', () => {
    cy.get('[data-cy="homepage-blocks"]').children().its('length').should('be.gte', 1);
  });

  it('renders the map widget', () => {
    cy.get('[data-cy="map-widget"]').scrollIntoView();
    cy.get('[data-cy="map-widget"]').should('be.visible');
  });

  it('does not show a partial-data error toast', () => {
    // Watchdog: fails immediately if the toast appears at any point during the test,
    // even if it auto-dismisses before a normal assertion would catch it.
    cy.shouldNeverAppear('[data-cy="partial-data-error"]');
    // Drive the page enough to give the toast's useEffect a chance to fire.
    cy.get('[data-cy="heading"]').should('be.visible');
    cy.get('[data-cy="homepage-counts"]').should('be.visible');
    cy.get('[data-cy="map-widget"]').should('be.visible');
  });
});
