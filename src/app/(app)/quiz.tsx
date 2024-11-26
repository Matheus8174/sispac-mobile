import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native';

// import {
//   Play,
//   Book,
//   GamepadIcon,
//   HelpCircle,
//   Video,
//   Bell
// } from 'lucide-react-native';
import colors from '@/ui/colors';

const SafetyAppScreen = () => {
  const [activeTab, setActiveTab] = useState('tutoriais');

  const renderTutorials = () => (
    <View style={styles.content}>
      {/* Card Primeiros Socorros */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Primeiros Socorros</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardDescription}>
            Aprenda procedimentos básicos de primeiros socorros para situações
            de emergência.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Começar Tutorial</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Prevenção de Incêndios */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Prevenção de Incêndios</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardDescription}>
            Guia completo sobre prevenção e ação em casos de incêndio.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Guia</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Segurança em Casa */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Segurança em Casa</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardDescription}>
            Dicas e práticas para manter sua residência segura.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Ver Tutorial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderVideos = () => (
    <View style={styles.content}>
      {[
        { title: 'Como agir em assaltos', duration: '5:30' },
        { title: 'Evacuação de emergência', duration: '4:15' },
        { title: 'Defesa pessoal básica', duration: '8:45' }
      ].map((video, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.videoPreview}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{video.title}</Text>
            <Text style={styles.duration}>{video.duration}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderGames = () => (
    <View style={styles.content}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Simulador de Emergências</Text>
          <Text style={styles.cardDescription}>
            Pratique tomadas de decisão em situações de emergência.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Jogar Agora</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Desafio de Prevenção</Text>
          <Text style={styles.cardDescription}>
            Identifique riscos e aprenda a preveni-los.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Desafio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderQuizzes = () => (
    <View style={styles.content}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Quiz de Segurança Básica</Text>
          <Text style={styles.cardDescription}>
            Teste seus conhecimentos sobre segurança.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Começar Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Teste de Primeiros Socorros</Text>
          <Text style={styles.cardDescription}>
            Avalie seu preparo para emergências médicas.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Teste</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel Educacional</Text>
        {/* <Bell color={colors.orange[100]} size={40} /> */}
      </View>

      {/* Banner de Emergência */}
      <View style={styles.emergencyBanner}>
        <View style={styles.emergencyIcon}>
          <Text style={styles.emergencyIconText}>🚨</Text>
        </View>
        <View>
          <Text style={styles.emergencyTitle}>Emergência?</Text>
          <Text style={styles.emergencyText}>Ligue imediatamente para 190</Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tutoriais' && styles.activeTab]}
          onPress={() => setActiveTab('tutoriais')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'tutoriais' && styles.activeTabText
            ]}
          >
            📚
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'videos' && styles.activeTabText
            ]}
          >
            🎥
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'jogos' && styles.activeTab]}
          onPress={() => setActiveTab('jogos')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'jogos' && styles.activeTabText
            ]}
          >
            🎮
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quiz' && styles.activeTab]}
          onPress={() => setActiveTab('quiz')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'quiz' && styles.activeTabText
            ]}
          >
            ❓
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Content */}
        {activeTab === 'tutoriais' && renderTutorials()}
        {activeTab === 'videos' && renderVideos()}
        {activeTab === 'jogos' && renderGames()}
        {activeTab === 'quiz' && renderQuizzes()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010618'
  },
  scrollView: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  bellIcon: {
    fontSize: 24
  },
  emergencyBanner: {
    backgroundColor: '#FF4444',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  emergencyIcon: {
    backgroundColor: '#FF0000',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  emergencyIconText: {
    fontSize: 24
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  emergencyText: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a2035',
    margin: 16,
    borderRadius: 12,
    padding: 4
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8
  },
  activeTab: {
    backgroundColor: '#4F90F0'
  },
  tabText: {
    fontSize: 20
  },
  activeTabText: {
    color: '#FFFFFF'
  },
  content: {
    padding: 16
  },
  card: {
    backgroundColor: '#1a2035',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden'
  },
  cardHeader: {
    padding: 16
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8
  },
  cardContent: {
    padding: 16
  },
  cardDescription: {
    fontSize: 14,
    color: '#9BA3AF',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#4F90F0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  videoPreview: {
    height: 200,
    backgroundColor: '#2a3045',
    justifyContent: 'center',
    alignItems: 'center'
  },
  playIcon: {
    fontSize: 40,
    color: '#FFFFFF'
  },
  duration: {
    fontSize: 12,
    color: '#9BA3AF',
    marginTop: 4
  }
});

export default SafetyAppScreen;
