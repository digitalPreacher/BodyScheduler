using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;

namespace BodySchedulerWebApi.HubConfig
{
    public class ChatHub : Hub
    { public async Task SendMessage(string message)
        {
            try
            {
                await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", $"Received the message: {message}");
            }
            catch(Exception ex)
            {
                Debug.WriteLine(ex);
            }
        }
    }
}
