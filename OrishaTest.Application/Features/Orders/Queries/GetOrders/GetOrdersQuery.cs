using MediatR;
using OrishaTest.Application.Common.Bases;
using OrishaTest.Application.DataTransfertObject;

namespace OrishaTest.Application.Features.Orders.Queries.GetOrders
{
    public class GetOrdersQuery : IRequest<ItemPagedResult<OrderSummaryDto>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
    }
}