describe("Gestión de Clientes", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.get('[data-cy="nav-clientes"]').click();
    cy.contains("Directorio de Clientes").should("be.visible");
  });

  it("crea un nuevo cliente correctamente", () => {
    cy.generateUniquePhone().then((phone) => {
      const uniqueEmail = `test.${phone}@skinclinic.com`;

      cy.contains("button", "Nuevo Cliente").click();
      cy.contains("Registrar Nuevo Cliente").should("be.visible");

      cy.get('input[name="name"]').type("Cliente De Prueba Cypress");
      cy.get('input[name="phone"]').type(phone);
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="birthdate"]').type("1995-06-15");
      cy.get('select[name="gender"]').select("M");

      cy.contains("button", "Guardar Cliente").click();

      // SweetAlert de éxito
      cy.contains("Cliente registrado").should("be.visible");

      // El modal se cierra y el cliente aparece en la tabla
      cy.contains("Cliente De Prueba Cypress").should("be.visible");
    });
  });

  it("rechaza un teléfono duplicado con mensaje de error claro", () => {
    cy.generateUniquePhone().then((phone) => {
      const email1 = `dup1.${phone}@skinclinic.com`;
      const email2 = `dup2.${phone}@skinclinic.com`;

      // Primer registro
      cy.contains("button", "Nuevo Cliente").click();
      cy.get('input[name="name"]').type("Cliente Original");
      cy.get('input[name="phone"]').type(phone);
      cy.get('input[name="email"]').type(email1);
      cy.get('input[name="birthdate"]').type("1990-01-01");
      cy.get('select[name="gender"]').select("H");
      cy.contains("button", "Guardar Cliente").click();
      cy.contains("Ya existe un cliente registrado").should("be.visible");

      // Segundo registro con el mismo teléfono
      cy.contains("button", "Nuevo Cliente").click();
      cy.get('input[name="name"]').type("Cliente Duplicado");
      cy.get('input[name="phone"]').type(phone);
      cy.get('input[name="email"]').type(email2);
      cy.get('input[name="birthdate"]').type("1992-03-20");
      cy.get('select[name="gender"]').select("H");
      cy.contains("button", "Guardar Cliente").click();

      cy.contains("El teléfono ya está registrado").should("be.visible");
    });
  });
});
