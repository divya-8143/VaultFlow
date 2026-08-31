import app from './src/index';
import { Logger } from './src/infrastructure/logger/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  Logger.info(`VaultFlow FinTech Server running at http://localhost:${PORT}`);
});
