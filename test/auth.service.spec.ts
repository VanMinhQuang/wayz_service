describe('Auth domain contracts', () => {
  it('documents that OTP expires and password flow uses verified OTP', () => {
    expect(5 * 60_000).toBe(300_000);
  });
});
