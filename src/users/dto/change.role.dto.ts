export class ChangeRoleDto {
    userId: number;
    newRole: 'USER' | 'ADMIN';
}
