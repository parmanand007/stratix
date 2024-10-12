import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { Organization } from './entities/organization.entity';
import { PaginatedSwaggerDocs,USER_PAGINATION_CONFIG  } from '../common/swagger/pagination.swagger';
import { JwtAuthGuard } from '../jwt/jwt-auth.gaurd';
import { CreateOrganizationAddressDto } from './dto/create-organization-address.dto';
import { OrganizationAddress } from './entities/organization-address.entity';
import { UpdateOrganizationAddressDto } from './dto/update-organization-address.dto';



@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Create organization' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({ status: 201, description: 'Organization created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all organizations' })
  // @ApiResponse({ status: 200, description: 'List of organizations' })
  // findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Organization>> {
  //   return this.organizationService.findAll(query);
  // }

  @Get()
  @UseGuards(JwtAuthGuard) 
  @PaginatedSwaggerDocs(Organization, USER_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Organization>> {
    return this.organizationService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Organization found' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findOne(@Param('id') id: number) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({ status: 200, description: 'Organization updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  update(@Param('id') id: number, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }

  // Endpoints for OrganizationAddress
  @Post('addresses')
  @ApiResponse({ status: 201, description: 'The address has been successfully created.', type: OrganizationAddress })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  createAddress(@Body() createAddressDto: CreateOrganizationAddressDto): Promise<OrganizationAddress> {
    return this.organizationService.createAddress(createAddressDto);
  }

  @Get('addresses/list')
  @PaginatedSwaggerDocs(Organization, USER_PAGINATION_CONFIG)
  async findAllAddresses(@Paginate() query: PaginateQuery): Promise<Paginated<OrganizationAddress>> {
    return this.organizationService.findAllAddresses(query);
  }

  @Get('addresses/:id')
  @ApiResponse({ status: 200, description: 'Successfully retrieved the address.', type: OrganizationAddress })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  findOneAddress(@Param('id') id: number): Promise<OrganizationAddress> {
    return this.organizationService.findOneAddress(id);
  }

  @Put('addresses/:id')
  @ApiResponse({ status: 200, description: 'The address has been successfully updated.', type: OrganizationAddress })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  updateAddress(@Param('id') id: number, @Body() updateAddressDto: UpdateOrganizationAddressDto): Promise<OrganizationAddress> {
    return this.organizationService.updateAddress(id, updateAddressDto);
  }

  @Delete('addresses/:id')
  @ApiResponse({ status: 204, description: 'The address has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  removeAddress(@Param('id') id: number): Promise<void> {
    return this.organizationService.removeAddress(id);
  }
}
