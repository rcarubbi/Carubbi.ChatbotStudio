using Carubbi.BotEditor.SamplesApi.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace Carubbi.BotEditor.SamplesApi.Controllers
{
    public class LocationController : ApiController
    {
        public IEnumerable<Location> Get()
        {
            return new List<Location>
            {
                new Location {
                        Id = 1,
                        Nome = "Carrera Chevrolet - Villa Lobos",
                        Cep = "05319-070",
                        Cidade = "São Paulo",
                        UF = "SP",
                        Endereco = "Rua Henri Bouchard, 77 - Vila Leopoldina",
                        Telefone = "(11) 4002-1515",
                        Latitude = -23.5399084,
                        Longitude = -46.7303012
                },
                new Location {
                      Id = 2,
                    Nome = "Chevrolet Palazzo",
                     Cidade = "São Paulo",
                        UF = "SP",
                        Cep = "02924-000",
                    Endereco = "R. Visc. de Nanique, 10 - Água Branca",
                    Telefone = "(11) 3612-6000",
                    Latitude = -23.5105667,
                    Longitude = -46.6915401
                },
                new Location {
                Id = 3,
                Nome = "Nova Chevrolet - Peças Barra Funda",
                Cidade = "São Paulo",
                UF = "SP",
                Cep = "01139-002",
                Endereco = "Av. Marquês de São Vicente, 1584 - Várzea da Barra Funda",
                Telefone = "(11) 3619-0800",
                Latitude = -23.518865,
                Longitude = -46.6779336},
            };
        }
    }
}
