import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const userDto = { name: 'John Doe', email: 'john.doe@example.com' };
    jest.spyOn(repository, 'createUser').mockImplementation(() => Promise.resolve(userDto));

    expect(await service.createUser(userDto)).toBe(userDto);
  });

  // Add more test cases as needed
});
