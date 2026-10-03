using FluentValidation;
using FluentValidation.Results;
using MediatR;
using OrishaTest.Application.Contracts.Persistance;
using OrishaTest.Application.DataTransfertObject;

namespace OrishaTest.Application.Features.Orders.Commands.UpdateProductReception
{
    public class UpdateProductReceptionCommandHandler : IRequestHandler<UpdateProductReceptionCommand, OrderDetailDto?>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IReceptionRepository _receptionRepository;
        private readonly IValidator<UpdateProductReceptionCommand> _validator;

        public UpdateProductReceptionCommandHandler( IOrderRepository orderRepository, IReceptionRepository receptionRepository, IValidator<UpdateProductReceptionCommand> validator)
        {
            _orderRepository = orderRepository;
            _receptionRepository = receptionRepository;
            _validator = validator;
        }

        public async Task<OrderDetailDto?> Handle(UpdateProductReceptionCommand request, CancellationToken cancellationToken)
        {
            var validationResult = await _validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
                throw new ValidationException(validationResult.Errors);

            var order = await _orderRepository.GetByIdForUpdateAsync(request.OrderId, cancellationToken);

            if (order is null)
                return null;

            var product = order.Pallets.SelectMany(p => p.Cartons).SelectMany(c => c.Products).FirstOrDefault(p => p.Id == request.ProductId);

            if (product is null)
                return null;

            if (request.ReceivedQuantity > product.ExpectedQuantity)
            {
                throw new ValidationException(new[]
                {
                    new ValidationFailure(nameof(request.ReceivedQuantity),$"ReceivedQuantity cannot exceed ExpectedQuantity ({product.ExpectedQuantity}).")
                });
            }

            _receptionRepository.SetProductReceivedQuantity(product, request.ReceivedQuantity);
            await _orderRepository.SaveChangesAsync(cancellationToken);

            return _receptionRepository.BuildOrderDetail(order);
        }
    }
}