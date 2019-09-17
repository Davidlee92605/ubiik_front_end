export enum Role {
  ADMIN = 'admin',
  ROOT = 'root',
  MANAGER = 'manager'
}

export function str2role(role: string): Role {
  switch (role) {
    case Role.ROOT:
      return Role.ROOT;
    case Role.ADMIN:
      return Role.ADMIN;
    case Role.MANAGER:
      return Role.MANAGER;
    default:
      throw new Error('invalid role: ' + role);
  }
}

