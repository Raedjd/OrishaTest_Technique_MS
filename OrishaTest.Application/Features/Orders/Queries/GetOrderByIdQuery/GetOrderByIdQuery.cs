using MediatR;
using OrishaTest.Application.DataTransfertObject;

namespace OrishaTest.Application.Features.Orders.Queries.GetOrderById
{
    public class GetOrderByIdQuery : IRequest<OrderDetailDto?>
    {
        public GetOrderByIdQuery(Guid id)
        {
            Id = id;
        }

        public Guid Id { get; set; }
    }
}