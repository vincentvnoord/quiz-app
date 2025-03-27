describe('game lobby E2E test', () => {
    let gameLobbyId: string;

    before(() => {
        cy.loginOrRegister("test@example.com", "TestPassword123");
    });

    it('should create game lobby as a logged-in user', () => {
        cy.visit('http://localhost:3000/dashboard');

        cy.get('[data-test="create-game"]').first().click();
        cy.get('[data-test="create-and-terminate"]').first().then(($el) => {
            if ($el.css('pointer-events') !== 'none') {
                cy.wrap($el).click();
            }
        });

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

// ST-2.4
describe('brute force attack test', () => {
    it('should prevent brute force attack', () => {
        cy.visit('http://localhost:3000/');

        for (let i = 0; i < 10; i++) {
            const inputField = cy.get('[data-test="enter-game-pin"]');
            inputField.clear();
            const randomNumber = Math.floor(Math.random() * 1000000);
            inputField.type(randomNumber.toString());
            cy.get('[data-test="join-game"]').click();
        }

        cy.get('[data-test="join-game-error"]').should('have.text', 'Too many tries, please try again later');
    });
});