using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.SamplesApi.Models
{
    public class SampleForm
    {
        public string Nome { get; set; }

        public decimal Altura { get; set; }

        public TipoCarro TipoDeCarroPreferido { get; set; }

        public List<Opcionais> Opcionais { get; set; }

        public List<string> OpcionaisDeSUV { get; set; }

        public int? QuantidadeDeFilhos { get; set; }

        public DateTime HorarioDaVisita { get; set; }

        public bool LembretePorEmail { get; set; }

        public DateTime DataDeNascimento { get; set; }
    }

    public enum TipoCarro
    {
        Sedan,
        Hatch,
        SUV
    }
    public enum Opcionais
    {
        ArCondicionado,
        VidorEletrico,
        DirecaoHidraulica,
        BancoCouro,
    }
}