import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { UserRole } from '../admin/dto/create-admin.dto';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER_FIZ, UserRole.USER_FIZ, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a comment (USER or USER_FIZ who has a completed order)' })
  create(@Body() dto: CreateCommentDto, @Req() req:any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.commentService.create(dto, userId, userRole);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all comments' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by (createdAt, updatedAt)', enum: ['createdAt', 'updatedAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc or desc)', enum: ['asc', 'desc'] })
  findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'createdAt' | 'updatedAt',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.commentService.findAll(userId, userRole, page, limit, sortBy, sortOrder);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a single comment by ID' })
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.commentService.findOne(id, userId, userRole);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER_FIZ, UserRole.USER_FIZ)
  @ApiOperation({ summary: 'Update a comment' })
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER_FIZ, UserRole.USER_FIZ)
  @ApiOperation({ summary: 'Delete a comment (OWNER or ADMIN)' })
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.commentService.remove(id, userId, userRole);
  }
}