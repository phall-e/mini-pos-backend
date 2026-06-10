import { UserResponseDto } from "@modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { TokenResponseDto } from "./token-response.dto";
import { UserPayloadResponseDto } from "./user-payload-response.dto";

export class LoginResponseDto {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    username: string;

    @ApiProperty()
    status: 200;

    @ApiProperty()
    isRequiredOtp: boolean;

    @ApiProperty()
    message: string;
}