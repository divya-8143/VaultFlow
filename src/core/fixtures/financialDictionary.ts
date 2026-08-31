/**
 * FinTech Regulatory & Financial Dictionary Reference Glossary
 */

export interface DictionaryEntry {
  term: string;
  category: 'REGULATORY' | 'ACCOUNTING' | 'INVESTMENT' | 'BANKING' | 'TAXATION';
  definition: string;
  acronym?: string;
  regulatoryStandard?: string;
}

export const FINTECH_GLOSSARY: DictionaryEntry[] = [
  {
    term: 'Annual Percentage Yield',
    acronym: 'APY',
    category: 'BANKING',
    definition: 'The real rate of return earned on a savings deposit taking into account the effect of compounding interest over a full calendar year.'
  },
  {
    term: 'Annual Percentage Rate',
    acronym: 'APR',
    category: 'BANKING',
    definition: 'The annualized cost of borrowing money expressed as a percentage rate charged on balances, excluding compounding interest.'
  },
  {
    term: 'Double-Entry Bookkeeping',
    category: 'ACCOUNTING',
    definition: 'A fundamental accounting principle where every financial transaction has equal and opposite effects in at least two different ledger accounts (Debit and Credit).'
  },
  {
    term: 'Payment Card Industry Data Security Standard',
    acronym: 'PCI-DSS',
    category: 'REGULATORY',
    regulatoryStandard: 'PCI Security Standards Council v4.0',
    definition: 'An information security standard for entities that handle branded credit cards from major card schemes.'
  },
  {
    term: 'Revised Payment Services Directive',
    acronym: 'PSD2',
    category: 'REGULATORY',
    regulatoryStandard: 'European Union Directive 2015/2366',
    definition: 'EU regulatory framework mandating open banking APIs and Strong Customer Authentication (SCA) for payment transactions.'
  },
  {
    term: 'General Data Protection Regulation',
    acronym: 'GDPR',
    category: 'REGULATORY',
    regulatoryStandard: 'EU Regulation 2016/679',
    definition: 'Legal framework setting guidelines for the collection and processing of personal information from individuals who live in the European Economic Area.'
  },
  {
    term: 'Monte Carlo Simulation',
    category: 'INVESTMENT',
    definition: 'A computational algorithm that uses repeated random sampling to project portfolio performance under volatile financial market conditions.'
  },
  {
    term: 'Capital Gains Harvester',
    category: 'TAXATION',
    definition: 'A financial strategy involving selling assets at a loss to offset capital gains tax liability accrued from profitable investments.'
  },
  {
    term: 'Envelope Budgeting System',
    category: 'ACCOUNTING',
    definition: 'A zero-based budgeting strategy where income is allocated into distinct categorical envelopes to enforce strict monthly spending caps.'
  },
  {
    term: 'Know Your Customer',
    acronym: 'KYC',
    category: 'REGULATORY',
    regulatoryStandard: 'FinCEN Anti-Money Laundering Rules',
    definition: 'Mandatory verification process to confirm identity, assess suitability, and prevent illegal money laundering.'
  }
];

export function lookupTerm(termOrAcronym: string): DictionaryEntry | undefined {
  const clean = termOrAcronym.toLowerCase().trim();
  return FINTECH_GLOSSARY.find(e => e.term.toLowerCase() === clean || (e.acronym && e.acronym.toLowerCase() === clean));
}
