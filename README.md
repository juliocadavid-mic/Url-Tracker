# eMIC SEO OS

Base SaaS SEO para agencias construida con:

- Next.js App Router + TypeScript
- PostgreSQL + Prisma
- Auth.js
- Tailwind CSS + componentes estilo shadcn/ui
- Inngest para jobs programados
- Google Search Console API
- Serper
- Deploy pensado para Vercel + Neon o Supabase

## Modelo del negocio

La base ya soporta:

- Múltiples agencias
- Múltiples clientes por agencia
- Múltiples proyectos por cliente
- Árbol SEO por proyecto con nodos `PROJECT_ROOT`, `DEPARTMENT`, `CATEGORY`, `SUBCATEGORY` y `URL`
- Asignación de keywords principales y secundarias por URL
- Snapshots diarios de GSC por keyword y URL
- Snapshots diarios de posición real en SERP
- Competidores que rankean por encima del dominio objetivo

## Estructura principal

- `app/`: landing, dashboard, auth y rutas API
- `prisma/schema.prisma`: modelo multi-tenant + histórico SEO
- `lib/clients/`: integraciones con Search Console y Serper
- `lib/inngest/functions.ts`: orquestación del sync diario
- `prisma/seed.ts`: datos demo iniciales

## Setup

1. Instala dependencias:

```bash
npm install
```

2. Crea tu entorno:

```bash
cp .env.example .env
```

3. Genera Prisma y aplica schema:

```bash
npm run db:generate
npm run db:push
```

4. Carga datos demo:

```bash
npm run db:seed
```

5. Levanta Next.js e Inngest:

```bash
npm run dev
npm run inngest:dev
```

## Flujo de sincronización

1. Un proyecto dispara `project/sync.requested`.
2. Inngest carga proyecto, keywords y URLs objetivo.
3. Search Console trae clics, impresiones, CTR y posición media por query + page.
4. Serper consulta la SERP actual por keyword.
5. Se guarda un `KeywordSnapshot` diario.
6. Se registran competidores detectados en top resultados.

## Siguientes pasos recomendados

- CRUD real para agencias, clientes, proyectos, árbol SEO y keywords
- Conexión OAuth por proyecto para Search Console
- Scheduler diario por timezone usando cron de Inngest
- Series temporales y tablas comparativas en dashboard
- Permisos por rol para agencia, analista y cliente final
- Webhooks o alertas cuando un competidor desplace una URL crítica

## Producción recomendada

Para este stack, la ruta más simple es:

- App: Vercel
- Base de datos: Neon o Supabase Postgres
- Jobs: Inngest Cloud
- Dominio: Vercel

Variables importantes:

- `POSTGRES_PRISMA_URL`: conexión pooled para runtime con Prisma
- `POSTGRES_URL_NON_POOLING`: conexión directa para migraciones Prisma
- `AUTH_SECRET`: secreto largo aleatorio
- `AUTH_TRUST_HOST=true`
- `AUTH_URL`: URL pública de producción
- `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET`
- `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL` y `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY`
- `SERPER_API_KEY`
- `INNGEST_EVENT_KEY` y `INNGEST_SIGNING_KEY`

Orden de despliegue:

1. Crear la base de datos gestionada.
2. Configurar variables en Vercel.
3. Ejecutar migraciones Prisma contra `DIRECT_URL`.
4. Desplegar la app en Vercel.
5. Conectar la app con Inngest Cloud y sincronizar funciones.
6. Configurar callbacks OAuth de Google con la URL final.
