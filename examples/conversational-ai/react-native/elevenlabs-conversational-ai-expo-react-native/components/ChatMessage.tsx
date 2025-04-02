import { StyleSheet, Text, View } from "react-native";

export type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
};

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: "100%",
  },
  messageContainer: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
});
