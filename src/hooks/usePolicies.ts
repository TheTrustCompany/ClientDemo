import { useState, useEffect } from 'react';
import type { Policy } from '../types';

// Mock policies for demo purposes
const mockPolicies: Policy[] = [
  {
    id: '1',
    title: 'Eligibility for Refunds',
    content: `
**Digital Game Purchases**
• Refunds within 14 days if playtime < 2 hours
• Pre-orders refundable anytime before release
• If not downloaded/activated → full refund within 30 days

**DLC / Add-ons**
• Refunds within 14 days if unused or < 2 hours added playtime

**In-Game Purchases**
• Consumables non-refundable once used
• Refunds within 14 days if unused/unredeemed

**Subscriptions / Online Services**
• Refunds within 14 days if unused
• Pro-rated refunds for unused subscription time
    `,
    agreedAt: new Date('2024-01-15'),
    version: '2.1',
  },
  {
    id: '2',
    title: 'Non-Refundable Cases',
    content: `
**The following purchases are not eligible for refunds:**
• Accounts banned for cheating/fraud
• Services already delivered (e.g., coaching completed)
• Games purchased through third-party resellers
• Gift purchases already redeemed by recipient

**Additional Restrictions:**
• Products with evident misuse or violation of terms
• Items purchased during promotional periods with specific no-refund clauses
• Virtual currency that has been partially or fully spent
    `,
    agreedAt: new Date('2024-01-15'),
    version: '2.1',
  },
  {
    id: '3',
    title: 'Technical Issues & Support',
    content: `
**Technical Defect Refunds:**
• Refunds available if the product is unplayable due to technical defects
• Customer must attempt basic troubleshooting as directed by support
• Documentation of technical issues may be required

**Support Requirements:**
• Contact official support within 30 days of purchase
• Provide system specifications and error details
• Allow 48-72 hours for technical resolution attempts
    `,
    agreedAt: new Date('2024-01-15'),
    version: '2.1',
  },
  {
    id: '4',
    title: 'Abuse Prevention Policy',
    content: `
**Refund Abuse Prevention:**
• Repeated refund requests are automatically flagged for review
• Abuse patterns (e.g., finishing short games <2h and refunding) may remove eligibility
• No multiple refund requests for the same product
• Accounts with excessive refund rates may face restrictions

**Fair Use Guidelines:**
• Refund system is designed for legitimate cases only
• Pattern recognition identifies potential abuse
• Appeals process available for disputed restrictions
    `,
    agreedAt: new Date('2024-01-15'),
    version: '2.1',
  },
  {
    id: '5',
    title: 'Refund Process & Timeline',
    content: `
**Processing Details:**
• Refunds go to the original payment method (5–10 business days)
• Requests must be submitted via official support portal only
• Must provide transaction ID, reason, and evidence (if service-related)

**Required Information:**
• Original purchase confirmation or transaction ID
• Detailed reason for refund request
• Supporting evidence for service-related issues
• Account verification may be required

**Timeline Expectations:**
• Initial review: 1-3 business days
• Decision notification: 3-5 business days
• Processing time: 5-10 business days after approval
    `,
    agreedAt: new Date('2024-01-15'),
    version: '2.1',
  },
  {
    id: '6',
    title: 'Regional & Legal Compliance',
    content: `
**Consumer Protection Laws:**
• Local consumer protection laws (EU, UK, US, etc.) override these rules if they provide stronger protections
• Statutory rights are not affected by these policies
• Regional variations may apply based on local regulations

**Specific Regional Provisions:**
• **EU/UK:** 14-day withdrawal period for digital content
• **Australia:** Australian Consumer Law guarantees apply
• **US:** State-specific regulations may provide additional protections
• **Canada:** Provincial consumer protection acts take precedence

**Legal Disclaimer:**
These policies supplement but do not replace your statutory consumer rights under applicable law.
    `,
    agreedAt: new Date('2024-01-15'),
    version: '2.1',
  },
];

export const usePolicies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // Simulate API call
    const loadPolicies = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setPolicies(mockPolicies);
        setError(undefined);
      } catch (err) {
        setError('Failed to load policies');
        console.error('Error loading policies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPolicies();
  }, []);

  return { policies, isLoading, error };
};
