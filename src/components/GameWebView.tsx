import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useCameraPermissions } from 'expo-camera';
import { gameHtml } from './gameHtml';

interface GameWebViewProps {
  onScoreUpdate: (score: number) => void;
}

export default function GameWebView({ onScoreUpdate }: GameWebViewProps) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    // Only request permission on native platforms using expo-camera
    if (Platform.OS !== 'web' && permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  // Web-specific message listener
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleMessage = (event: MessageEvent) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data && data.type === 'SCORE_UPDATE') {
            onScoreUpdate(data.score);
          }
        } catch (e) {
          // Ignore non-JSON messages (e.g. from webpack/dev tools)
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  if (Platform.OS !== 'web' && !permission) {
    return <View style={styles.container}><Text style={styles.text}>Checking permissions...</Text></View>;
  }

  if (Platform.OS !== 'web' && permission && !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission is required to play.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webview}>
        <iframe
          srcDoc={gameHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="camera; microphone"
          title="Game"
        />
      </View>
    );
  }

  return (
    <WebView
      style={styles.webview}
      source={{ html: gameHtml, baseUrl: 'https://localhost/' }}
      originWhitelist={['*']}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      mediaCapturePermissionGrantType="grant"
      onPermissionRequest={(event) => {
        event.grant();
      }}
      onMessage={(event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'SCORE_UPDATE') {
            onScoreUpdate(data.score);
          }
        } catch (e) {
          console.log("Message error: ", e);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00ff00',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
