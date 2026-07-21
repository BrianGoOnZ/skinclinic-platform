// Comando reutilizable para loguearse sin repetir el flujo en cada test.
// Requiere que exista un usuario Administrador de prueba en la BD
// (ver nota en el primer test sobre credenciales).
Cypress.Commands.add("login", (email, password) => {
  cy.visit("/");
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Login rápido reutilizando las credenciales de admin del cypress.env.json
Cypress.Commands.add("loginAsAdmin", () => {
  cy.login(Cypress.env("ADMIN_EMAIL"), Cypress.env("ADMIN_PASSWORD"));
  cy.contains("DEPILCLINIK").should("be.visible");
});

// Genera un teléfono de 10 dígitos único por corrida, evitando choques
// con el índice unique de la columna phone en Customers/Users.
Cypress.Commands.add("generateUniquePhone", () => {
  const timestamp = Date.now().toString().slice(-9);
  return cy.wrap(`9${timestamp}`);
});
