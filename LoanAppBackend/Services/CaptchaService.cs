using System.Text.Json;
using LoanAppBackend.Models;

namespace LoanAppBackend.Services
{
    public class CaptchaService : ICaptchaService
    {
        private readonly HttpClient _httpClient;
        private readonly string _secretKey;

        public CaptchaService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _secretKey = configuration["GoogleRecaptcha:SecretKey"]; 
        }

        //public async Task<bool> VerifyTokenAsync(string captchaToken)
        //{
        //    var response = await _httpClient.PostAsync(
        //        $"https://www.google.com/recaptcha/api/siteverify?secret={_secretKey}&response={captchaToken}",
        //        null); 

        //    var jsonString = await response.Content.ReadAsStringAsync();
        //    Console.WriteLine("🔍 reCAPTCHA raw response: " + jsonString);
        //    var result = JsonSerializer.Deserialize<RecaptchaResponse>(jsonString);

        //    if (result?.ErrorCodes != null && result.ErrorCodes.Any())
        //    {
        //        Console.WriteLine("⚠️ reCAPTCHA errors: " + string.Join(", ", result.ErrorCodes));
        //    }


        //    return result?.Success ?? false;
        //}

        public async Task<bool> VerifyTokenAsync(string captchaToken)
        {
            var content = new FormUrlEncodedContent(new[]
            {
        new KeyValuePair<string, string>("secret", _secretKey),
        new KeyValuePair<string, string>("response", captchaToken)
    });

            var response = await _httpClient.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);

            var jsonString = await response.Content.ReadAsStringAsync();
            Console.WriteLine("🔍 reCAPTCHA raw response: " + jsonString);

            var result = JsonSerializer.Deserialize<RecaptchaResponse>(jsonString);

            if (result?.ErrorCodes != null && result.ErrorCodes.Any())
            {
                Console.WriteLine("⚠️ reCAPTCHA errors: " + string.Join(", ", result.ErrorCodes));
            }

            return result?.Success ?? false;
        }


        //private class RecaptchaResponse
        //{
        //    public bool Success { get; set; }
        //    public List<string>? ErrorCodes { get; set; }
        //}
    }
}
