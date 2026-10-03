using MediatR;
using OrishaTest.Application.DataTransfertObject;

namespace OrishaTest.Application.Features.Products.Queries.SearchProducts
{
    public class SearchProductsQuery : IRequest<List<ProductLookupDto>>
    {
        public string? OrderNumber { get; set; }
        public string? Ref { get; set; }
    }
}