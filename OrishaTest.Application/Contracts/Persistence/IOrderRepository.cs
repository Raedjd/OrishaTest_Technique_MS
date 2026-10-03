using OrishaTest.Domain.Entities;

namespace OrishaTest.Application.Contracts.Persistance
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<(List<Order> Items, long TotalCount)> GetPagedWithDetailsAsync(int pageNumber,int pageSize,string? search,CancellationToken cancellationToken = default);

        Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);

        Task<List<Product>> SearchProductsAsync(string? orderNumber, string? reference, CancellationToken cancellationToken = default);

        Task<Order?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);
    }
}