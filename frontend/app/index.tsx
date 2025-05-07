import { useState } from "react";
import { Button, Text, TextInput, View, Alert } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Index() {
  const [topic, setTopic] = useState("");
  const [submitRequest, setSubmitRequest] = useState(false);
  const [podcast, setPodcast] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = async () => {
  //   if (!topic.trim()) {
  //     Alert.alert("Error", "Please enter a topic");
  //     return;
  //   }
  //   await generatePodcast();
  // };

  // const generatePodcast = async () => {
  //   try {
  //     setIsLoading(true);
  //     const apiKey = process.env.GEMINI_API_KEY;
      
  //     if (!apiKey) {
  //       throw new Error("API key is not configured. Please check your environment variables.");
  //     }

  //     const genAI = new GoogleGenerativeAI(apiKey);
  //     const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Changed to gemini-pro as it's more stable
      
  //     const prompt = "Generate a podcast script for the following topic: " + topic;
  //     const result = await model.generateContent(prompt);
  //     const response = await result.response;
  //     setPodcast(response.text());
  //     setSubmitRequest(true);
  //   } catch (error) {
  //     console.error("Error generating podcast:", error);
  //     Alert.alert(
  //       "Error",
  //       "Failed to generate podcast. Please check your API key and try again."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // TODO: Add the generate podcast function by calling the backend API 
  // and then display the podcast on the screen
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Podcast Generator</Text>

      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          width: '100%',
          marginBottom: 12,
          paddingHorizontal: 8,
          borderRadius: 5,
        }}
        placeholder="Enter topic"
        value={topic}
        onChangeText={setTopic}
      />

      <Button
        title={isLoading ? "Generating..." : "Generate Podcast"}
        onPress={() => {}}
        disabled={isLoading}
      />

      {submitRequest && podcast && (
        <View style={{ marginTop: 20, padding: 10, width: '100%' }}>
          <Text style={{ fontSize: 16, lineHeight: 24 }}>
            {podcast}
          </Text>
        </View>
      )}
    </View>
  );
}
