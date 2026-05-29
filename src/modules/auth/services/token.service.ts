import { UserResponseDto } from "@modules/admin/system/user/dto/user-response.dto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokenResponseDto } from "../dto/token-response.dto";

@Injectable()
export class TokenService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
    ){}

    public generateAuthToken(payload: any): TokenResponseDto {
        const accessTokenExpiresIn = this.configService.get<any>('JWT_EXPIRES_IN');
        const tokenType = this.configService.get<string>('TOKEN_TYPE');
        const accessToken = this.generateToken(payload);

        return {
            accessToken,
            expireIn: accessTokenExpiresIn,
            tokenType,
        };
    }

    public verifyToken(token: string): any {
        return this.jwtService.verify(token);
    }

    private generateToken(payload: UserResponseDto): string {
        const token = this.jwtService.sign(payload);
        return token;
    }

}