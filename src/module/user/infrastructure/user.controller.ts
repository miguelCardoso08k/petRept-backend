import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from '../application/user.service';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { UpdateNameUserDto } from '../application/dto/update-name-user.dto';
import { UpdateRoleUserDto } from '../application/dto/update-role-user.dto';
import { UserMapper } from './mappers/user.mapper';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return {
      message: 'User created successfully',
      data: UserMapper.toHttp(user),
    };
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    return {
      message: 'Users found successfully',
      data: users.map((user) => UserMapper.toHttp(user)),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    return {
      messsage: 'User found successfully',
      data: UserMapper.toHttp(user),
    };
  }

  @Get('search')
  async search(@Query('name') name: string) {
    const users = await this.userService.findByName(name);

    return {
      message: 'Users found successfully',
      data: users.map((user) => UserMapper.toHttp(user)),
    };
  }

  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleUserDto) {
    const user = await this.userService.updateRole(id, dto);

    return {
      message: 'User role updated successfully',
      data: UserMapper.toHttp(user),
    };
  }

  @Patch(':id/name')
  async updateName(@Param('id') id: string, @Body() dto: UpdateNameUserDto) {
    const user = await this.userService.updateName(id, dto);

    return {
      message: 'User name updated successfully',
      data: UserMapper.toHttp(user),
    };
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    const user = await this.userService.activete(id);

    return {
      message: 'User activated successfully',
      data: UserMapper.toHttp(user),
    };
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    const user = await this.userService.deactivate(id);

    return {
      message: 'User deactivated successfully',
      data: UserMapper.toHttp(user),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);

    return { message: 'User deleted successfully' };
  }
}
