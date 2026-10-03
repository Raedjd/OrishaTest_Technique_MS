using MediatR;
using OrishaTest.Application.Contracts.Persistance;
using OrishaTest.Application.DataTransfertObject;

namespace OrishaTest.Application.Features.Products.Queries.SearchProducts
{
    public class SearchProductsQueryHandler : IRequestHandler<SearchProductsQuery, List<ProductLookupDto>>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IReceptionRepository _receptionRepository;

        public SearchProductsQueryHandler(IOrderRepository orderRepository, IReceptionRepository receptionRepository)
        {
            _orderRepository = orderRepository;
            _receptionRepository = receptionRepository;
        }

        public async Task<List<ProductLookupDto>> Handle(SearchProductsQuery request, CancellationToken cancellationToken)
        {
            var products = await _orderRepository.SearchProductsAsync(request.OrderNumber, request.Ref, cancellationToken);

            return products.Select(p => new ProductLookupDto
            {
                Id = p.Id,
                Ref = p.Ref,
                Name = p.Name,
                Color = p.Color,
                Size = p.Size,
                CartonCode = p.Carton.Code,
                PalletCode = p.Carton.Pallet.Code,
                OrderId = p.Carton.Pallet.Order.Id,
                OrderNumber = p.Carton.Pallet.Order.Number,
                ExpectedQuantity = p.ExpectedQuantity,
                ReceivedQuantity = p.ReceivedQuantity,
                Status = _receptionRepository.GetStatus(p.ReceivedQuantity, p.ExpectedQuantity)
            }).ToList();
        }
    }
}