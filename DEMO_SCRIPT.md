# 🎬 Guion de Demo — Vaquitapp

> Duración estimada: 5-8 minutos  
> Caso: "Regalo para el cumple de Sofi"

---

## Antes de empezar (preparación)

- [ ] Hardhat node corriendo en terminal 1: `npx hardhat node`
- [ ] Contrato desplegado: `npm run deploy`
- [ ] Frontend corriendo: `cd frontend && npm run dev`
- [ ] MetaMask con red Hardhat (1337) y cuentas #0 y #1 importadas
- [ ] Navegador en http://localhost:3000
- [ ] Zoom/pantalla en 125% para que se vea bien en proyector

---

## PASO 1 — Landing Page

**Acción:** Mostrá la pantalla inicial.

**Decir:**
> "Esta es Vaquitapp. La app arranca con una pantalla limpia que solo te pide conectar tu wallet. Sin email, sin contraseña, sin redes sociales. Tu identidad es tu wallet."

**Acción:** Clic en "Conectar MetaMask" → MetaMask pide aprobación → aprobá.

---

## PASO 2 — Crear perfil (cuenta Admin: Mati)

**Acción:** Se abre la pantalla de perfil.

**Decir:**
> "La primera vez que entrás, te pedimos un apodo y un avatar. Este perfil se guarda localmente — la dirección de wallet es tu identidad en la blockchain."

**Acción:** Elegí avatar 🦊, escribí apodo "Mati", guardá.

---

## PASO 3 — Crear la vaquita

**Acción:** Clic en "Nueva vaquita".

**Decir:**
> "Creamos una vaquita para juntar plata para el regalo de Sofi."

**Acción:** Completá el formulario:
- Nombre: "Regalo para el cumple de Sofi 🎁"
- Descripción: "Juntamos plata entre amigos para comprarle un regalo sorpresa a Sofi."
- Categoría: Regalo
- Tipo: Pública
- Objetivo: 100000

**Acción:** Clic "Crear vaquita" → MetaMask pide confirmar → confirmá.

**Decir:**
> "Esto ejecuta la función `createGroup` en el contrato Solidity. La transacción genera un evento `GroupCreated` en la blockchain local de Hardhat."

**Esperar:** Confirmación → redirección al detalle.

---

## PASO 4 — Ver el detalle (como admin)

**Decir:**
> "El creador queda automáticamente como administrador. Ven el badge 'Admin' al lado del nombre. El saldo arranca en cero porque nadie aportó todavía."

**Señalar:** Stats de aportado/gastado/saldo.  
**Señalar:** Sección de historial (vacía por ahora).  
**Señalar:** Botones "Aportar" y "Cargar gasto" visibles solo para el admin/miembro.

---

## PASO 5 — Simular segundo usuario (Lau)

**Acción:** Abrí MetaMask → cambiá a cuenta #1.

**Decir:**
> "Ahora simulo ser otro usuario. En una presentación real, esto lo haría otra persona desde su propia compu."

**Acción:** Recargá la página → conectar → crear perfil "Lau", avatar 🐻.

**Acción:** Ir a http://localhost:3000/vaquita/1

**Decir:**
> "Lau no es miembro todavía. Ve el botón 'Solicitar unirme'. Al hacer clic, se ejecuta `requestToJoinGroup` en el contrato."

**Acción:** Clic "Solicitar unirme" → confirmá en MetaMask.

---

## PASO 6 — Volver a admin (Mati) y aprobar

**Acción:** MetaMask → volver a cuenta #0 → recargar.

**Decir:**
> "El admin recibe la solicitud. Solo él puede aprobar. Esto ejecuta `approveMember` en el contrato."

**Acción:** En la sección Miembros → "⏳ Solicitudes pendientes" → clic "✅ Aprobar" → confirmá.

---

## PASO 7 — Cargar aportes

**Acción (como Lau, cuenta #1):** Recargar → "💚 Aportar" → VAQ$ 30.000 → nota "Mi parte 💜" → confirmar.

**Decir:**
> "Lau aporta VAQ$ 30.000. Esto llama a `addContribution` en el contrato. El monto es lógico, no ETH real."

**Acción (como Mati, cuenta #0):** "💚 Aportar" → VAQ$ 40.000 → nota "La mía + la de Sofi" → confirmar.

**Señalar:** El total aportado se actualiza: VAQ$ 70.000.

---

## PASO 8 — Cargar gasto

**Acción (como Mati, cuenta #0):** Clic "💸 Cargar gasto":
- Concepto: "Compra del regalo"
- Monto: 55.000
- Categoría: Regalo

**Decir:**
> "Solo el admin puede registrar gastos. El contrato valida que el gasto no supere el saldo disponible. Si pongo más de VAQ$ 70.000, la transacción va a fallar con un error de Solidity."

**Acción:** Confirmá en MetaMask.

---

## PASO 9 — Mostrar historial y saldo final

**Señalar:** Stats finales:
- Aportado: VAQ$ 70.000
- Gastado: VAQ$ 55.000  
- Saldo: VAQ$ 15.000

**Señalar:** Historial con todos los movimientos ordenados por fecha.

**Decir:**
> "Cada movimiento tiene wallet, apodo, monto, timestamp y está registrado como evento en la blockchain. Es inmutable y auditable. Cualquiera puede verificarlo."

**Señalar:** El bloque de "Registros en Blockchain" al pie del detalle.

---

## PASO 10 — Cierre técnico (30 segundos)

**Señalar:** Panel técnico al final de la página.

**Decir:**
> "El contrato está en la red local de Hardhat. En producción iría en una red pública como Sepolia o Polygon. Los eventos quedan en la cadena para siempre: `GroupCreated`, `ContributionAdded`, `ExpenseAdded`."

---

## Si algo falla — Plan B

Si MetaMask o Hardhat fallan durante la demo:
1. Ir a `http://localhost:3000`
2. Clic en "Entrar en modo demo"
3. Todo el flujo es navegable con datos mock precargados
4. La UI es idéntica — solo no hay transacciones reales

---

## Preguntas frecuentes que pueden surgir

**¿Por qué blockchain si no hay dinero real?**
> La blockchain actúa como registro inmutable y transparente. Nadie puede alterar el historial. Es el equivalente digital de un cuaderno compartido que nadie puede borrar.

**¿Por qué Hardhat y no Ethereum real?**
> Para la demo usamos una blockchain local para no depender de internet ni gas real. En producción usaríamos Sepolia (testnet) o Polygon (bajo costo).

**¿Cómo se identifica el usuario?**
> Por la dirección de su wallet. No hay usuario/contraseña. La firma criptográfica garantiza que solo vos podés hacer transacciones desde tu wallet.
