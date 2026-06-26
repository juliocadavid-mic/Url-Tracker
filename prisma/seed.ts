import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const agency = await prisma.agency.upsert({
    where: { slug: "agencia-demo" },
    update: {},
    create: {
      name: "Agencia Demo",
      slug: "agencia-demo"
    }
  });

  const client = await prisma.client.upsert({
    where: {
      agencyId_slug: {
        agencyId: agency.id,
        slug: "tienda-demo"
      }
    },
    update: {},
    create: {
      agencyId: agency.id,
      name: "Tienda Demo",
      slug: "tienda-demo"
    }
  });

  const project = await prisma.project.upsert({
    where: {
      clientId_slug: {
        clientId: client.id,
        slug: "ecommerce-demo"
      }
    },
    update: {},
    create: {
      clientId: client.id,
      name: "eCommerce Demo",
      slug: "ecommerce-demo",
      type: "ECOMMERCE",
      primaryDomain: "https://www.tiendademo.com",
      gscPropertyUrl: "sc-domain:tiendademo.com"
    }
  });

  const root = await prisma.seoNode.upsert({
    where: {
      projectId_fullPath: {
        projectId: project.id,
        fullPath: "/"
      }
    },
    update: {},
    create: {
      projectId: project.id,
      type: "PROJECT_ROOT",
      name: "Home",
      slug: "home",
      fullPath: "/",
      url: "https://www.tiendademo.com"
    }
  });

  const department = await prisma.seoNode.upsert({
    where: {
      projectId_fullPath: {
        projectId: project.id,
        fullPath: "/hombre"
      }
    },
    update: {},
    create: {
      projectId: project.id,
      parentId: root.id,
      type: "DEPARTMENT",
      name: "Hombre",
      slug: "hombre",
      fullPath: "/hombre",
      url: "https://www.tiendademo.com/hombre"
    }
  });

  const category = await prisma.seoNode.upsert({
    where: {
      projectId_fullPath: {
        projectId: project.id,
        fullPath: "/hombre/zapatos"
      }
    },
    update: {},
    create: {
      projectId: project.id,
      parentId: department.id,
      type: "CATEGORY",
      name: "Zapatos",
      slug: "zapatos",
      fullPath: "/hombre/zapatos",
      url: "https://www.tiendademo.com/hombre/zapatos"
    }
  });

  const keyword = await prisma.keyword.upsert({
    where: {
      projectId_normalizedTerm_localeCountry_localeLanguage: {
        projectId: project.id,
        normalizedTerm: "zapatos para hombre",
        localeCountry: "co",
        localeLanguage: "es"
      }
    },
    update: {},
    create: {
      projectId: project.id,
      term: "zapatos para hombre",
      normalizedTerm: "zapatos para hombre",
      intent: "TRANSACTIONAL"
    }
  });

  await prisma.keywordTarget.upsert({
    where: {
      keywordId_seoNodeId_priority: {
        keywordId: keyword.id,
        seoNodeId: category.id,
        priority: "PRIMARY"
      }
    },
    update: {},
    create: {
      keywordId: keyword.id,
      seoNodeId: category.id,
      priority: "PRIMARY"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
