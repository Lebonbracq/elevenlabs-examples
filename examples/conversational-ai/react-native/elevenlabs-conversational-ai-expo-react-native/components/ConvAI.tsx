"use dom";
import { useCallback, useEffect } from "react";
import { useConversation } from "@11labs/react";
import { View, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import tools from "../utils/tools";
import type { Message } from "./ChatMessage";

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    console.log(error);
    console.error("Microphone permission denied");
    return false;
  }
}

interface ConvAiDOMComponentProps {
  platform: string;
  get_battery_level: typeof tools.get_battery_level;
  change_brightness: typeof tools.change_brightness;
  flash_screen: typeof tools.flash_screen;
  onMessage: (message: Message) => void;
}

export default function ConvAiDOMComponent({
  platform,
  get_battery_level,
  change_brightness,
  flash_screen,
  onMessage,
}: ConvAiDOMComponentProps) {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onError: error => console.error("Error:", error),
  });

  const pulseAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);
  const glowAnim = new Animated.Value(0);
  const blurAnim = new Animated.Value(0);
  const floatAnim = new Animated.Value(0);

  useEffect(() => {
    if (conversation.status === "connected") {
      // Animation de flottement vertical
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animation de pulsation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animation de rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Animation de l'effet de lueur
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animation de flou
      Animated.loop(
        Animated.sequence([
          Animated.timing(blurAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(blurAnim, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
      glowAnim.setValue(0);
      blurAnim.setValue(0);
      floatAnim.setValue(0);
    }
  }, [conversation.status]);

  const startConversation = useCallback(async () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        damping: 10,
        mass: 0.5,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 4,
        mass: 0.5,
      }),
    ]).start();
    try {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        alert("No permission");
        return;
      }
      await conversation.startSession({
        agentId: "d6Q8ix7Tn32xMQ0e1y1A",
        dynamicVariables: {
          platform,
        },
        clientTools: {
          logMessage: async ({ message }) => {
            console.log(message);
          },
          get_battery_level,
          change_brightness,
          flash_screen,
        },
        onMessage: (message) => {
          onMessage({
            id: Math.random().toString(36).substring(7),
            text: message.message,
            sender: message.source,
            timestamp: new Date().toISOString(),
          });
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation, get_battery_level, change_brightness, flash_screen, onMessage]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#e6f3ff', '#ffffff']}
        locations={[0, 0.5, 1]}
        style={styles.background}
      />
      <Animated.View
        style={[
          styles.glowEffect,
          {
            transform: [
              { scale: pulseAnim },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              },
            ],
            opacity: glowAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.innerGlow,
          {
            transform: [
              { scale: pulseAnim },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['360deg', '0deg'],
                }),
              },
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -5],
                }),
              },
            ],
            opacity: glowAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.callButton,
          conversation.status === "connected" && styles.callButtonActive,
          {
            transform: [
              { scale: scaleAnim },
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -2],
                }),
              },
            ],
          },
        ]}
      >
        <Pressable
          style={styles.pressable}
          onPress={
            conversation.status === "disconnected"
              ? startConversation
              : stopConversation
          }
        >
          <View
            style={[
              styles.buttonInner,
              conversation.status === "connected" && styles.buttonInnerActive,
            ]}
          >
            <Animated.View
              style={[
                styles.buttonCore,
                {
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.15],
                        outputRange: [1, 0.92],
                      }),
                    },
                  ],
                  opacity: blurAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 0.8],
                  }),
                },
              ]}
            />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowEffect: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(135, 206, 250, 0.06)',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 250, 0.1)',
  },
  innerGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(135, 206, 250, 0.12)',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 250, 0.15)',
  },
  callButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#87CEFA",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 250, 0.3)',
  },
  pressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    shadowColor: "#4169E1",
    shadowOpacity: 0.8,
    shadowRadius: 30,
    borderColor: 'rgba(65, 105, 225, 0.4)',
  },
  buttonInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(135, 206, 250, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#87CEFA",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonInnerActive: {
    backgroundColor: "rgba(65, 105, 225, 0.9)",
    shadowColor: "#4169E1",
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  buttonCore: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
});
