import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let organizationRepository: Repository<Organization>;

  const mockOrganization = {
    id: 1,
    domain: 'example.com',
    name: 'Acme Corp',
    uuid: 'some-uuid',
    createdAt: new Date(),
    updatedAt: new Date(),
    users: [],
    products: [],
    address: null
  };

  const mockUser = {
    id: 1,
    uuid: 'some-uuid',
    name: 'John Doe',
    email: 'john.doe@example.com',
    organizationId: 1,
    password: 'password123',
    createdAt: new Date(),
    updatedAt: new Date(),
    products: [],
    hashPassword: jest.fn(),
    organizationEntity: mockOrganization,
  };

  const mockOrganizationRepository = {
    findOne: jest.fn().mockResolvedValue(mockOrganization),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] }), // Add raw property
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: mockOrganizationRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    organizationRepository = module.get<Repository<Organization>>(getRepositoryToken(Organization));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const userDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      organizationId: 1,
      password: 'password123',
    };

    jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // No existing user

    const result = await service.createUser(userDto);

    expect(result).toEqual(mockUser);
    expect(userRepository.create).toHaveBeenCalledWith({
      name: userDto.name,
      email: userDto.email,
      password: userDto.password,
      organizationEntity: mockOrganization
    });

    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should throw NotFoundException if organization does not exist', async () => {
    const userDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      organizationId: 999, // Non-existing organization ID
      password: 'password123',
    };

    jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(null); // Simulating non-existing organization

    await expect(service.createUser(userDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException for email domain mismatch', async () => {
    const userDto = {
      name: 'John Doe',
      email: 'john.doe@gmail.com', // Email with a different domain
      organizationId: 1,
      password: 'password123',
    };

    jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // No existing user

    await expect(service.createUser(userDto)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if email already exists', async () => {
    const userDto = {
      name: 'John Doe',
      email: 'john.doe@example.com', // Existing email
      organizationId: 1,
      password: 'password123',
    };

    jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser); // Simulating existing user with the same email

    await expect(service.createUser(userDto)).rejects.toThrow(ConflictException);
  });

  it('should throw InternalServerErrorException if user save fails', async () => {
    const userDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      organizationId: 1,
      password: 'password123',
    };

    jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Database error')); // Simulating save failure

    await expect(service.createUser(userDto)).rejects.toThrow(InternalServerErrorException);
  });

  it('should retrieve all users', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValue([mockUser]);

    const result = await service.getUsers();

    expect(result).toEqual([mockUser]);
    expect(userRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should retrieve a user by ID', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const result = await service.getUserById(1);

    expect(result).toEqual(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw NotFoundException if user not found by ID', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(service.getUserById(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const updateUserDto = { name: 'Jane Doe', email: 'jane.doe@example.com' };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'save').mockResolvedValue({ ...mockUser, ...updateUserDto });

    const result = await service.updateUser(1, updateUserDto);

    expect(result).toEqual({ ...mockUser, ...updateUserDto });
    expect(userRepository.save).toHaveBeenCalledWith({ ...mockUser, ...updateUserDto });
  });

  it('should throw NotFoundException if user to update does not exist', async () => {
    const updateUserDto = { name: 'Jane Doe', email: 'jane.doe@example.com' };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(service.updateUser(1, updateUserDto)).rejects.toThrow(NotFoundException);
  });

  it('should delete a user', async () => {
    jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 1, raw: [] }); // Add raw property

    await service.deleteUser(1);

    expect(userRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if user to delete does not exist', async () => {
    jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 0, raw: [] }); // Add raw property

    await expect(service.deleteUser(1)).rejects.toThrow(NotFoundException);
  });

  it('should find a user by email', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const result = await service.findByEmail('john.doe@example.com');

    expect(result).toEqual(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
  });

  it('should find a user by ID', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const result = await service.findById(1);

    expect(result).toEqual(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
