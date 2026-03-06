using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuportApi.Data;
using SuportApi.Models;

namespace SuportApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Usuário cadastrado com sucesso!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var user = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == login.Email && u.Senha == login.Senha);

            if (user == null) return Unauthorized(new { message = "E-mail ou senha inválidos" });

            return Ok(new { id = user.Id, nome = user.Nome, tipo = user.Tipo });
        }
    }

    public class LoginRequest { public string Email { get; set; } = ""; public string Senha { get; set; } = ""; }
}