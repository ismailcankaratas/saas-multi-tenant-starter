import { IsString } from 'class-validator';

export class RespondInviteDto {
    @IsString()
    membershipId: string;
}
