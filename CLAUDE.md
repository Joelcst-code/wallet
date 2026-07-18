# CLAUDE.md — Pagora

## Qué es este proyecto
Wallet de pagos para Ecuador (estilo Mercado Pago) sobre rieles Solana. El usuario
final NO conoce cripto: se registra con email/teléfono y se le crea una embedded
wallet (Privy) invisible. Saldo mostrado en USD; motor USDC en Solana.
Diferenciador clave: escrow para pagos COD de e-commerce.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Privy (@privy-io/react-auth) — auth email/SMS + embedded Solana wallets
- @solana/web3.js + @solana/spl-token — USDC en devnet (NUNCA mainnet sin pedirlo)
- Postgres + Prisma — perfiles, historial cacheado, estados de escrow
- Zustand para estado global

## Diseño — NO improvisar, usar estos tokens siempre
Dark fintech minimalista, mobile-first (frame 400px max, radius 32px).
--bg:#0E1420 --card:#161E2E --card2:#1C2638 --ink:#F2F5FA --muted:#8A96AB
--accent:#FFD24D --accent-ink:#1A1400 --green:#3EDC97 --red:#FF6B6B
--sol:#9B6DFF --radius:20px
Fuentes: Sora (display/montos/botones, 600-800) + Inter (body, 400-600).
El morado --sol se usa EXCLUSIVAMENTE para elementos del modo cripto.
Focus visible en --accent; respetar prefers-reduced-motion.

## Reglas de producto
- Cero jerga cripto en el modo default: nada de "gas", "firma", "seed", "keypair".
  Se dice "enviar", "saldo", "recargar".
- Toda la UI en español (Ecuador), sentence case, verbos activos, sin filler.
- El botón dice lo que hace: "Enviar ahora" → toast "Enviado con éxito".
- Errores en lenguaje claro con acción sugerida, nunca códigos.
- Montos siempre formateados $X,XXX.XX; en modo cripto mostrar USDC + equivalencia USD.

## Reglas técnicas
- El backend es fee payer: el usuario jamás necesita SOL.
- Secretos solo en .env: PRIVY_APP_ID, RPC_URL, FEE_PAYER_KEY (solo servidor,
  nunca en cliente). Jamás commitear .env ni llaves.
- Devnet por defecto. Cambio a mainnet solo con instrucción explícita mía.
- Escrow v1 es custodial (wallet de tesorería + lógica de servidor); la migración
  a programa Anchor on-chain queda como fase futura — mantener las interfaces
  desacopladas para ese cambio.
- Búsqueda de destinatarios por teléfono resuelve dirección desde la DB, nunca
  pedir al usuario direcciones Solana en el flujo normal.

## Flujo de trabajo
- Un commit por fase/feature, mensajes en español.
- Antes de implementar una fase nueva, mostrar plan breve y esperar mi OK.
- Al terminar una fase, levantar dev server e indicarme qué probar.
- Tests mínimos para lógica de escrow y conversiones de montos.

## Estado actual
- [ ] Fase 1: Scaffold + UI
- [ ] Fase 2: Privy auth + embedded wallets
- [ ] Fase 3: Balance y envíos USDC (devnet)
- [ ] Fase 4: Escrow COD
- [ ] Fase 5: Modo cripto avanzado + conversión
(actualizar checkboxes al completar cada fase)
