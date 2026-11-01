import "dotenv/config";
import { seedDatabase } from "./seed";

seedDatabase()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
