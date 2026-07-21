describe("Agenda — Programación de Citas", () => {
  const collaboratorName = Cypress.env("TEST_COLLABORATOR_NAME");

  beforeEach(() => {
    cy.loginAsAdmin();
    cy.get('[data-cy="nav-agenda"]').click();
  });

  it("agenda una cita nueva registrando al cliente en el mismo flujo", () => {
    cy.generateUniquePhone().then((phone) => {
      cy.contains("button", "Nueva Cita").click();
      cy.contains("Nueva Cita").should("be.visible");

      // Marca por defecto: Modelha DK (ya viene seleccionada)
      cy.get('input[placeholder="Busca por nombre o teléfono..."]').type(phone);
      cy.contains("Registrar nuevo cliente").click();

      cy.contains("Registro Rápido").should("be.visible");
      cy.get('input[name="name"]').type("Cliente Agenda Cypress");
      cy.get('input[name="phone"]').clear().type(phone);
      cy.get('input[name="birthdate"]').type("1998-08-08");
      cy.contains("button", "Registrar y Seleccionar").click();

      // De vuelta en el modal de cita, ya con el cliente seleccionado
      cy.get('select[name="serviceId"]')
        .find("option")
        .its("length")
        .should("be.gt", 1);
      cy.get('select[name="serviceId"]').select(1);

      const startTime = new Date();
      startTime.setDate(startTime.getDate() + 7);
      startTime.setHours(10, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(11, 0, 0, 0);

      const toLocalInput = (date) =>
        new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);

      cy.get('input[name="startTime"]').type(toLocalInput(startTime));
      cy.get('input[name="endTime"]').type(toLocalInput(endTime));

      cy.contains("button", "Agendar Cita").click();
      cy.contains("Cita agendada").should("be.visible");
    });
  });

  it("detecta conflicto de horario para el mismo colaborador y permite forzar", () => {
    if (!collaboratorName) {
      throw new Error(
        "Configura TEST_COLLABORATOR_NAME en cypress.env.json antes de correr este test",
      );
    }

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 14);
    baseDate.setHours(15, 0, 0, 0);
    const overlapStart = new Date(baseDate);
    const overlapEnd = new Date(baseDate);
    overlapEnd.setHours(16, 0, 0, 0);

    const toLocalInput = (date) =>
      new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

    const scheduleAppointment = (phone, clientName) => {
      cy.contains("button", "Nueva Cita").click();
      cy.get('input[placeholder="Busca por nombre o teléfono..."]').type(phone);
      cy.contains("Registrar nuevo cliente").click();
      cy.get('input[name="name"]').type(clientName);
      cy.get('input[name="phone"]').clear().type(phone);
      cy.get('input[name="birthdate"]').type("1997-05-05");
      cy.contains("button", "Registrar y Seleccionar").click();

      cy.get('select[name="serviceId"]').select(1);
      cy.get('select[name="userId"]').select(collaboratorName);
      cy.get('input[name="startTime"]').type(toLocalInput(overlapStart));
      cy.get('input[name="endTime"]').type(toLocalInput(overlapEnd));
    };

    // Primera cita: se agenda sin problema
    cy.generateUniquePhone().then((phoneA) => {
      scheduleAppointment(phoneA, "Cliente Conflicto A");
      cy.contains("button", "Agendar Cita").click();
      cy.contains("Cita agendada").should("be.visible");

      // Segunda cita: mismo colaborador, mismo horario → debe chocar
      cy.generateUniquePhone().then((phoneB) => {
        scheduleAppointment(phoneB, "Cliente Conflicto B");
        cy.contains("button", "Agendar Cita").click();

        cy.contains("Conflicto de Horario").should("be.visible");
        cy.contains("Cliente Conflicto A").should("be.visible");

        // El admin puede forzar la reserva a pesar del cruce
        cy.contains("button", "Forzar Reserva").click();
        cy.contains("Cita agendada").should("be.visible");
      });
    });
  });
});
