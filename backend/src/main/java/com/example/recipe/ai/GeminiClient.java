package com.example.recipe.ai;

import org.springframework.stereotype.Component;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@Component
public class GeminiClient {

    private final Client client;

    public GeminiClient() {
        this.client = new Client();
    }

    public String generate(String prompt) {

        GenerateContentResponse response = client.models.generateContent(
                "gemini-3-flash-preview",
                prompt,
                null);

        return response.text();
    }
}