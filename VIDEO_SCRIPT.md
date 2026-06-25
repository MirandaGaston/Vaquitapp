# 🎥 Guion para Video — Vaquitapp (1-2 minutos)

---

## Estructura del video

**Duración total:** 90 segundos  
**Formato:** Screenshare + voz en off  
**Herramienta sugerida:** OBS Studio o Loom  
**Voz:** ElevenLabs (español rioplatense)

**Perfiles del demo:**
- 👑 **Alejo** — Admin (Cuenta #0 Hardhat)
- 👤 **Pedro** — Miembro (Cuenta #1 Hardhat)
- 👤 **Matias** — Miembro (Cuenta #2 Hardhat)

---

## ESCENA 1 — Presentación (0:00 - 0:10)

**Pantalla:** Landing de Vaquitapp

**Voz:**
> "Vaquitapp: la forma más transparente y divertida de organizar gastos grupales usando blockchain."

---

## ESCENA 2 — Conectar wallet y crear perfil de Alejo (0:10 - 0:20)

**Pantalla:** Clic en "Conectar MetaMask" → pantalla de perfil → elegir avatar → escribir "Alejo" → guardar

**Voz:**
> "Sin email, sin contraseña. La identidad es la wallet. Alejo elige su apodo y ya está dentro."

---

## ESCENA 3 — Crear la vaquita (0:20 - 0:35)

**Pantalla:** Nueva vaquita → completar formulario → clic crear → MetaMask confirma → modal "Transacción confirmada"

**Voz:**
> "Alejo crea la vaquita 'Regalo para el cumple de Sofi'. Al confirmar, se ejecuta `createGroup` en el contrato Solidity. El evento queda grabado en blockchain."

---

## ESCENA 4 — Pedro solicita unirse (0:35 - 0:48)

**Pantalla:** Cambiar a cuenta Pedro en MetaMask → app redirige a landing → conectar → crear perfil "Pedro" → ir a la vaquita → clic "Solicitar unirme" → MetaMask confirma

**Voz:**
> "Pedro entra con su wallet, ve la vaquita pública y solicita unirse. La solicitud queda pendiente hasta que Alejo la apruebe."

---

## ESCENA 5 — Matias solicita unirse (0:48 - 0:58)

**Pantalla:** Cambiar a cuenta Matias → conectar → crear perfil "Matias" → ir a la vaquita → clic "Solicitar unirme"

**Voz:**
> "Matias hace lo mismo. El admin puede ver todas las solicitudes pendientes en el panel de miembros."

---

## ESCENA 6 — Alejo aprueba a los dos (0:58 - 1:10)

**Pantalla:** Volver a Alejo → ver solicitudes pendientes de Pedro y Matias → aprobar a los dos → badges actualizados

**Voz:**
> "Alejo aprueba a Pedro y a Matias. La función `approveMember` actualiza el estado en el contrato. Ahora pueden aportar."

---

## ESCENA 7 — Aportes (1:10 - 1:22)

**Pantalla:** Pedro aporta VAQ$ 30.000 → Matias aporta VAQ$ 20.000 → Alejo aporta VAQ$ 20.000 → saldo actualizado a VAQ$ 70.000

**Voz:**
> "Pedro, Matias y Alejo cargan sus aportes. Cada uno firma la transacción con su wallet. El total aportado se actualiza en tiempo real."

---

## ESCENA 8 — Gasto (1:22 - 1:32)

**Pantalla:** Alejo carga gasto "Compra del regalo" VAQ$ 55.000 → saldo baja a VAQ$ 15.000

**Voz:**
> "Alejo registra el gasto. El contrato valida que no supere el saldo disponible. Aportado: VAQ$ 70.000. Gastado: VAQ$ 55.000. Saldo: VAQ$ 15.000."

---

## ESCENA 9 — Historial (1:32 - 1:42)

**Pantalla:** Scroll al historial → movimientos de Alejo, Pedro y Matias con wallets, montos y timestamps

**Voz:**
> "El historial es transparente e inmutable. Tres wallets distintas, cada movimiento firmado. Nadie puede borrar ni modificar nada."

---

## ESCENA 10 — Cierre (1:42 - 1:50)

**Pantalla:** Panel blockchain al final → logo Vaquitapp

**Voz:**
> "Vaquitapp demuestra que blockchain puede hacer más transparentes las interacciones grupales cotidianas. Sin bancos, sin apps de terceros. Solo código, wallets y consenso. 🐄"

---

## Tips para grabar

- Resolución mínima 1280×720
- Acelerá al 1.5x las esperas de MetaMask en edición
- Agregá texto en pantalla cuando aparezcan los nombres de eventos: `GroupCreated`, `ContributionAdded`, `ExpenseAdded`
- Si algo falla en vivo, tenés el **Modo Demo** como respaldo — los datos mock son idénticos visualmente
- Grabá primero el flujo completo sin voz, después grabás el audio por separado y lo sincronizás
