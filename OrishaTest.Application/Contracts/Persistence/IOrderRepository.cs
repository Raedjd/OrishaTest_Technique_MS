using OrishaTest.Domain.Entities;

namespace OrishaTest.Application.Contracts.Persistance
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<List<Order>> GetAllWithDetailsAsync(CancellationToken cancellationToken = default);

        Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    }
}