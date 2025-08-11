import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/users.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";
import { RegisterUserDto } from "./dto/register.user.dto";
import { ChangeRoleDto } from "./dto/change.role.dto";
import { JwtService } from "src/auth/jwt.service";
import { MailService } from "./mail.service";
import { ConfigService } from "@nestjs/config";
import { PasswordResetRequests } from "src/entities/password-reset-requests.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
        @InjectRepository(PasswordResetRequests) private readonly passwordResetRepository: Repository<PasswordResetRequests>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
    ) {}

    async all(): Promise<Users[]> {
        return await this.usersRepository.find({
            relations: ['subscriptions']
        });
    };

    async getAllAdmins(): Promise<Users[]> {
        return await this.usersRepository.find({
            where: { role: 'ADMIN' },
            relations: ['subscriptions']
        });
    };

    async userById(userId: number): Promise<Users | ApiResponse> {
        const user = await this.usersRepository.findOne({
            where: {userId: userId},
            relations: ['subscriptions']
        })

        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!')
        }
        return user;
    };

    async getUserEmail(email: string): Promise<Users | undefined> {
        const user = await this.usersRepository.findOne({where: {email: email}});
        if (user) {
            return user;
        }
        return undefined;
    };

    async updateUser(user: Users): Promise<Users> {
        return await this.usersRepository.save(user);
    };

    async initiatePasswordReset(email: string): Promise<ApiResponse> {
        const user = await this.usersRepository.findOne({ where: { email } });
      
        if (!user) {
          return new ApiResponse('error', -1001, 'User not found.');
        }
      
        const code = Math.random().toString(36).substring(2, 6).toUpperCase(); // npr: A4DZ
      
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minuta
      
        const resetRequest = new PasswordResetRequests();
        resetRequest.email = email;
        resetRequest.code = code;
        resetRequest.expiresAt = expires;
        resetRequest.isUsed = false;
      
        await this.passwordResetRepository.save(resetRequest);
      
        await this.mailService.sendPasswordResetCode(email, code);
      
        return new ApiResponse('ok', 0, 'A password reset code has been sent to your email.');
    };
    async confirmPasswordReset(email: string, code: string, newPassword: string): Promise<ApiResponse> {
        const resetRequest = await this.passwordResetRepository.findOne({
          where: { email, code, isUsed: false },
          order: { createdAt: 'DESC' },
        });
      
        if (!resetRequest || new Date() > resetRequest.expiresAt) {
          return new ApiResponse('error', -1015, 'The code is invalid or has expired.');
        }
      
        const user = await this.usersRepository.findOne({ where: { email } });
      
        if (!user) {
          return new ApiResponse('error', -1001, 'User not found!');
        }
      
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(newPassword);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();
      
        user.passwordHash = passwordHashString;
        await this.usersRepository.save(user);
      
        resetRequest.isUsed = true;
        await this.passwordResetRepository.save(resetRequest);
      
        return new ApiResponse('ok', 0, 'Password changed successfully.');
    };
         
    async toggleUserRole(userId: number): Promise<Users | ApiResponse> {
        const user = await this.usersRepository.findOne({ where: { userId: userId } });
    
        if (!user) {
            return new ApiResponse('error', -1004, 'User not found!');
        }

        user.role = user.role === 'USER' ? 'ADMIN' : 'USER';

        const savedRoles = await this.usersRepository.save(user);
        
        if (!savedRoles) {
            return new ApiResponse('error', -1008, 'New role is not saved!')
        }
        return savedRoles;    
    };

    async changeUserRole(data: ChangeRoleDto): Promise<Users | ApiResponse> {
        const user = await this.usersRepository.findOne({ where: { userId: data.userId } });
    
        if (!user) {
            return new ApiResponse('error', -1004, 'User not found!');
        }
    
        if (user.role === 'ADMIN' && data.newRole === 'USER') {
            const firstAdmin = await this.usersRepository.findOne({
                where: { role: 'ADMIN' },
                order: { userId: 'ASC' },
            });
    
            if (firstAdmin && firstAdmin.userId === user.userId) {
                return new ApiResponse('error', -1011, 'Cannot remove role from the first admin.');
            }
        }
    
        user.role = data.newRole;
        const savedRole = await this.usersRepository.save(user)
        try {
            return savedRole;
        } catch (error) {
            return new ApiResponse('error', -1005, 'Error updating user role');
        }
    }; 
    async register(registerData: RegisterUserDto): Promise<Users | ApiResponse> {
        const existingUser = await this.getUserEmail(registerData.email);
        if (existingUser) {
            return new ApiResponse('error', -1002, 'User already exists!');
        }
    
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(registerData.password, salt);
    
        const newUser = new Users();
        newUser.username = registerData.username;
        newUser.email = registerData.email;
        newUser.passwordHash = hashedPassword;
        newUser.isVerified = false;
    
        const savedUser = await this.usersRepository.save(newUser);
        if (!savedUser) {
            return new ApiResponse('error', -1003, 'User is not saved!');
        }
    
        const verificationToken = this.jwtService.signEmailVerificationToken({
            userId: savedUser.userId,
            email: savedUser.email
        });
    
        const backendUrl = this.configService.get<string>('BACKEND_URL');
        const verificationLink = `${backendUrl}/auth/verify-email?token=${verificationToken}`;
        await this.mailService.sendVerificationEmail(savedUser.email, verificationLink);
    
        return savedUser;
    }   
    
    async deleteUserById(userId: number): Promise<ApiResponse> {
        const user = await this.usersRepository.findOne({ where: { userId: userId } });
    
        if (!user) {
            return new ApiResponse('error', -1006, 'User not found!');
        }
    
        try {
            await this.usersRepository.remove(user);
            return new ApiResponse('ok', 0, `User with ID ${userId} deleted successfully.`);
        } catch (error) {
            return new ApiResponse('error', -1007, 'Failed to delete user.');
        }
    };   
}