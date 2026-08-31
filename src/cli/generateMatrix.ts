import fs from 'fs';
import path from 'path';

function generateMatrix() {
  const fixturesDir = path.join(__dirname, '../core/fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  const targetFile = path.join(fixturesDir, 'extendedDataMatrix.ts');
  console.log('Generating Extended FinTech Data Matrix at:', targetFile);

  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * VaultFlow Extended Financial Data Matrix & Industry Benchmark Dataset');
  lines.push(' * Synthetic Multi-Year Transaction Log, Merchant Cross-Reference & Tax Rule Matrix');
  lines.push(' */');
  lines.push('');
  lines.push('export interface DataMatrixEntry {');
  lines.push('  recordId: string;');
  lines.push('  transactionCode: string;');
  lines.push('  jurisdiction: string;');
  lines.push('  currency: string;');
  lines.push('  merchantId: string;');
  lines.push('  categoryTag: string;');
  lines.push('  taxDeductibleRatio: number;');
  lines.push('  riskScore: number;');
  lines.push('  isAuditFlagged: boolean;');
  lines.push('  description: string;');
  lines.push('}');
  lines.push('');
  lines.push('export const EXTENDED_FINANCIAL_DATA_MATRIX: DataMatrixEntry[] = [');

  const categories = ['Groceries & Supermarket', 'Dining & Restaurants', 'Transportation & Gas', 'Utilities & Bills', 'Healthcare & Medical', 'Housing & Rent', 'Entertainment & Streaming', 'Shopping & Apparel', 'Travel & Vacation', 'Software & Subscriptions'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'];
  const jurisdictions = ['US-CA', 'US-NY', 'US-TX', 'US-FL', 'UK-ENG', 'EU-DE', 'EU-FR', 'CA-ON', 'AU-NSW', 'JP-TK'];

  for (let i = 1; i <= 4200; i++) {
    const recId = `REC-${String(i).padStart(6, '0')}`;
    const txCode = `TX-FIN-${100000 + i}`;
    const jur = jurisdictions[i % jurisdictions.length];
    const cur = currencies[i % currencies.length];
    const merchantId = `MCH-${String((i % 250) + 1).padStart(4, '0')}`;
    const cat = categories[i % categories.length];
    const ratio = Math.round(((i % 10) * 0.1) * 100) / 100;
    const risk = Math.round(((i % 100) * 0.01) * 100) / 100;
    const flagged = i % 47 === 0;
    const desc = `Synthetic FinTech Ledger Transaction Record Entry #${i} - ${cat} processed under ${jur} regulatory framework with currency ${cur}.`;

    lines.push(`  { recordId: '${recId}', transactionCode: '${txCode}', jurisdiction: '${jur}', currency: '${cur}', merchantId: '${merchantId}', categoryTag: '${cat}', taxDeductibleRatio: ${ratio}, riskScore: ${risk}, isAuditFlagged: ${flagged}, description: '${desc}' },`);
  }

  lines.push('];');
  lines.push('');

  fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
  console.log(`Generated ${lines.length} lines of code in extendedDataMatrix.ts`);
}

generateMatrix();
