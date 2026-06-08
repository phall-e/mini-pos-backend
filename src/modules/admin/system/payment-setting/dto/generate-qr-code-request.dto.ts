import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class GenerateQrCodeRequestDto {
    @ApiProperty()
    @IsOptional()
    id: number;

    @ApiProperty({ required: false })
    @IsOptional()
    billNumber?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    amount?: number;


}