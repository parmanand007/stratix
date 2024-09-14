import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiOkResponse } from '@nestjs/swagger';

interface HasName {
  name: string;
}

export const USER_PAGINATION_CONFIG = {
  page: { description: 'Page number for pagination', type: 'integer', example: 1 },
  limit: { description: 'Number of items per page', type: 'integer', example: 10 },
};

export function ApiPaginationQuery(config: any) {
  return applyDecorators(
    ApiQuery(config.page),
    ApiQuery(config.limit),
  );
}

export function ApiOkPaginatedResponse<T extends HasName>(dto: T, config: any) {
  return applyDecorators(
    ApiOkResponse({
      description: 'Paginated response',
      schema: {
        type: 'object',
        properties: {
          items: { type: 'array', items: { $ref: `#/components/schemas/${dto.name}` } },
          meta: {
            type: 'object',
            properties: {
              totalItems: { type: 'integer' },
              itemCount: { type: 'integer' },
              itemsPerPage: { type: 'integer' },
              totalPages: { type: 'integer' },
              currentPage: { type: 'integer' },
            },
          },
        },
      },
    }),
  );
}

export function PaginatedSwaggerDocs<T extends HasName>(dto: T, config: any) {
  return applyDecorators(
    ApiPaginationQuery(config),
    ApiOkPaginatedResponse(dto, config),
  );
}
