import fs from 'fs';
import path from 'path';

function generateUserProfiles() {
  const fixturesDir = path.join(__dirname, '../core/fixtures');
  const targetFile = path.join(fixturesDir, 'syntheticUserProfilesDataset.ts');
  console.log('Generating Synthetic User Profiles Dataset at:', targetFile);

  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * VaultFlow Synthetic Multi-User Demographics & Financial Persona Profiles');
  lines.push(' */');
  lines.push('');
  lines.push('export interface SyntheticPersonaProfile {');
  lines.push('  personaId: string;');
  lines.push('  fullName: string;');
  lines.push('  email: string;');
  lines.push('  age: number;');
  lines.push('  occupation: string;');
  lines.push('  annualIncome: number;');
  lines.push('  creditScore: number;');
  lines.push('  riskTolerance: string;');
  lines.push('  primaryGoal: string;');
  lines.push('  city: string;');
  lines.push('  state: string;');
  lines.push('  country: string;');
  lines.push('}');
  lines.push('');
  lines.push('export const SYNTHETIC_USER_PERSONA_PROFILES: SyntheticPersonaProfile[] = [');

  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const occupations = ['Software Engineer', 'Data Scientist', 'Financial Analyst', 'Marketing Director', 'Product Manager', 'Consultant', 'Architect', 'Sales Executive', 'Accountant', 'Graphic Designer', 'Operations Manager', 'Project Manager'];
  const cities = [{ c: 'New York', s: 'NY' }, { c: 'San Francisco', s: 'CA' }, { c: 'Austin', s: 'TX' }, { c: 'Seattle', s: 'WA' }, { c: 'Chicago', s: 'IL' }, { c: 'Miami', s: 'FL' }, { c: 'Denver', s: 'CO' }, { c: 'Boston', s: 'MA' }, { c: 'Atlanta', s: 'GA' }];
  const risks = ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'VERY_AGGRESSIVE'];
  const goals = ['Retirement Independence', 'Home Ownership', 'Emergency Fund Building', 'Children Education Fund', 'Wealth Preservation', 'Debt Payoff'];

  for (let i = 1; i <= 2500; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const pId = `USR-PER-${String(i).padStart(6, '0')}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@vaultflow.demo`;
    const age = 22 + (i % 45);
    const occ = occupations[i % occupations.length];
    const income = Math.round((45000 + (i * 120) % 250000) * 100) / 100;
    const credit = 580 + (i % 250);
    const risk = risks[i % risks.length];
    const goal = goals[i % goals.length];
    const loc = cities[i % cities.length];

    lines.push(`  { personaId: '${pId}', fullName: '${fn} ${ln}', email: '${email}', age: ${age}, occupation: '${occ}', annualIncome: ${income}, creditScore: ${credit}, riskTolerance: '${risk}', primaryGoal: '${goal}', city: '${loc.c}', state: '${loc.s}', country: 'US' },`);
  }

  lines.push('];');
  lines.push('');

  fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
  console.log(`Generated ${lines.length} lines of code in syntheticUserProfilesDataset.ts`);
}

generateUserProfiles();
