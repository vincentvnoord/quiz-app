using System.Text;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Api.Models.DTOs.Quiz;

public class OpenAiService
{
    private readonly HttpClient _client;
    private readonly string _apiKey;

    public OpenAiService(string apiKey)
    {
        _client = new HttpClient();
        _apiKey = apiKey;
    }

    public async Task<QuizDto> GetQuizDataFromOpenAiAsync()
    {
        // Define the request body for OpenAI API
        var requestBody = new
        {
            model = "gpt-4",
            stream = true,
            messages = new[]
            {
                new { role = "system", content = "Generate a quiz with a title and questions in JSON format" },
                new { role = "user", content = "Create a quiz about European capitals." }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
        {
            Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
        };
        request.Headers.Add("Authorization", $"Bearer {_apiKey}");

        // Get the stream response
        var response = await _client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
        var stream = await response.Content.ReadAsStreamAsync();

        return await ParseStreamAsync(stream);
    }

    private async Task<QuizDto> ParseStreamAsync(Stream stream)
    {
        using var reader = new StreamReader(stream);
        var buffer = new StringBuilder();
        var quiz = new QuizDto();
        bool isTitleSet = false;

        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(line)) continue;
            if (!line.StartsWith("data:")) continue;

            var json = line.Substring("data:".Length).Trim();

            if (json == "[DONE]") break;

            try
            {
                var partial = JsonSerializer.Deserialize<OpenAiChunk>(json);
                var content = partial?.choices?[0]?.delta?.content;
                if (!string.IsNullOrEmpty(content))
                {
                    buffer.Append(content);

                    // Check if the current content is the title
                    if (!isTitleSet && buffer.ToString().Contains("\"title\":"))
                    {
                        quiz.Title = ParseTitleFromBuffer(buffer.ToString());
                        isTitleSet = true;
                        buffer.Clear();
                    }

                    // Check if the current content has a full question
                    if (buffer.ToString().Contains("\"questions\":"))
                    {
                        var question = ParseQuestionFromBuffer(buffer.ToString());
                        quiz.Questions.Add(question);
                        buffer.Clear();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing chunk: {ex.Message}");
            }
        }

        return quiz;
    }

    private string ParseTitleFromBuffer(string bufferContent)
    {
        // Extract title from the buffer (basic extraction)
        var titleStart = bufferContent.IndexOf("\"title\":") + "\"title\":".Length;
        var titleEnd = bufferContent.IndexOf("\"", titleStart + 1);
        return bufferContent.Substring(titleStart + 1, titleEnd - titleStart - 1);
    }

    private QuestionDto ParseQuestionFromBuffer(string bufferContent)
    {
        // Extract question and answers from the buffer
        var question = new QuestionDto();

        var questionStart = bufferContent.IndexOf("\"text\":") + "\"text\":".Length;
        var questionEnd = bufferContent.IndexOf("\"", questionStart + 1);
        question.Text = bufferContent.Substring(questionStart + 1, questionEnd - questionStart - 1);

        // Extract answers
        var answerStart = bufferContent.IndexOf("\"answers\":") + "\"answers\":".Length;
        var answerJson = bufferContent.Substring(answerStart);

        var answers = JsonSerializer.Deserialize<List<AnswerDto>>(answerJson);
        question.Answers.AddRange(answers);

        return question;
    }
}

// Supporting models to parse the OpenAI chunk
public class OpenAiChunk
{
    public List<Choice>? choices { get; set; }

    public class Choice
    {
        public Delta? delta { get; set; }
    }

    public class Delta
    {
        public string? content { get; set; }
    }
}
