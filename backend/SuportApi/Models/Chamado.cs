using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuportApi.Models
{
    [Table("chamados")]
    public class Chamado
    {
        [Key]
        public int id { get; set; }

        public string titulo { get; set; }

        public string descricao { get; set; }

        public string status { get; set; }

        public string prioridade { get; set; }

        public string setor { get; set; }

        public int usuario_id { get; set; }

        [NotMapped]
        public string? usuario_nome { get; set; }

        public DateTime data_abertura { get; set; }

        public DateTime? data_fechamento { get; set; }

        public string? solucao { get; set; }
    }
}