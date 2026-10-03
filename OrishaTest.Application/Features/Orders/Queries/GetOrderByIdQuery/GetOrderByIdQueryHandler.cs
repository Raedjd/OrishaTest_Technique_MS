using MediatR;
using OrishaTest.Application.Contracts.Persistance;
using OrishaTest.Application.DataTransfertObject;

namespace OrishaTest.Application.Features.Orders.Queries.GetOrderById
{
    public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderDetailDto?>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IReceptionRepository _receptionRepository;

        public GetOrderByIdQueryHandler(IOrderRepository orderRepository, IReceptionRepository receptionRepository)
        {
            _orderRepository = orderRepository;
            _receptionRepository = receptionRepository;
        }

        public async Task<OrderDetailDto?> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(request.Id, cancellationToken);

            if (order is null)
                return null;

            return _receptionRepository.BuildOrderDetail(order);
        }
    }
}