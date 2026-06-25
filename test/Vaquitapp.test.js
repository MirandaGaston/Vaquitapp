const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vaquitapp", function () {
  let vaquitapp;
  let admin, member1, member2, stranger;

  const GROUP_NAME    = "Regalo para el cumple de Sofi";
  const GROUP_DESC    = "Juntamos plata entre amigos para comprarle un regalo sorpresa a Sofi.";
  const GROUP_CAT     = "Regalo";
  const GROUP_GOAL    = 100000n;
  const ADMIN_NICK    = "Mati";
  const MEMBER1_NICK  = "Lau";
  const MEMBER2_NICK  = "Pedro";

  beforeEach(async function () {
    [admin, member1, member2, stranger] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Vaquitapp");
    vaquitapp = await Factory.deploy();
    await vaquitapp.waitForDeployment();
  });

  // ─── Crear grupo ────────────────────────────────────────────────────────────

  describe("createGroup", function () {
    it("crea un grupo y emite GroupCreated", async function () {
      await expect(
        vaquitapp.connect(admin).createGroup(
          GROUP_NAME, GROUP_DESC, true, GROUP_CAT, GROUP_GOAL, ADMIN_NICK
        )
      )
        .to.emit(vaquitapp, "GroupCreated")
        .withArgs(1n, GROUP_NAME, admin.address);

      expect(await vaquitapp.groupCount()).to.equal(1n);
    });

    it("el creador queda como Admin", async function () {
      await vaquitapp.connect(admin).createGroup(
        GROUP_NAME, GROUP_DESC, true, GROUP_CAT, GROUP_GOAL, ADMIN_NICK
      );
      const status = await vaquitapp.getMemberStatus(1n, admin.address);
      expect(status).to.equal(3n); // Admin = 3
    });

    it("getGroup devuelve los datos correctos", async function () {
      await vaquitapp.connect(admin).createGroup(
        GROUP_NAME, GROUP_DESC, true, GROUP_CAT, GROUP_GOAL, ADMIN_NICK
      );
      const g = await vaquitapp.getGroup(1n);
      expect(g.name).to.equal(GROUP_NAME);
      expect(g.category).to.equal(GROUP_CAT);
      expect(g.goal).to.equal(GROUP_GOAL);
      expect(g.admin).to.equal(admin.address);
      expect(g.totalContributed).to.equal(0n);
      expect(g.totalSpent).to.equal(0n);
      expect(g.saldo).to.equal(0n);
    });

    it("agrega el grupo a los grupos del usuario", async function () {
      await vaquitapp.connect(admin).createGroup(
        GROUP_NAME, GROUP_DESC, true, GROUP_CAT, GROUP_GOAL, ADMIN_NICK
      );
      const groups = await vaquitapp.getUserGroups(admin.address);
      expect(groups).to.include(1n);
    });

    it("falla si el nombre está vacío", async function () {
      await expect(
        vaquitapp.connect(admin).createGroup("", GROUP_DESC, true, GROUP_CAT, 0n, ADMIN_NICK)
      ).to.be.revertedWith("El nombre no puede estar vacio");
    });
  });

  // ─── Solicitud de ingreso ────────────────────────────────────────────────────

  describe("requestToJoinGroup", function () {
    beforeEach(async function () {
      await vaquitapp.connect(admin).createGroup(
        GROUP_NAME, GROUP_DESC, true, GROUP_CAT, GROUP_GOAL, ADMIN_NICK
      );
    });

    it("emite JoinRequested y estado queda Pending", async function () {
      await expect(
        vaquitapp.connect(member1).requestToJoinGroup(1n, MEMBER1_NICK)
      )
        .to.emit(vaquitapp, "JoinRequested")
        .withArgs(1n, member1.address, MEMBER1_NICK);

      const status = await vaquitapp.getMemberStatus(1n, member1.address);
      expect(status).to.equal(1n); // Pending = 1
    });

    it("falla si ya es miembro", async function () {
      await vaquitapp.connect(member1).requestToJoinGroup(1n, MEMBER1_NICK);
      await expect(
        vaquitapp.connect(member1).requestToJoinGroup(1n, MEMBER1_NICK)
      ).to.be.revertedWith("Ya sos miembro o tenes una solicitud pendiente");
    });
  });

  // ─── Aprobar miembro ─────────────────────────────────────────────────────────

  describe("approveMember", function () {
    beforeEach(async function () {
      await vaquitapp.connect(admin).createGroup(
        GROUP_NAME, GROUP_DESC, true, GROUP_CAT, GROUP_GOAL, ADMIN_NICK
      );
      await vaquitapp.connect(member1).requestToJoinGroup(1n, MEMBER1_NICK);
    });

    it("el admin aprueba y emite MemberApproved", async function () {
      await expect(
        vaquitapp.connect(admin).approveMember(1n, member1.address)
      )
        .to.emit(vaquitapp, "MemberApproved")
        .withArgs(1n, member1.address);

      const status = await vaquitapp.getMemberStatus(1n, member1.address);
      expect(status).to.equal(2n); // Approved = 2
    });

    it("agrega el grupo a los grupos del miembro aprobado", async function () {
      await vaquitapp.connect(admin).approveMember(1n, member1.address);
      const groups = await vaquitapp.getUserGroups(member1.address);
      expect(groups).to.include(1n);
    });

    it("un no-admin no puede aprobar", async function () {
      await expect(
        vaquitapp.connect(stranger).approveMember(1n, member1.address)
      ).to.be.revertedWith("Solo el administrador puede realizar esta accion");
    });

    it("falla si no hay solicitud pendiente", async function () {
      await expect(
        vaquitapp.connect(admin).approveMember(1n, stranger.address)
      ).to.be.revertedWith("No hay solicitud pendiente para esa direccion");
    });
  });

  // ─── Aportes ──────────────────────────────────────────────────────────────────

  describe("addContribution", function () {
    beforeEach(async function () {
      await vaquitapp.connect(admin).createGroup(
        GROUP_NAME, GROUP_DESC, true, GROUP_CAT, GROUP_GOAL, ADMIN_NICK
      );
      await vaquitapp.connect(member1).requestToJoinGroup(1n, MEMBER1_NICK);
      await vaquitapp.connect(admin).approveMember(1n, member1.address);
    });

    it("un miembro aprobado carga un aporte y emite ContributionAdded", async function () {
      await expect(
        vaquitapp.connect(member1).addContribution(1n, 30000n, "Mi parte", MEMBER1_NICK)
      )
        .to.emit(vaquitapp, "ContributionAdded")
        .withArgs(1n, member1.address, 30000n, "Mi parte");

      const g = await vaquitapp.getGroup(1n);
      expect(g.totalContributed).to.equal(30000n);
    });

    it("el admin también puede aportar", async function () {
      await vaquitapp.connect(admin).addContribution(1n, 10000n, "Arranque", ADMIN_NICK);
      const g = await vaquitapp.getGroup(1n);
      expect(g.totalContributed).to.equal(10000n);
    });

    it("un miembro pendiente no puede aportar", async function () {
      await vaquitapp.connect(member2).requestToJoinGroup(1n, MEMBER2_NICK);
      await expect(
        vaquitapp.connect(member2).addContribution(1n, 5000n, "Test", MEMBER2_NICK)
      ).to.be.revertedWith("Solo miembros aprobados pueden realizar esta accion");
    });

    it("falla con monto cero", async function () {
      await expect(
        vaquitapp.connect(member1).addContribution(1n, 0n, "Vacío", MEMBER1_NICK)
      ).to.be.revertedWith("El monto debe ser mayor a cero");
    });

    it("getGroupContributions devuelve los aportes", async function () {
      await vaquitapp.connect(member1).addContribution(1n, 30000n, "Mi parte", MEMBER1_NICK);
      await vaquitapp.connect(admin).addContribution(1n, 40000n, "La mía", ADMIN_NICK);

      const contribs = await vaquitapp.getGroupContributions(1n);
      expect(contribs.length).to.equal(2);
      expect(contribs[0].amount).to.equal(30000n);
      expect(contribs[1].amount).to.equal(40000n);
    });
  });

  // ─── Gastos ───────────────────────────────────────────────────────────────────

  describe("addExpense", function () {
    beforeEach(async function () {
      await vaquitapp.connect(admin).createGroup(
        GROUP_NAME, GROUP_DESC, true, GROUP_CAT, GROUP_GOAL, ADMIN_NICK
      );
      await vaquitapp.connect(member1).requestToJoinGroup(1n, MEMBER1_NICK);
      await vaquitapp.connect(admin).approveMember(1n, member1.address);
      await vaquitapp.connect(member1).addContribution(1n, 30000n, "Aporte 1", MEMBER1_NICK);
      await vaquitapp.connect(admin).addContribution(1n, 40000n, "Aporte 2", ADMIN_NICK);
    });

    it("el admin carga un gasto y emite ExpenseAdded", async function () {
      await expect(
        vaquitapp.connect(admin).addExpense(1n, 55000n, "Compra del regalo", "Regalo", ADMIN_NICK)
      )
        .to.emit(vaquitapp, "ExpenseAdded")
        .withArgs(1n, admin.address, 55000n, "Compra del regalo");

      const g = await vaquitapp.getGroup(1n);
      expect(g.totalSpent).to.equal(55000n);
      expect(g.saldo).to.equal(15000n); // 70000 - 55000
    });

    it("un miembro no-admin no puede cargar gasto", async function () {
      await expect(
        vaquitapp.connect(member1).addExpense(1n, 10000n, "Gasto no autorizado", "Otros", MEMBER1_NICK)
      ).to.be.revertedWith("Solo el administrador puede realizar esta accion");
    });

    it("falla si el gasto supera el saldo", async function () {
      await expect(
        vaquitapp.connect(admin).addExpense(1n, 80000n, "Demasiado", "Regalo", ADMIN_NICK)
      ).to.be.revertedWith("El gasto supera el saldo disponible");
    });

    it("getGroupExpenses devuelve los gastos", async function () {
      await vaquitapp.connect(admin).addExpense(1n, 55000n, "Compra del regalo", "Regalo", ADMIN_NICK);
      const expenses = await vaquitapp.getGroupExpenses(1n);
      expect(expenses.length).to.equal(1);
      expect(expenses[0].concept).to.equal("Compra del regalo");
      expect(expenses[0].category).to.equal("Regalo");
    });
  });

  // ─── Flujo completo de demo ─────────────────────────────────────────────────

  describe("flujo completo — caso demo 'Regalo para el cumple de Sofi'", function () {
    it("ejecuta el flujo completo y los saldos son correctos", async function () {
      // 1. Crear vaquita
      await vaquitapp.connect(admin).createGroup(
        GROUP_NAME, GROUP_DESC, true, "Regalo", 100000n, "Mati"
      );

      // 2. Solicitar ingreso
      await vaquitapp.connect(member1).requestToJoinGroup(1n, "Lau");
      await vaquitapp.connect(member2).requestToJoinGroup(1n, "Pedro");

      // 3. Admin aprueba a Lau
      await vaquitapp.connect(admin).approveMember(1n, member1.address);

      // 4. Aportes
      await vaquitapp.connect(member1).addContribution(1n, 30000n, "Mi parte", "Lau");
      await vaquitapp.connect(admin).addContribution(1n, 40000n, "La mia", "Mati");

      // Verificar totales parciales
      let g = await vaquitapp.getGroup(1n);
      expect(g.totalContributed).to.equal(70000n);
      expect(g.saldo).to.equal(70000n);

      // 5. Gasto
      await vaquitapp.connect(admin).addExpense(1n, 55000n, "Compra de regalo", "Regalo", "Mati");

      // 6. Verificar saldo final
      g = await vaquitapp.getGroup(1n);
      expect(g.totalContributed).to.equal(70000n);
      expect(g.totalSpent).to.equal(55000n);
      expect(g.saldo).to.equal(15000n);

      // 7. Verificar miembros
      const memberList = await vaquitapp.getGroupMembers(1n);
      const approved = memberList.filter((m) => m.status === 2n || m.status === 3n);
      expect(approved.length).to.equal(2); // admin + lau

      // 8. Verificar grupos del usuario
      const adminGroups  = await vaquitapp.getUserGroups(admin.address);
      const member1Groups = await vaquitapp.getUserGroups(member1.address);
      expect(adminGroups).to.include(1n);
      expect(member1Groups).to.include(1n);
    });
  });
});
