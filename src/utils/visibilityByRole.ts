const visibilityByRole = (role: string): boolean => {
    const allowedRoles = [
        "admin",
        "coord_sst",
        "ing_proyectos",
        "dir_proyectos",
        "compras",
        "gerente"
    ];
    return allowedRoles.includes(role);
};

export default visibilityByRole;