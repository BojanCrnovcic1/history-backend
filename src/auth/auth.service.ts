import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import { UsersService } from "src/users/users.service";
import { Users } from "src/entities/users.entity";
import { LoginUserDto } from "./dto/login.user.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async validateUser(email: string, password: string): Promise<Users | null> {
        const user = await this.usersService.getUserEmail(email);

        if(user && await bcrypt.compare(password, user.passwordHash)) {
            return user;
        }
        return null;
      }
    
    async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.role !== 'ADMIN' && !user.isVerified) {
            throw new UnauthorizedException('Please verify your email before logging in.');
        }

        const tokenPayload = { userId: user.userId, role: user.role, email: user.email };

        const accessToken = this.jwtService.signAccessToken(tokenPayload); 
        const refreshToken = this.jwtService.signRefreshToken(tokenPayload);
        return { accessToken, refreshToken };
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const payload = this.jwtService.verifyRefreshToken(refreshToken);
            const newAccessToken = this.jwtService.signAccessToken({ userId: payload.userId, email: payload.email });
            return { accessToken: newAccessToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async getCurrentUser(req: Request) {
        return req['user'];
    }
}