using FluentValidation;
using MediatR;
using OrishaTest.Application.Common.Bases;
using OrishaTest.Application.Contracts.Persistance;
using OrishaTest.Application.DataTransfertObject;

namespace OrishaTest.Application.Features.Orders.Queries.GetOrders
{
    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, ItemPagedResult<OrderSummaryDto>>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IReceptionRepository _receptionRepository;
        private readonly IValidator<GetOrdersQuery> _validator;

        public GetOrdersQueryHandler(IOrderRepository orderRepository, IReceptionRepository receptionRepository, IValidator<GetOrdersQuery> validator)
        {
            _orderRepository = orderRepository;
            _receptionRepository = receptionRepository;
            _validator = validator;
        }

        public async Task<ItemPagedResult<OrderSummaryDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {

            var validationResult = await _validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
                throw new ValidationException(validationResult.Errors);

            var (orders, totalCount) = await _orderRepository.GetPagedWithDetailsAsync( request.PageNumber,request.PageSize, request.Search, cancellationToken);

            return new ItemPagedResult<OrderSummaryDto>
            {
                Items = orders.Select(o => _receptionRepository.BuildOrderSummary(o)).ToList(),
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }
}