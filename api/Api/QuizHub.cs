

using Microsoft.AspNetCore.SignalR;

public class QuizHub : Hub
{

    public async Task GenerateQuiz()
    {
        await Clients.Caller.SendAsync("ReceiveUpdate", new {
            type = "title",
            value = "Quiz Title",
        });

        await Task.Delay(1000);
    }
}