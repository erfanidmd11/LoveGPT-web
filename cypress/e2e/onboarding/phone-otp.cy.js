// cypress/e2e/phone-otp.cy.js

describe('Firebase Phone OTP Verification Flow', () => {
  const testUsers = [
    { phone: '+15555551111', otp: '123456' },
    { phone: '+15555552222', otp: '123456' },
    { phone: '+15555553333', otp: '123456' },
    { phone: '+15555555555', otp: '123456' },
    { phone: '+15555551234', otp: '123456' },
    { phone: '+15555554444', otp: '123456' }
  ];

  testUsers.forEach(({ phone, otp }) => {
    it(`should verify OTP for ${phone}`, () => {
      cy.visit('/onboarding?step=1');

      cy.get('input[type="tel"]')
        .clear()
        .type(phone);

      cy.contains('Send OTP').click();

      cy.get('input[placeholder="OTP"]', { timeout: 10000 })
        .should('be.visible')
        .type(otp);

      cy.contains('Verify OTP').click();

      cy.url().should('include', '/onboarding?step=2'); // adjust if redirect step changes
    });
  });
});
