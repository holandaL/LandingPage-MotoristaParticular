# Sampaio Motorista Particular

Aplicação web completa para aquisição e registro de corridas particulares em Fortaleza e região.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, TypeScript, Express
- Banco: PostgreSQL com Prisma ORM
- Validação: Zod no frontend e no backend
- Segurança: Helmet, CORS restrito, rate limiting, payload limit, logs e tratamento centralizado de erros
- Integrações: WhatsApp via `wa.me`, GPS via `navigator.geolocation`, mapas via Google Maps API quando configurada

## Configuração

1. Instale dependencias:

```bash
npm install
```

2. Configure `.env` com os dados reais:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sampaio_driver?schema=public
DRIVER_WHATSAPP=55XXXXXXXXXXX
VITE_DRIVER_WHATSAPP=55XXXXXXXXXXX
GOOGLE_MAPS_API_KEY=
```

O número de WhatsApp real não foi inventado. Enquanto ele estiver com o placeholder, a interface informa que a configuração precisa ser preenchida.

3. Prepare o banco:

```bash
npm run db:generate
npm run db:migrate
```

4. Rode a aplicacao:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:4000/api/health`

## Endpoints

- `POST /api/ride-requests`
- `GET /api/ride-requests/:publicId`
- `PATCH /api/ride-requests/:publicId`
- `GET /api/maps/autocomplete`
- `GET /api/maps/places/:placeId`
- `GET /api/maps/reverse-geocode`
- `GET /api/maps/route`

`PATCH` registra `whatsappOpened=true` publicamente. Atualização de `status` exige `x-admin-token`.

## Validação

```bash
npm test
npm run build
```

## Observações de produção

- Troque `FRONTEND_URL` pelo dominio real.
- Troque `ADMIN_TOKEN` por um valor forte.
- Configure `GOOGLE_MAPS_API_KEY` no backend para autocomplete, geocodificacao reversa e rota real.
- Publique o frontend atras de HTTPS, necessario para GPS em navegadores modernos.
- Rode `npm run db:deploy` em ambiente de produção.
