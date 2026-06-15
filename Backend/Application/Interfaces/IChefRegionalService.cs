using Application.DTOs;
using Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IChefRegionalService
    {
        Task<IEnumerable<ChefRegionalDto>> GetAllChefsAsync();
        Task<ChefRegionalDto> GetChefByIdAsync(int id);
        Task<User> CreateChefAsync(ChefRegionalDto dto, int adminId, string role);
        Task UpdateChefAsync(int id, ChefRegionalDto dto);
        Task DeleteChefAsync(int id);
    }
}