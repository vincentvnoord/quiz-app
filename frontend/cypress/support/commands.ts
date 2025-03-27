declare namespace Cypress {
    interface Chainable {
        loginOrRegister(email: string, password: string): Chainable<void>;
    }
}

Cypress.Commands.add('loginOrRegister', (email, password) => {
    cy.request({
        method: "POST",
        url: Cypress.env("API_URL") + '/login',
        body: {
            email: email,
            password: password,
        },
        failOnStatusCode: false,
    }).then((response) => {
        if (response.status === 401) {
            cy.request({
                method: "POST",
                url: Cypress.env("API_URL") + '/register',
                body: {
                    email: email,
                    password: password,
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                cy.request({
                    method: "POST",
                    url: Cypress.env("API_URL") + '/login',
                    body: {
                        email: email,
                        password: password,
                    },
                }).then((response) => {
                    const authToken = response.body.token;
                    cy.setCookie('authToken', authToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        path: '/',
                    });
                })
            });

            return;
        }

        const authToken = response.body.token;
        cy.setCookie('authToken', authToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        });
    })
});