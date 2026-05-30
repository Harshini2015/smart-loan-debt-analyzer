# Smart Loan Analyzer - AI Feature Integration TODO


## Completed
- Verified existing GenAI integration scaffold for fraud, voice, family, emergency fund, and goals.
- Confirmed routes/components/pages exist, but some endpoint paths are mounted under `/api/v2/*`.

## Next Steps
1. Verify fraud-before-transaction flow: find where payments/transactions are created and ensure the fraud check runs before creation/confirmation.
2. Implement missing family ecosystem sub-features (as per spec):
   - Elder Expense Monitor + in-app notifications
   - Education Planning (Claude computes monthly SIP + timeline)
   - Emergency Shared Wallet requests + head approval via one click
3. Upgrade emergency fund panel:
   - Monthly contribution graph (real data, not placeholder)
   - Runway estimate based on saved balance / estimated consumption
4. Add skeleton loaders for all AI calls (voice parse, fraud predict, family dashboard summary, goal timeline, emergency fund AI calculation if any).
5. Confirm graceful fallback when Claude fails.
6. Update `backend/.env.example` to include `ANTHROPIC_API_KEY`.

7. Run end-to-end verification:
   - Start backend
   - Start frontend
   - Verify key routes with browser/manual calls.


