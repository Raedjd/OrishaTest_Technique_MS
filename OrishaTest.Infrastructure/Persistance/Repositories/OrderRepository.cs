using Microsoft.EntityFrameworkCore;
using OrishaTest.Application.Contracts.Persistance;
using OrishaTest.Domain.Entities;

namespace OrishaTest.Infrastructure.Persistance.Repositories
{
    public class OrderRepository : EfRepository<Order>, IOrderRepository
    {
        private readonly ApplicationDBContext _dbContext;

        public OrderRepository(ApplicationDBContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<(List<Order> Items, long TotalCount)> GetPagedWithDetailsAsync(
            int pageNumber,
            int pageSize,
            string? search,
            CancellationToken cancellationToken = default)
        {
            IQueryable<Order> query = _dbContext.Orders
                .AsNoTracking()
                .Where(o => !o.IsDeleted);


            if (!string.IsNullOrWhiteSpace(search))
            {
                var pattern = $"%{search.Trim()}%";
                query = query.Where(o =>
                    EF.Functions.ILike(o.Number, pattern) ||
                    (o.SupplierName != null && EF.Functions.ILike(o.SupplierName, pattern)));
            }

            var totalCount = await query.LongCountAsync(cancellationToken);

            var items = await query
                .OrderBy(o => o.Number)
                .ThenBy(o => o.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(o => o.Pallets)
                    .ThenInclude(p => p.Cartons)
                        .ThenInclude(c => c.Products)
                .AsSplitQuery()
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }

        public async Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Orders
                .AsNoTracking()
                .Where(o => !o.IsDeleted)
                .Include(o => o.Pallets)
                    .ThenInclude(p => p.Cartons)
                        .ThenInclude(c => c.Products)
                .AsSplitQuery()
                .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        }

        public async Task<Order?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Orders
                .Where(o => !o.IsDeleted)
                .Include(o => o.Pallets).ThenInclude(p => p.Cartons).ThenInclude(c => c.Products)
                .AsSplitQuery()
                .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        }
    }
}