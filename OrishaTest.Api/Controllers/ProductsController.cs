using MediatR;
using Microsoft.AspNetCore.Mvc;
using OrishaTest.Application.DataTransfertObject;
using OrishaTest.Application.Features.Products.Queries.SearchProducts;

namespace OrishaTest.Api.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET api/products?orderNumber=CMD-2026&ref=TSH-RED-M
        [HttpGet]
        [ProducesResponseType(typeof(List<ProductLookupDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Search([FromQuery] SearchProductsQuery query, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }
    }
}