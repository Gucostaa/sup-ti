using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuportApi.Data;
using SuportApi.Models;

namespace SuportApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChamadosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChamadosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetChamados()
        {
            try
            {
                var lista = await (from c in _context.Chamados
                                   join u in _context.Set<Usuario>() on c.usuario_id equals u.Id into userJoin
                                   from u in userJoin.DefaultIfEmpty()
                                   select new Chamado
                                   {
                                       id = c.id,
                                       titulo = c.titulo,
                                       descricao = c.descricao,
                                       status = c.status,
                                       prioridade = c.prioridade,
                                       setor = c.setor, 
                                       usuario_id = c.usuario_id,
                                       usuario_nome = u != null ? u.Nome : "Usuário Desconhecido",
                                       data_abertura = c.data_abertura,
                                       data_fechamento = c.data_fechamento,
                                       solucao = c.solucao
                                   }).ToListAsync();

                return Ok(lista);
            }
            catch (Exception ex)
            {
                var erroDetalhado = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { mensagem = "Erro ao buscar chamados", detalhe = erroDetalhado });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Chamado>> GetChamado(int id)
        {
            try
            {
                var chamado = await (from c in _context.Chamados
                                     join u in _context.Set<Usuario>() on c.usuario_id equals u.Id into userJoin
                                     from u in userJoin.DefaultIfEmpty()
                                     where c.id == id
                                     select new Chamado
                                     {
                                         id = c.id,
                                         titulo = c.titulo,
                                         descricao = c.descricao,
                                         status = c.status,
                                         prioridade = c.prioridade,
                                         setor = c.setor, // Campo adicionado
                                         usuario_id = c.usuario_id,
                                         usuario_nome = u != null ? u.Nome : "Usuário Desconhecido",
                                         data_abertura = c.data_abertura,
                                         data_fechamento = c.data_fechamento,
                                         solucao = c.solucao
                                     }).FirstOrDefaultAsync();

                if (chamado == null) return NotFound(new { mensagem = "Chamado não encontrado." });
                return Ok(chamado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao buscar detalhes", detalhe = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Chamado>> PostChamado(Chamado chamado)
        {
            try 
            {
                if (chamado.data_abertura == default) chamado.data_abertura = DateTime.Now;
                if (string.IsNullOrEmpty(chamado.status)) chamado.status = "Aberto";
                if (string.IsNullOrEmpty(chamado.setor)) chamado.setor = "TI"; 

                _context.Chamados.Add(chamado);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetChamado), new { id = chamado.id }, chamado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao criar chamado", detalhe = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutChamado(int id, [FromBody] Chamado chamado)
        {
            if (id != chamado.id) return BadRequest(new { mensagem = "ID divergente." });

            _context.Entry(chamado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao atualizar", detalhe = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChamado(int id)
        {
            try
            {
                var chamado = await _context.Chamados.FindAsync(id);
                
                if (chamado == null)
                {
                    return NotFound(new { mensagem = "Chamado não encontrado para exclusão." });
                }

                _context.Chamados.Remove(chamado);
                await _context.SaveChangesAsync();

                return Ok(new { mensagem = $"Chamado #{id} excluído com sucesso." });
            }
            catch (Exception ex)
            {
                var erroReal = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { mensagem = "Erro ao excluir no banco de dados", detalhe = erroReal });
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var total = await _context.Chamados.CountAsync();
                var abertos = await _context.Chamados.CountAsync(c => c.status == "Aberto" || c.status == "aberto");
                var resolvidos = await _context.Chamados.CountAsync(c => c.status == "Resolvido" || c.status == "concluido");
                return Ok(new { total, abertos, resolvidos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro nas estatísticas", detalhe = ex.Message });
            }
        }
    }
}