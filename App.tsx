import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import GameWebView from './src/components/GameWebView';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setScore(0);
    setIsPlaying(true);
  };

  const stopGame = () => {
    setIsPlaying(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      {isPlaying ? (
        <View style={styles.gameContainer}>
          <GameWebView onScoreUpdate={setScore} />

          <View style={styles.hud}>
            <TouchableOpacity onPress={stopGame} style={styles.backButton}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>
            <Text style={styles.scoreText}>Score: {score}</Text>
            {/* Placeholder for right side balance */}
            <View style={{ width: 50 }} />
          </View>
        </View>
      ) : (
        <View style={styles.menuContainer}>
          <Text style={styles.title}>Target Shooter</Text>
          <Text style={styles.subtitle}>Hand Tracking AR</Text>

          <TouchableOpacity onPress={startGame} style={styles.startButton}>
            <Text style={styles.startButtonText}>START GAME</Text>
          </TouchableOpacity>

          <Text style={styles.instruction}>
            Hold phone in Landscape using both hands? No, place it down or hold in one hand.
            Use other hand to aim. Pinch Index+Thumb to shoot.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 24,
    color: '#ccc',
    marginBottom: 50,
  },
  instruction: {
    marginTop: 30,
    color: '#888',
    textAlign: 'center',
    maxWidth: 400,
  },
  startButton: {
    backgroundColor: '#00ff00',
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  gameContainer: {
    flex: 1,
  },
  hud: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 100,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 30,
    backdropFilter: 'blur(10px)',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
