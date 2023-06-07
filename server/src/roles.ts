export const roles = {
    'root': 10,
    'admin': 7,
    'moderator': 5,
    'user': 2,
    'guest': 1,
};

export type RolesTypes =
    'root' |
    'admin' |
    'moderator' |
    'user' |
    'guest'


export function hasSufficientPrivileges(roleA, roleB) {
    return roles[roleA] >= roles[roleB];
}


export default roles;
