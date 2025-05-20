import { PartialType } from '@nestjs/swagger';
import { AddAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(AddAdminDto) {}
