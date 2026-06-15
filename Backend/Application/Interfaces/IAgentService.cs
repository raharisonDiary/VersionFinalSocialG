using Core.Entities;
using Application.DTOs;

namespace Application.Interfaces
{
    public interface IAgentService
    {
        Task<User> CreateAgentAsync(UserDto dto, int chefId);
        Task<UserDto?> GetAgentByIdAsync(int id, int chefId);
        Task<IEnumerable<User>> GetAgentsByChefIdAsync(int chefId);
        Task UpdateAgentAsync(int id, UserDto dto, int chefId);
        Task DeleteAgentAsync(int id, int chefId);
    }
}