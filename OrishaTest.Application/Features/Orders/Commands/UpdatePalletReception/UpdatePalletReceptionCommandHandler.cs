using MediatR;
using OrishaTest.Application.Contracts.Persistance;
using OrishaTest.Application.DataTransfertObject;

namespace OrishaTest.Application.Features.Orders.Commands.UpdatePalletReception
{
    public class UpdatePalletReceptionCommandHandler : IRequestHandler<UpdatePalletReceptionCommand, OrderDetailDto?>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IReceptionRepository _receptionRepository;

        public UpdatePalletReceptionCommandHandler(IOrderRepository orderRepository, IReceptionRepository receptionRepository)
        {
            _orderRepository = orderRepository;
            _receptionRepository = receptionRepository;
        }

        public async Task<OrderDetailDto?> Handle(UpdatePalletReceptionCommand request, CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetByIdForUpdateAsync(request.OrderId, cancellationToken);

            if (order is null)
                return null;

            var pallet = order.Pallets.FirstOrDefault(p => p.Id == request.PalletId);

            if (pallet is null)
                return null;


            _receptionRepository.MarkPallet(pallet, request.Received);
            await _orderRepository.SaveChangesAsync(cancellationToken);

            return _receptionRepository.BuildOrderDetail(order);
        }
    }
}