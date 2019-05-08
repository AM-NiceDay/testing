describe("ping", () => {
  it("pong", () => {
    cy.visit("localhost")
      .get(".App")
      .should("have.text", "Hello world");
  });
});
