import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Users } from "src/entities/users.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { UsersService } from "./users.service";
import { ConfirmResetDto } from "./dto/confirm.reset.dto";
import { RequestResetDto } from "./dto/request.reset.dto";

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    async allUsers(): Promise<Users[]> {
        return await this.usersService.all()
    };

    @Get('admins')
    async allAdmins(): Promise<Users[]> {
        return await this.usersService.getAllAdmins();
    };

    @Get(':id')
    async userById(@Param('id') userId: number): Promise<Users | ApiResponse> {
        return await this.usersService.userById(userId);
    }

    @Post('password-reset')
    async requestReset(@Body() dto: RequestResetDto) {
        return await this.usersService.initiatePasswordReset(dto.email);
    }

    @Post('password-reset/confirm')
    async confirmReset(@Body() dto: ConfirmResetDto) {
        return await this.usersService.confirmPasswordReset(dto.email, dto.code, dto.newPassword);
    }


    @Patch(':id/change-role')
    async changeUserRole(@Param('id') userId: number): Promise<Users | ApiResponse> {
        return this.usersService.toggleUserRole(userId);
    }

    @Delete('remove/:userId')
    async deleteUser(@Param('userId') userId: number): Promise<ApiResponse> {
        return this.usersService.deleteUserById(userId);
    }
}