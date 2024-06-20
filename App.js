import { useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, ScrollView,
  ActivityIndicator, Alert, Keyboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const statusBarHeight = StatusBar.currentHeight;
const KEY_GPT = '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';

export default function App() {

  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState("")

  async function handleGenerate() {
    if (city === "") {
      Alert.alert("Atenção", "Preencha o nome da cidade!")
      return;
    }

    setTravel("")
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `Crie uma lista de perfumarias com um prazo de entrega dependendo do produto de ${days.toFixed(0)} dias na perfumaria selecionada de acordo com a cidade de ${city}, busque por perfumarias, perfumes mais amados e populares, seja preciso nos dias do prazo da entrega fornecidos e limite a lista apenas na cidade fornecida. Forneça apenas em tópicos com nome do local e perfumes da perfumaria, por exemplo: "Queridnhos"; "Promo da Semana"; etc.`

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log("Resposta da API:", data); // Adicionando log da resposta da API
        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
          console.log("Conteúdo do roteiro:", data.choices[0].message.content); // Adicionando log do conteúdo do roteiro
          setTravel(data.choices[0].message.content);
        } else {
          console.log("Dados da resposta não estão no formato esperado:", data); // Adicionando log se os dados da resposta não estiverem no formato esperado
          Alert.alert("Erro", "Não foi possível gerar o roteiro. Tente novamente mais tarde.");
        }
      })
      .catch((error) => {
        console.log("Erro ao processar resposta da API:", error); // Adicionando log de erro ao processar resposta da API
        Alert.alert("Erro", "Ocorreu um erro ao processar a resposta da API. Tente novamente mais tarde.");
      })
      .finally(() => {
        setLoading(false);
      })

  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#f0a199" />
      <Text style={styles.heading}>Hailley Perfumes</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Cidade</Text>
        <TextInput
          placeholder="Ex: Suzano, SP"
          style={styles.input}
          value={city}
          onChangeText={(text) => setCity(text)}
        />

        <Text style={styles.label}>Prazo de entrega: <Text style={styles.days}> {days.toFixed(0)} </Text> dias</Text>
        <Slider
          minimumValue={1}
          maximumValue={7}
          minimumTrackTintColor="#f0a199"
          maximumTrackTintColor="#000000"
          value={days}
          onValueChange={(value) => setDays(value)}
        />
      </View>
      <Pressable style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Procurar perfumarias</Text>
        {loading && (
          <ActivityIndicator color="#00e436" style={{ marginLeft: 8 }} />
        )}
        <MaterialIcons name="travel-explore" size={24} color="#FFF" />
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={styles.containerScroll} showsVerticalScrollIndicator={false} >
        {loading && (
          <View style={styles.content}>
            <Text style={styles.title}>Carregando perfumarias...</Text>
            <ActivityIndicator color="#00e436" size="large" />
          </View>
        )}

        {travel && (
          <View style={styles.content}>
            <Text style={styles.title}>Perfumarias 👇</Text>
            <Text style={{ lineHeight: 24, }}>{travel}</Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff1e8',
    alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#c2c3c7',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  days: {
    backgroundColor: '#F1f1f1'
  },
  button: {
    backgroundColor: '#ff004d',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#fff1e8',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }
});
