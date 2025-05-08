import { useState } from "react";
import { Button, Text, TextInput, View, Alert } from "react-native";

export default function Index() {
  const [topic, setTopic] = useState("");
  const [textContent, setTextContent] = useState("Podcast Summary");
  const [submitRequest, setSubmitRequest] = useState(false);
  const [podcast, setPodcast] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/podcast-summary`, {
        method: 'POST',
                 headers: {
                   'Content-Type': 'application/json'
                   },
                   body: JSON.stringify({
                     title: topic,
                     textContent: textContent
                    })
                 });
                 const data = await response.json();
                 setPodcast(data.podcast_script);
                 setSubmitRequest(true);
                 console.log(data);
               } catch(error) {
             Alert.alert('Error', 'Failed to generate podcast. Please try again.');
             console.log(error)
      } 
    };
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
        onPress={handleSubmit}
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
