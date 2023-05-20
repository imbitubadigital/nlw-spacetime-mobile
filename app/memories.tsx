import { ScrollView, TouchableOpacity, View, Text, Image } from 'react-native'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { api } from '../src/lib/api'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'

dayjs.locale(ptBR)

interface Memory {
  coverUrl: string
  excerpt: string
  createdAt: string
  id: string
}
export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const route = useRouter()

  const [memories, setMemories] = useState<Memory[]>([])

  async function signOut() {
    await SecureStore.deleteItemAsync('token')
    route.push('/')
  }

  async function loadMemory() {
    const token = await SecureStore.getItemAsync('token')

    const memoriesResponse = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setMemories(memoriesResponse.data)
  }

  useEffect(() => {
    loadMemory()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWLogo />
        <View className="flex-row gap-2">
          <TouchableOpacity
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
            onPress={signOut}
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity
              activeOpacity={0.7}
              className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
            >
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt=6 space-y-10">
        {memories.map((memory) => (
          <View key={memory.id} className="mt-6 space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-xs text-gray-100">
                {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
              </Text>
            </View>

            <View className="space-y-4 px-8">
              <Image
                source={{ uri: memory.coverUrl }}
                className="aspect-video w-full rounded-lg"
                alt=""
              />
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>

              <Link href="/memories/id">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center gap-2"
                >
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={14} color="#9292a0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
