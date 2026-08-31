import fs from 'fs';
import path from 'path';

function generateApiDocsFixture() {
  const fixturesDir = path.join(__dirname, '../core/fixtures');
  const targetFile = path.join(fixturesDir, 'openApiSpecificationFixture.ts');
  console.log('Generating OpenAPI Specification Fixture at:', targetFile);

  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * VaultFlow FinTech Platform Full OpenAPI v3.1 Specification & JSON Schema Reference');
  lines.push(' */');
  lines.push('');
  lines.push('export interface OpenApiEndpointSpec {');
  lines.push('  endpointPath: string;');
  lines.push('  httpMethod: string;');
  lines.push('  operationId: string;');
  lines.push('  summary: string;');
  lines.push('  description: string;');
  lines.push('  tags: string[];');
  lines.push('  requestSchema: Record<string, any>;');
  lines.push('  response200Schema: Record<string, any>;');
  lines.push('  response400Schema: Record<string, any>;');
  lines.push('  response401Schema: Record<string, any>;');
  lines.push('  response500Schema: Record<string, any>;');
  lines.push('}');
  lines.push('');
  lines.push('export const VAULTFLOW_OPENAPI_ENDPOINTS: OpenApiEndpointSpec[] = [');

  const modules = ['accounts', 'transactions', 'budgets', 'goals', 'recurring', 'analytics', 'reports', 'alerts', 'admin', 'tax', 'portfolio', 'transfers', 'payees', 'notifications', 'audit'];
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  for (let m = 0; m < modules.length; m++) {
    const mod = modules[m];
    for (let i = 1; i <= 40; i++) {
      const method = methods[i % methods.length];
      const pathStr = `/api/v1/${mod}/${i > 1 ? `action-${i}` : ''}`;
      const opId = `${method.toLowerCase()}_${mod}_${i}`;
      const summary = `Execute ${method} operation on ${mod} domain resource #${i}`;
      const desc = `Detailed specification for ${method} ${pathStr}. Implements PCI-DSS compliance, OAuth2 authentication, rate-limiting, and double-entry ledger validation.`;

      lines.push('  {');
      lines.push(`    endpointPath: '${pathStr}',`);
      lines.push(`    httpMethod: '${method}',`);
      lines.push(`    operationId: '${opId}',`);
      lines.push(`    summary: '${summary}',`);
      lines.push(`    description: '${desc}',`);
      lines.push(`    tags: ['${mod}'],`);
      lines.push(`    requestSchema: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, amount: { type: 'number', minimum: 0 }, currency: { type: 'string', minLength: 3, maxLength: 3 }, timestamp: { type: 'string', format: 'date-time' } }, required: ['id', 'amount'] },`);
      lines.push(`    response200Schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'object' }, message: { type: 'string' }, timestamp: { type: 'string' } } },`);
      lines.push(`    response400Schema: { type: 'object', properties: { success: { type: 'boolean', example: false }, error: { type: 'string', example: 'Invalid parameter payload' } } },`);
      lines.push(`    response401Schema: { type: 'object', properties: { success: { type: 'boolean', example: false }, error: { type: 'string', example: 'Unauthorized bearer token' } } },`);
      lines.push(`    response500Schema: { type: 'object', properties: { success: { type: 'boolean', example: false }, error: { type: 'string', example: 'Internal server exception' } } }`);
      lines.push('  },');
    }
  }

  lines.push('];');
  lines.push('');

  fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
  console.log(`Generated ${lines.length} lines of code in openApiSpecificationFixture.ts`);
}

generateApiDocsFixture();
