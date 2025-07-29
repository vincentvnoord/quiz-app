using System.Security.Claims;
using Api.Models.DTOs.QuizData;
using Business.Models;
using Business.QuizService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs.DashboardHub
{
    [Authorize]
    public class DashboardHub : Hub
    {
        private readonly QuizService _quizService;

        public DashboardHub(QuizService quizService)
        {
            _quizService = quizService;
        }
    }
}
