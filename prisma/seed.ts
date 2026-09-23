import prisma from "../src/models/prisma.ts";
import { DonationPackageType } from "../src/generated/prisma/enums.js";

async function main() {
  console.log("Seeding donation packages...");

  const packages = [
    {
      name: DonationPackageType.KAHNATE_SEMAY,
      amount: 100,
      description: "Kahnate Semay standard package",
    },
    {
      name: DonationPackageType.NATAN,
      amount: 200,
      description: "Natan standard package",
    },
    {
      name: DonationPackageType.SEALILENE_KIDIST,
      amount: 300,
      description: "Sealilene Kidist standard package",
    },
    {
      name: DonationPackageType.ADAM,
      amount: 400,
      description: "Adam standard package",
    },
    {
      name: DonationPackageType.DAWIT,
      amount: 500,
      description: "Dawit standard package",
    },
    {
      name: DonationPackageType.NETSA_FIKAD,
      amount: 0, // 0 or custom amount indicating flexible choice
      description: "Custom / Flexible donation package",
    },
  ];

  for (const pkg of packages) {
    await prisma.donationPackage.upsert({
      where: { name: pkg.name },
      update: {}, // Do nothing if it already exists
      create: {
        name: pkg.name,
        amount: pkg.amount,
        description: pkg.description,
      },
    });
  }

  console.log("✅ Donation packages seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
