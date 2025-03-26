describe('game lobby E2E test', () => {
    let gameLobbyId: string;

    before(() => {
        cy.request('POST', Cypress.env("NEXT_PUBLIC_API_URL") + '/login', {
            email: "test@test.nl",
            password: "testtesttest",
        }).then((response) => {
            expect(response.status).to.eq(200);

            const authToken = response.body.token;

            cy.setCookie('authToken', authToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
            });

            cy.getCookie('authToken').should('exist');
        });
    });

    it('should create game lobby as a logged-in user', () => {
        cy.visit('http://localhost:3000/dashboard');

        cy.get('[data-test="create-game"]').first().click();
        cy.get('[data-test="create-and-terminate"]').should('not.have.css', 'pointer-events', 'none').first().click();

        cy.get('[data-test="game-id"]').should('exist');
        cy.get('[data-test="game-id"]').invoke('text').then((text) => {
            gameLobbyId = text.split(' ').join('');
        });
    });

    // FT-2.1
    it('should join game lobby as an anonymous user', () => {
        cy.visit('http://localhost:3000/' + gameLobbyId);

        cy.get('[data-test="enter-name"]').should('exist');

        cy.get('[data-test="enter-name"]').type('Test user');
        cy.get('[data-test="join-game"]').click();

        cy.get('[data-test="joined-message"]').should('exist');
    });
});
