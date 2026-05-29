import { UserResponseDto } from "@modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { TokenResponseDto } from "./token-response.dto";
import { UserPayloadResponseDto } from "./user-payload-response.dto";

export class LoginResponseDto {
    @ApiProperty({
        type: () => UserPayloadResponseDto,
    })
    users: UserPayloadResponseDto;

    @ApiProperty({
        type: () => TokenResponseDto,
    })
    token: TokenResponseDto;
}