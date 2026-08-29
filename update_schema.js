const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

if (!schema.includes('provider String')) {
  schema = schema.replace(/originalId Int/g, 'originalId Int\n  provider   String   @default("PANELSOCIAL")');
  fs.writeFileSync('prisma/schema.prisma', schema);
  console.log("Schema updated.");
} else {
  console.log("Schema already has provider field.");
}
