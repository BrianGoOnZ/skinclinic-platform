describe("Autenticación", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("muestra el formulario de login por defecto", () => {
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("Iniciar Sesión").should("be.visible");
  });

  it("muestra un error con credenciales inválidas", () => {
    cy.get('input[type="email"]').type("no-existe@skinclinic.com");
    cy.get('input[type="password"]').type("passwordIncorrecto");
    cy.get('button[type="submit"]').click();

    cy.contains("Credenciales inválidas").should("be.visible");
  });

  it("permite iniciar sesión con credenciales válidas de Administrador", () => {
    cy.get('input[type="email"]').type(Cypress.env("ADMIN_EMAIL"));
    cy.get('input[type="password"]').type(Cypress.env("ADMIN_PASSWORD"));
    cy.get('button[type="submit"]').click();

    // Tras login exitoso debe desaparecer el form y mostrar el layout del dashboard
    cy.contains("DEPILCLINIK").should("be.visible");
    cy.get('input[type="password"]').should("not.exist");
  });
});
