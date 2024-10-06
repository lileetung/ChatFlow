'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check } from "lucide-react"

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好！我是內部知識庫的AI助手。有什麼我可以協助你的嗎？' },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const defaultQuestions = [
    "公司的年度目標是什麼？",
    "如何申請年假？",
    "我們的主要競爭對手有哪些？",
    "公司的福利制度有哪些？"
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (message.trim() === '' || isLoading) return

    const newMessage = { role: 'user', content: message }
    setMessages(prevMessages => [...prevMessages, newMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to get reader from response')
      }

      let aiMessage = { role: 'assistant', content: '' }
      setMessages(prevMessages => [...prevMessages, aiMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        aiMessage.content += chunk
        setMessages(prevMessages => [...prevMessages.slice(0, -1), { ...aiMessage }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Sorry, there was an error processing your request.', error: true }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      <header className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-[#4ade80]">Solwen AI</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto max-w-4xl h-full flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {messages.map((msg, index) => (
              <div key={index} className="mb-4">
                {msg.role === 'assistant' && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#4ade80]">
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`bg-[#2a2a2a] rounded-lg p-3 ${(msg as { error?: boolean }).error ? 'text-red-400' : 'text-gray-300'}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="flex items-start space-x-2 justify-end">
                    <div className="flex-1">
                      <div className="bg-[#4ade80] text-black rounded-lg p-3">
                        {msg.content}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#4ade80] flex items-center justify-center text-black font-bold">
                      U
                    </div>
                  </div>
                )}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="mt-4">
                <p className="text-gray-400 mb-2">您可以從以下問題開始：</p>
                <div className="grid grid-cols-2 gap-2">
                  {defaultQuestions.map((question, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSendMessage(question)}
                      className="bg-[#2a2a2a] hover:bg-[#4ade80] hover:text-black text-gray-300 justify-start"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
          <footer className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSendMessage(input);
                  }
                }}
                className="flex-1 bg-[#2a2a2a] border-gray-700 text-gray-300 focus:border-[#4ade80] focus:ring-[#4ade80]"
                disabled={isLoading}
              />
              <Button 
                onClick={() => handleSendMessage(input)} 
                className="bg-[#4ade80] hover:bg-[#3bcd71] text-black"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
            <p className="mt-2 text-xs text-center text-gray-500">
              AI responses may contain inaccuracies. Please verify important information.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}