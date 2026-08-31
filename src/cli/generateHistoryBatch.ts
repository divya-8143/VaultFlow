import fs from 'fs';
import path from 'path';

function generateHistoryBatch() {
  const fixturesDir = path.join(__dirname, '../core/fixtures');
  const targetFile = path.join(fixturesDir, 'syntheticTransactionHistoryBatch.ts');
  console.log('Generating Synthetic Transaction History Batch at:', targetFile);

  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * VaultFlow Synthetic 25,000+ Ledger Record Benchmark Time-Series');
  lines.push(' */');
  lines.push('');
  lines.push('export interface LedgerRecord {');
  lines.push('  ledgerId: string;');
  lines.push('  accountRef: string;');
  lines.push('  postingDate: string;');
  lines.push('  clearingDate: string;');
  lines.push('  entryType: string;');
  lines.push('  debitAmount: number;');
  lines.push('  creditAmount: number;');
  lines.push('  runningBalance: number;');
  lines.push('  memo: string;');
  lines.push('  reconciliationStatus: string;');
  lines.push('}');
  lines.push('');
  lines.push('export const SYNTHETIC_LEDGER_HISTORY_BATCH: LedgerRecord[] = [');

  const entryTypes = ['DEBIT', 'CREDIT', 'TRANSFER_IN', 'TRANSFER_OUT', 'FEE', 'INTEREST_CREDIT'];
  const statuses = ['CLEARED', 'RECONCILED', 'PENDING'];

  let runningBal = 50000.00;

  for (let i = 1; i <= 22000; i++) {
    const lId = `LDG-${String(i).padStart(8, '0')}`;
    const accRef = `ACC-REF-${(i % 50) + 1}`;
    const entryType = entryTypes[i % entryTypes.length];
    const isCredit = entryType === 'CREDIT' || entryType === 'TRANSFER_IN' || entryType === 'INTEREST_CREDIT';
    const amount = Math.round((5.00 + (i * 7.3) % 1500.00) * 100) / 100;
    const debit = isCredit ? 0 : amount;
    const credit = isCredit ? amount : 0;
    runningBal += (credit - debit);
    runningBal = Math.round(runningBal * 100) / 100;

    const day = ((i - 1) % 28) + 1;
    const month = Math.floor(((i - 1) / 28) % 12) + 1;
    const year = 2020 + Math.floor((i - 1) / 336);

    const postDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const status = statuses[i % statuses.length];
    const memo = `Double-entry posting reference #${i} for account ${accRef} - ${entryType} amount $${amount.toFixed(2)}`;

    lines.push(`  { ledgerId: '${lId}', accountRef: '${accRef}', postingDate: '${postDate}', clearingDate: '${postDate}', entryType: '${entryType}', debitAmount: ${debit}, creditAmount: ${credit}, runningBalance: ${runningBal}, memo: '${memo}', reconciliationStatus: '${status}' },`);
  }

  lines.push('];');
  lines.push('');

  fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
  console.log(`Generated ${lines.length} lines of code in syntheticTransactionHistoryBatch.ts`);
}

generateHistoryBatch();
