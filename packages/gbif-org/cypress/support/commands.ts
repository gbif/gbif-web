/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Install a DOM watchdog that fails the test if any element matching `selector`
       * appears at any point for the rest of the test. Useful for transient UI like
       * toasts that auto-dismiss before a normal `should('not.exist')` could detect
       * them. Call after `cy.visit()`.
       */
      shouldNeverAppear(selector: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('shouldNeverAppear', (selector: string) => {
  cy.window({ log: false }).then((win) => {
    const fail = () => {
      throw new Error(`Watchdog: element matching "${selector}" appeared during the test`);
    };
    if (win.document.querySelector(selector)) fail();
    const observer = new win.MutationObserver(() => {
      if (win.document.querySelector(selector)) fail();
    });
    observer.observe(win.document.body, { childList: true, subtree: true });
  });
});