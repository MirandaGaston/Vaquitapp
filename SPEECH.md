# 🎤 Discurso Oral — Vaquitapp

> Duración: 2-3 minutos  
> Tono: natural, universitario, claro

---

## Versión completa (3 minutos)

---

Buenos días / buenas tardes.

Hoy les presento **Vaquitapp**: una aplicación web para organizar gastos grupales de forma transparente y divertida, con blockchain como respaldo tecnológico.

---

**¿Qué problema resuelve?**

Todos conocemos la situación: un grupo organiza una vaquita para el regalo de un amigo, para el asado del viernes, para el viaje de fin de año. Y siempre pasa lo mismo: "¿quién puso qué?", "¿cuánto gastamos?", "¿me podés mostrar el recibo?".

Vaquitapp resuelve eso con un historial transparente que no lo puede modificar nadie. Ni el organizador, ni el que cobró, ni nadie.

---

**¿Cómo funciona?**

Un usuario conecta su wallet de MetaMask — sin email, sin contraseña. La identidad en Vaquitapp es tu dirección blockchain.

Desde ahí puede crear una vaquita — un grupo digital con nombre, descripción, categoría y objetivo.

El creador es el administrador. Puede aprobar a quienes soliciten unirse, cargar gastos y ver los saldos en tiempo real.

Los miembros aprobados pueden cargar sus aportes.

Todo queda registrado en un smart contract: un programa en Solidity que corre en la blockchain y que nadie puede alterar.

---

**¿Por qué blockchain?**

La clave es la **inmutabilidad y la transparencia**.

Cuando Lau aporta VAQ$ 30.000, se genera un evento `ContributionAdded` en la cadena. Cuando Mati registra el gasto del regalo, se genera `ExpenseAdded`. Esos eventos son públicos, auditables y permanentes.

No hace falta confiar en el organizador: el historial habla solo.

---

**¿Qué tecnologías usamos?**

- **Solidity** para el smart contract con validaciones de roles y saldo
- **Hardhat** como entorno de desarrollo blockchain local
- **ethers.js** para conectar el frontend al contrato
- **Next.js** y **Tailwind CSS** para la interfaz
- **MetaMask** como wallet del usuario

Los montos son ficticios — la app no mueve dinero real. Esto es un prototipo que demuestra el concepto.

---

**¿Qué mostramos hoy?**

El flujo completo:
1. Conectar wallet
2. Crear perfil con apodo
3. Crear la vaquita "Regalo para el cumple de Sofi"
4. Solicitar ingreso como nuevo miembro
5. Aprobación por el admin
6. Cargar aportes de distintos miembros
7. Registrar un gasto
8. Ver el saldo actualizado y el historial transparente

---

**¿Qué mejoras futuras podría tener?**

Si continuáramos el proyecto, agregaríamos:
- Invitaciones por link o código QR
- Despliegue en red pública como Polygon o Sepolia
- Sistema de votación para aprobar gastos grandes
- Notificaciones en tiempo real con eventos de la cadena

---

Para terminar: Vaquitapp es un ejemplo de cómo la tecnología blockchain puede resolver problemas cotidianos concretos, sin complejidad innecesaria para el usuario.

El usuario no necesita saber qué es un contrato inteligente para usarlo. Solo conecta su wallet, y la transparencia viene sola.

Gracias.

---

## Versión corta (90 segundos)

Hoy presentamos Vaquitapp, una app para organizar vaquitas digitales grupales usando blockchain como registro transparente.

El problema es conocido: cuando un grupo junta plata, siempre hay desconfianza sobre quién puso qué y cuánto se gastó. Vaquitapp resuelve eso con un historial inmutable en blockchain.

El usuario conecta su wallet de MetaMask, crea una vaquita, invita a sus amigos, cargan aportes y gastos — y todo queda registrado en un contrato Solidity en Hardhat local.

Usamos Next.js para el frontend, ethers.js para la conexión con el contrato, y Tailwind para los estilos. Los montos son ficticios, VAQ$, no hay dinero real.

La demo muestra el flujo completo: crear vaquita, solicitar ingreso, aprobar miembro, cargar aportes y gastos, y ver el historial transparente.

Gracias.
