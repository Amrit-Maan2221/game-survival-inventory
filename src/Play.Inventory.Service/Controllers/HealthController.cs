using Microsoft.AspNetCore.Mvc;

namespace Play.Inventory.Service.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "Catalog Service is running",
            timestamp = System.DateTime.UtcNow
        });
    }
}