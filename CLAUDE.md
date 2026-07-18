# Proyecto: Pagora — Wallet de pagos para Ecuador (rieles Solana)

## Contexto
Wallet tipo Mercado Pago para Ecuador. El usuario NO sabe de cripto: se registra con
email/teléfono y por debajo se le crea una embedded wallet de Solana (Privy). El saldo
se muestra en USD; el motor es USDC/USDT en Solana. Dos modos: fiat-only (default) y
modo cripto activable (toggle). Caso de uso estrella: escrow para pagos COD de
e-commerce (liberación de fondos al confirmar entrega vía courier).

## Stack
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind
- Auth + embedded wallets: Privy SDK (@privy-io/react-auth) con login por email y SMS OTP,
  creación automática de wallet Solana al registrarse
- Blockchain: @solana/web3.js + @solana/spl-token (USDC devnet primero)
- Backend: API routes de Next.js + Postgres (Prisma) para perfiles, historial cacheado
  y estados de escrow
- Fee payer: backend paga el gas (el usuario nunca ve SOL)

## Diseño (respetar EXACTAMENTE estos tokens)
Estética: fintech minimalista dark, "azul noche pacífico + amarillo cóndor".
Mobile-first, app enmarcada max-width 400px estilo teléfono, esquinas 32px.

CSS variables:
--bg:#0E1420; --card:#161E2E; --card2:#1C2638; --ink:#F2F5FA; --muted:#8A96AB;
--accent:#FFD24D; --accent-ink:#1A1400; --green:#3EDC97; --red:#FF6B6B;
--sol:#9B6DFF; --radius:20px;

Tipografías (Google Fonts): Sora (display: logo, montos, títulos, botones primarios,
weights 600-800, letter-spacing negativo en montos grandes) + Inter (body/UI, 400-600).

Componentes clave:
- Header: logo "pagora" (la sílaba "go" en --accent) + avatar circular con gradiente
  amarillo→naranja e iniciales
- Balance: label uppercase pequeño en --muted, monto 44px Sora 800, centavos en 24px --muted
- Grid de 4 acciones: botones card con ícono en cuadrado 38px redondeado; acción
  primaria "Enviar" con ícono fondo --accent, resto fondo --card2 con ícono --accent;
  hover translateY(-2px)
- Tarjeta cripto (solo visible con toggle ON): gradiente #231A3E→#161E2E, borde
  rgba(155,109,255,.35), tag "◎ Solana · USDC" en --sol, saldo USDC + equivalencia USD,
  botones "Convertir" (fondo --sol) y "Enviar on-chain" (ghost)
- Lista de movimientos: filas con ícono circular 40px, nombre + subtítulo, monto Sora 700
  (entradas en --green con "+", salidas en --ink con "−"), divisores rgba(255,255,255,.05)
- Toggle "Modo cripto" fijo al pie: switch que en ON usa --sol, muestra/oculta la
  tarjeta cripto con animación fade+slide 300ms
- Envío: bottom sheet (radius 28px arriba) con campos "Celular o alias" y "Monto (USD)",
  botón primario --accent full-width, animación slide-up 250ms
- Toasts de confirmación: pill verde arriba centrado, "✓ mensaje", 2.2s
- Focus visible outline --accent en todo; respetar prefers-reduced-motion

## Fases de implementación (en orden, commits separados por fase)

### Fase 1 — Scaffold + UI
1. Setup Next.js + Tailwind con los tokens de arriba como theme
2. Construir las pantallas: Home (balance, acciones, movimientos, toggle),
   bottom sheet de envío, tarjeta cripto
3. Estado global con Zustand; datos mock

### Fase 2 — Auth + embedded wallet
1. Integrar Privy: login email/SMS, config para crear Solana wallet automáticamente
   en el primer login (createOnLogin: 'users-without-wallets')
2. Guardar en Postgres: userId de Privy, teléfono, dirección pública Solana
3. Pantalla de onboarding: nombre + cédula (solo formato, sin verificación aún)

### Fase 3 — Saldo y envíos on-chain (devnet)
1. Leer balance de USDC (SPL token) de la wallet del usuario y mostrarlo como USD
2. Envío P2P: buscar destinatario por teléfono en la DB → resolver su dirección →
   transferencia SPL firmada vía Privy, con backend como fee payer
3. Historial: leer transacciones del token account + cachear en Postgres
4. Faucet interno de devnet para pruebas ("Recargar" acredita USDC de prueba)

### Fase 4 — Escrow COD (el diferenciador)
1. Modelo de datos: orden {comprador, vendedor, monto, estado: bloqueado/liberado/
   disputado, deadline}
2. v1 pragmática: escrow custodial — los fondos van a una wallet de tesorería del
   backend y se liberan por lógica de servidor (webhook de courier o confirmación
   del comprador, auto-liberación a las 72h del "entregado")
3. Pantallas: crear cobro con escrow (vendedor), pagar con garantía (comprador),
   estado del envío con timeline
4. Dejar la interfaz preparada para migrar a programa Anchor on-chain después

### Fase 5 — Conversión y modo cripto avanzado
1. Toggle cripto: mostrar dirección real, QR para recibir, envío a direcciones externas
2. Módulo "Convertir": simulación de on-ramp con spread configurable
   (ej. $10 → 9.60 USDC) dejando la integración real (tesorería/MoonPay) como TODO

## Reglas
- Nunca mostrar jerga cripto en el modo default (nada de "gas", "firma", "keypair")
- Todos los textos de UI en español (Ecuador), sentence case, verbos activos
- Manejar errores con mensajes claros, no códigos
- Variables sensibles en .env (PRIVY_APP_ID, RPC_URL, FEE_PAYER_KEY solo backend)
- Empezar en devnet; nada de mainnet hasta que yo lo pida
