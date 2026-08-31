import fs from 'fs';
import path from 'path';

function generateRulesMatrix() {
  const fixturesDir = path.join(__dirname, '../core/fixtures');
  const targetFile = path.join(fixturesDir, 'regulatoryComplianceRules.ts');
  console.log('Generating Regulatory Compliance Matrix at:', targetFile);

  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * VaultFlow ISO 20022 Financial Regulatory Compliance Rules & Security Matrix');
  lines.push(' */');
  lines.push('');
  lines.push('export interface ComplianceRule {');
  lines.push('  ruleId: string;');
  lines.push('  ruleName: string;');
  lines.push('  standard: string;');
  lines.push('  severity: string;');
  lines.push('  isMandatory: boolean;');
  lines.push('  validationPattern: string;');
  lines.push('  remediationProcedure: string;');
  lines.push('}');
  lines.push('');
  lines.push('export const REGULATORY_COMPLIANCE_RULES: ComplianceRule[] = [');

  const standards = ['PCI-DSS-v4.0', 'PSD2-SCA', 'GDPR-ART-32', 'FINCEN-AML', 'SOX-404', 'BASEL-III', 'ISO-20022-PAIN.001', 'ISO-20022-CAMT.053', 'FATCA', 'CRS'];
  const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  for (let i = 1; i <= 4500; i++) {
    const rId = `RUL-${String(i).padStart(6, '0')}`;
    const std = standards[i % standards.length];
    const sev = severities[i % severities.length];
    const mandatory = i % 2 === 0;
    const pattern = `REGEX_VALIDATE_RULE_${i}_${std.replace(/[^A-Z0-9]/g, '_')}`;
    const rem = `Automated remediation procedure steps for compliance rule ${rId} under standard ${std}. Step 1: Audit payload integrity. Step 2: Validate signatures. Step 3: Log compliance state.`;

    lines.push(`  { ruleId: '${rId}', ruleName: 'Compliance Rule Definition #${i} for ${std}', standard: '${std}', severity: '${sev}', isMandatory: ${mandatory}, validationPattern: '${pattern}', remediationProcedure: '${rem}' },`);
  }

  lines.push('];');
  lines.push('');

  fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
  console.log(`Generated ${lines.length} lines of code in regulatoryComplianceRules.ts`);
}

generateRulesMatrix();
