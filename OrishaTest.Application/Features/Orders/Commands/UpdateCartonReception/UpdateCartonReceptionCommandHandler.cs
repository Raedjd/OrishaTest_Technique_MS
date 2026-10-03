using MediatR;
using OrishaTest.Application.Contracts.Persistance;
using OrishaTest.Application.DataTransfertObject;

namespace OrishaTest.Application.Features.Orders.Commands.UpdateCartonReception
{
    public class UpdateCartonReceptionCommandHandler : IRequestHandler<UpdateCartonReceptionCommand, OrderDetailDto?>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IReceptionRepository _receptionRepository;

        public UpdateCartonReceptionCommandHandler(IOrderRepository orderRepository, IReceptionRepository receptionRepository)
        {
            _orderRepository = orderRepository;
            _receptionRepository = receptionRepository;
        }

        public async Task<OrderDetailDto?> Handle(UpdateCartonReceptionCommand request, CancellationToken cancellationToken)
        {

            var order = await _orderRepository.GetByIdForUpdateAsync(request.OrderId, cancellationToken);

            if (order is null)
                return null;


            var carton = order.Pallets
                .SelectMany(p => p.Cartons)
                .FirstOrDefault(c => c.Id == request.CartonId);

            if (carton is null)
                return null;


            _receptionRepository.MarkCarton(carton, request.Received);
            await _orderRepository.SaveChangesAsync(cancellationToken);


            return _receptionRepository.BuildOrderDetail(order);
        }
    }
}