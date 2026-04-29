// Runs before the Astro build on Cloudflare Pages (CF_PAGES=1 is set automatically).
// Fails the build immediately if any required runtime env var is missing,
// so a misconfigured deployment is caught at deploy time rather than at first form submission.
if (process.env.CF_PAGES === '1') {
  const required = ['RESEND_API_KEY', 'CONTACT_TO', 'CONTACT_FROM', 'TURNSTILE_SECRET'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
}
