import prisma from "../src/models/prisma.js";

const packages = [
  { name: "Kahnate Semay", amount: 12 },
  { name: "Natan", amount: 50 },
  { name: "Sealilene Kidist", amount: 64 },
  { name: "Adam", amount: 100 },
  { name: "Dawit", amount: 150 },
  { name: "Netsa Fikad", amount: 0 },
];

async function main() {
  for (const pkg of packages) {
    await prisma.donationPackage.upsert({
      where: { name: pkg.name },
      update: { amount: pkg.amount },
      create: { name: pkg.name, amount: pkg.amount },
    });
  }
  console.log("Seeded donation packages.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());