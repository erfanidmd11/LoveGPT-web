describe('Phone OTP Verification Flow', () => {
    const phone = '5555555555';
    const otp = '123456';
  
    it('should complete phone OTP flow', () => {
      cy.visit('/onboarding?step=1');
  
      cy.get('input[type="tel"]').should('exist').type(phone);
  
      cy.contains('Send OTP').click();
  
      cy.get('input[placeholder="OTP"]', { timeout: 10000 }).should('exist').type(otp);
  
      cy.contains('Verify OTP').click();
  
      cy.url().should('include', '/onboarding?step=2'); // Update based on actual redirect
    });
  });
  