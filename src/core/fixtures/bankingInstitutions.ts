/**
 * Global Financial Institutions Directory, SWIFT/Routing Dictionary & Capability Matrix
 */

export interface FinancialInstitution {
  id: string;
  name: string;
  shortName: string;
  routingNumber: string;
  swiftBic: string;
  country: string;
  supportedAccountTypes: string[];
  supportsInstantPayments: boolean;
  supportsOpenBankingAPI: boolean;
  securityRating: string;
  primaryLogoUrl: string;
}

export const FINANCIAL_INSTITUTIONS_DIRECTORY: FinancialInstitution[] = [
  {
    id: 'fi-us-001',
    name: 'Apex Premier Bank & Trust',
    shortName: 'Apex Premier',
    routingNumber: '021000021',
    swiftBic: 'APEXUS33XXX',
    country: 'US',
    supportedAccountTypes: ['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'MORTGAGE'],
    supportsInstantPayments: true,
    supportsOpenBankingAPI: true,
    securityRating: 'AAA',
    primaryLogoUrl: 'https://cdn.vaultflow.demo/logos/apex.png'
  },
  {
    id: 'fi-us-002',
    name: 'Summit Trust & Financial Group',
    shortName: 'Summit Trust',
    routingNumber: '122000496',
    swiftBic: 'SUMMUS66XXX',
    country: 'US',
    supportedAccountTypes: ['CHECKING', 'SAVINGS', 'INVESTMENT', 'LOAN'],
    supportsInstantPayments: true,
    supportsOpenBankingAPI: true,
    securityRating: 'AA+',
    primaryLogoUrl: 'https://cdn.vaultflow.demo/logos/summit.png'
  },
  {
    id: 'fi-us-003',
    name: 'Horizon National Capital',
    shortName: 'Horizon Bank',
    routingNumber: '071000013',
    swiftBic: 'HORIZUS44XXX',
    country: 'US',
    supportedAccountTypes: ['CHECKING', 'CREDIT_CARD'],
    supportsInstantPayments: false,
    supportsOpenBankingAPI: true,
    securityRating: 'AA',
    primaryLogoUrl: 'https://cdn.vaultflow.demo/logos/horizon.png'
  },
  {
    id: 'fi-us-004',
    name: 'Vanguard Group Investment Funds',
    shortName: 'Vanguard',
    routingNumber: '031000053',
    swiftBic: 'VANGUS11XXX',
    country: 'US',
    supportedAccountTypes: ['INVESTMENT'],
    supportsInstantPayments: true,
    supportsOpenBankingAPI: true,
    securityRating: 'AAA',
    primaryLogoUrl: 'https://cdn.vaultflow.demo/logos/vanguard.png'
  },
  {
    id: 'fi-us-005',
    name: 'Fidelity Wealth Management',
    shortName: 'Fidelity',
    routingNumber: '011000015',
    swiftBic: 'FIDUS22XXX',
    country: 'US',
    supportedAccountTypes: ['CHECKING', 'SAVINGS', 'INVESTMENT'],
    supportsInstantPayments: true,
    supportsOpenBankingAPI: true,
    securityRating: 'AAA',
    primaryLogoUrl: 'https://cdn.vaultflow.demo/logos/fidelity.png'
  },
  {
    id: 'fi-uk-001',
    name: 'Barclays International UK',
    shortName: 'Barclays',
    routingNumber: '200000',
    swiftBic: 'BARCGB22XXX',
    country: 'UK',
    supportedAccountTypes: ['CHECKING', 'SAVINGS', 'CREDIT_CARD'],
    supportsInstantPayments: true,
    supportsOpenBankingAPI: true,
    securityRating: 'AA',
    primaryLogoUrl: 'https://cdn.vaultflow.demo/logos/barclays.png'
  },
  {
    id: 'fi-uk-002',
    name: 'HSBC Global Banking Corp',
    shortName: 'HSBC',
    routingNumber: '400515',
    swiftBic: 'MIDLGB22XXX',
    country: 'UK',
    supportedAccountTypes: ['CHECKING', 'SAVINGS', 'INVESTMENT', 'LOAN'],
    supportsInstantPayments: true,
    supportsOpenBankingAPI: true,
    securityRating: 'AA+',
    primaryLogoUrl: 'https://cdn.vaultflow.demo/logos/hsbc.png'
  },
  {
    id: 'fi-eu-001',
    name: 'BNP Paribas European Wealth',
    shortName: 'BNP Paribas',
    routingNumber: '30004',
    swiftBic: 'BNPAFRPPXXX',
    country: 'FR',
    supportedAccountTypes: ['CHECKING', 'SAVINGS', 'MORTGAGE'],
    supportsInstantPayments: true,
    supportsOpenBankingAPI: true,
    securityRating: 'AA',
    primaryLogoUrl: 'https://cdn.vaultflow.demo/logos/bnp.png'
  },
  {
    id: 'fi-eu-002',
    name: 'Deutsche Bank International',
    shortName: 'Deutsche Bank',
    routingNumber: '50070010',
    swiftBic: 'DEUTDEDDXXX',
    country: 'DE',
    supportedAccountTypes: ['CHECKING', 'SAVINGS', 'INVESTMENT'],
    supportsInstantPayments: true,
    supportsOpenBankingAPI: true,
    securityRating: 'AA-',
    primaryLogoUrl: 'https://cdn.vaultflow.demo/logos/db.png'
  }
];

export function generateInstitutionalBranchList(): Array<{ institutionId: string; branchName: string; address: string; city: string; state: string; zip: string }> {
  const branches: Array<{ institutionId: string; branchName: string; address: string; city: string; state: string; zip: string }> = [];
  const cities = [
    { city: 'New York', state: 'NY', zip: '10001' },
    { city: 'Los Angeles', state: 'CA', zip: '90001' },
    { city: 'Chicago', state: 'IL', zip: '60601' },
    { city: 'Houston', state: 'TX', zip: '77001' },
    { city: 'Phoenix', state: 'AZ', zip: '85001' },
    { city: 'San Francisco', state: 'CA', zip: '94101' },
    { city: 'Seattle', state: 'WA', zip: '98101' },
    { city: 'Miami', state: 'FL', zip: '33101' },
    { city: 'Boston', state: 'MA', zip: '02101' }
  ];

  FINANCIAL_INSTITUTIONS_DIRECTORY.forEach(inst => {
    cities.forEach((c, idx) => {
      branches.push({
        institutionId: inst.id,
        branchName: `${inst.shortName} - ${c.city} Downtown Branch #${idx + 101}`,
        address: `${(idx + 1) * 125} Financial Plaza Suite ${(idx + 1) * 200}`,
        city: c.city,
        state: c.state,
        zip: c.zip
      });
    });
  });

  return branches;
}
