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

        public async Task<List<Order>> GetAllWithDetailsAsync(CancellationToken cancellationToken = default)
        {
            return await QueryWithDetails().OrderBy(o => o.Number).ToListAsync(cancellationToken);
        }

        public async Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await QueryWithDetails().FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        }

        private IQueryable<Order> QueryWithDetails()
        {
            return _dbContext.Orders
                .AsNoTracking()
                .AsSplitQuery()
                .Where(o => !o.IsDeleted)
                .Include(o => o.Pallets).ThenInclude(p => p.Cartons) .ThenInclude(c => c.Products);
        }
    }
}