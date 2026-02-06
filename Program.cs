using System.Net;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/check", async (string url) =>
{
    if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        return Results.BadRequest(new { ok = false, error = "Невалиден URL." });

    try
    {
        using var handler = new HttpClientHandler { AllowAutoRedirect = false };
        using var client = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(8) };

        HttpResponseMessage res;
        try
        {
            res = await client.SendAsync(new HttpRequestMessage(HttpMethod.Head, uri));
        }
        catch
        {
            res = await client.GetAsync(uri, HttpCompletionOption.ResponseHeadersRead);
        }

        var code = (int)res.StatusCode;
        return Results.Ok(new { ok = code >= 200 && code < 400, status = code });
    }
    catch (Exception ex)
    {
        return Results.Ok(new { ok = false, error = ex.Message });
    }
});

app.Run();
