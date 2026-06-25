// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Vaquitapp
 * @notice Contrato general para gestionar vaquitas digitales grupales.
 *         NO maneja dinero real. Los montos son lógicos (VAQ$).
 */
contract Vaquitapp {

    // ─── Tipos ────────────────────────────────────────────────────────────────

    enum MemberStatus { None, Pending, Approved, Admin }

    struct Group {
        uint256 id;
        string  name;
        string  description;
        bool    isPublic;
        string  category;
        uint256 goal;           // monto objetivo (VAQ$), 0 = sin objetivo
        address admin;
        uint256 totalContributed;
        uint256 totalSpent;
        uint256 createdAt;
        bool    exists;
    }

    struct Member {
        address wallet;
        string  nickname;
        MemberStatus status;
        uint256 joinedAt;
    }

    struct Contribution {
        uint256 id;
        address contributor;
        string  nickname;
        uint256 amount;
        string  note;
        uint256 timestamp;
    }

    struct Expense {
        uint256 id;
        address recorder;
        string  nickname;
        uint256 amount;
        string  concept;
        string  category;
        uint256 timestamp;
    }

    // ─── Estado ───────────────────────────────────────────────────────────────

    uint256 public groupCount;

    mapping(uint256 => Group)                          public groups;
    mapping(uint256 => mapping(address => Member))     public members;
    mapping(uint256 => address[])                      private memberAddresses;
    mapping(uint256 => Contribution[])                 private contributions;
    mapping(uint256 => Expense[])                      private expenses;
    mapping(address => uint256[])                      private userGroups;

    // ─── Eventos ──────────────────────────────────────────────────────────────

    event GroupCreated(uint256 indexed groupId, string name, address indexed admin);
    event JoinRequested(uint256 indexed groupId, address indexed requester, string nickname);
    event MemberApproved(uint256 indexed groupId, address indexed member);
    event ContributionAdded(uint256 indexed groupId, address indexed contributor, uint256 amount, string note);
    event ExpenseAdded(uint256 indexed groupId, address indexed recorder, uint256 amount, string concept);

    // ─── Modificadores ────────────────────────────────────────────────────────

    modifier groupExists(uint256 groupId) {
        require(groups[groupId].exists, "Vaquita no existe");
        _;
    }

    modifier onlyAdmin(uint256 groupId) {
        require(
            members[groupId][msg.sender].status == MemberStatus.Admin,
            "Solo el administrador puede realizar esta accion"
        );
        _;
    }

    modifier onlyMember(uint256 groupId) {
        MemberStatus s = members[groupId][msg.sender].status;
        require(
            s == MemberStatus.Approved || s == MemberStatus.Admin,
            "Solo miembros aprobados pueden realizar esta accion"
        );
        _;
    }

    // ─── Escritura ────────────────────────────────────────────────────────────

    /**
     * @notice Crea una nueva vaquita. El creador queda como administrador.
     */
    function createGroup(
        string memory name,
        string memory description,
        bool          isPublic,
        string memory category,
        uint256       goal,
        string memory adminNickname
    ) external returns (uint256) {
        require(bytes(name).length > 0,     "El nombre no puede estar vacio");
        require(bytes(category).length > 0, "La categoria no puede estar vacia");

        groupCount++;
        uint256 id = groupCount;

        groups[id] = Group({
            id:               id,
            name:             name,
            description:      description,
            isPublic:         isPublic,
            category:         category,
            goal:             goal,
            admin:            msg.sender,
            totalContributed: 0,
            totalSpent:       0,
            createdAt:        block.timestamp,
            exists:           true
        });

        members[id][msg.sender] = Member({
            wallet:    msg.sender,
            nickname:  adminNickname,
            status:    MemberStatus.Admin,
            joinedAt:  block.timestamp
        });

        memberAddresses[id].push(msg.sender);
        userGroups[msg.sender].push(id);

        emit GroupCreated(id, name, msg.sender);
        return id;
    }

    /**
     * @notice El administrador puede editar nombre y descripción de la vaquita.
     */
    function updateGroup(
        uint256       groupId,
        string memory name,
        string memory description
    ) external groupExists(groupId) onlyAdmin(groupId) {
        require(bytes(name).length > 0, "El nombre no puede estar vacio");
        groups[groupId].name        = name;
        groups[groupId].description = description;
    }

    /**
     * @notice Solicita unirse a una vaquita. Queda en estado Pending.
     */
    function requestToJoinGroup(
        uint256       groupId,
        string memory nickname
    ) external groupExists(groupId) {
        require(
            members[groupId][msg.sender].status == MemberStatus.None,
            "Ya sos miembro o tenes una solicitud pendiente"
        );

        members[groupId][msg.sender] = Member({
            wallet:    msg.sender,
            nickname:  nickname,
            status:    MemberStatus.Pending,
            joinedAt:  0
        });

        memberAddresses[groupId].push(msg.sender);

        emit JoinRequested(groupId, msg.sender, nickname);
    }

    /**
     * @notice El administrador aprueba a un miembro pendiente.
     */
    function approveMember(
        uint256 groupId,
        address memberAddress
    ) external groupExists(groupId) onlyAdmin(groupId) {
        require(
            members[groupId][memberAddress].status == MemberStatus.Pending,
            "No hay solicitud pendiente para esa direccion"
        );

        members[groupId][memberAddress].status   = MemberStatus.Approved;
        members[groupId][memberAddress].joinedAt = block.timestamp;

        userGroups[memberAddress].push(groupId);

        emit MemberApproved(groupId, memberAddress);
    }

    /**
     * @notice Un miembro aprobado carga un aporte (monto en VAQ$).
     */
    function addContribution(
        uint256       groupId,
        uint256       amount,
        string memory note,
        string memory nickname
    ) external groupExists(groupId) onlyMember(groupId) {
        require(amount > 0, "El monto debe ser mayor a cero");

        uint256 cId = contributions[groupId].length;

        contributions[groupId].push(Contribution({
            id:          cId,
            contributor: msg.sender,
            nickname:    nickname,
            amount:      amount,
            note:        note,
            timestamp:   block.timestamp
        }));

        groups[groupId].totalContributed += amount;

        emit ContributionAdded(groupId, msg.sender, amount, note);
    }

    /**
     * @notice El administrador carga un gasto. No puede superar el saldo disponible.
     */
    function addExpense(
        uint256       groupId,
        uint256       amount,
        string memory concept,
        string memory category,
        string memory nickname
    ) external groupExists(groupId) onlyAdmin(groupId) {
        require(amount > 0, "El monto debe ser mayor a cero");

        uint256 saldo = groups[groupId].totalContributed - groups[groupId].totalSpent;
        require(amount <= saldo, "El gasto supera el saldo disponible");

        uint256 eId = expenses[groupId].length;

        expenses[groupId].push(Expense({
            id:        eId,
            recorder:  msg.sender,
            nickname:  nickname,
            amount:    amount,
            concept:   concept,
            category:  category,
            timestamp: block.timestamp
        }));

        groups[groupId].totalSpent += amount;

        emit ExpenseAdded(groupId, msg.sender, amount, concept);
    }

    // ─── Lectura ──────────────────────────────────────────────────────────────

    function getGroup(uint256 groupId)
        external
        view
        groupExists(groupId)
        returns (
            uint256 id,
            string  memory name,
            string  memory description,
            bool    isPublic,
            string  memory category,
            uint256 goal,
            address admin,
            uint256 totalContributed,
            uint256 totalSpent,
            uint256 saldo,
            uint256 createdAt
        )
    {
        Group storage g = groups[groupId];
        return (
            g.id,
            g.name,
            g.description,
            g.isPublic,
            g.category,
            g.goal,
            g.admin,
            g.totalContributed,
            g.totalSpent,
            g.totalContributed - g.totalSpent,
            g.createdAt
        );
    }

    function getGroupMembers(uint256 groupId)
        external
        view
        groupExists(groupId)
        returns (Member[] memory)
    {
        address[] storage addrs = memberAddresses[groupId];
        Member[] memory result = new Member[](addrs.length);
        for (uint256 i = 0; i < addrs.length; i++) {
            result[i] = members[groupId][addrs[i]];
        }
        return result;
    }

    function getGroupContributions(uint256 groupId)
        external
        view
        groupExists(groupId)
        returns (Contribution[] memory)
    {
        return contributions[groupId];
    }

    function getGroupExpenses(uint256 groupId)
        external
        view
        groupExists(groupId)
        returns (Expense[] memory)
    {
        return expenses[groupId];
    }

    function getUserGroups(address user)
        external
        view
        returns (uint256[] memory)
    {
        return userGroups[user];
    }

    function getMemberStatus(uint256 groupId, address user)
        external
        view
        returns (MemberStatus)
    {
        return members[groupId][user].status;
    }

    function getBalance(uint256 groupId)
        external
        view
        groupExists(groupId)
        returns (uint256)
    {
        return groups[groupId].totalContributed - groups[groupId].totalSpent;
    }

    function getMemberCount(uint256 groupId)
        external
        view
        groupExists(groupId)
        returns (uint256)
    {
        return memberAddresses[groupId].length;
    }
}
