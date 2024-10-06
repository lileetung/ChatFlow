'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, RotateCcw, Send, Check } from "lucide-react"

export function Page() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
    { role: 'user', content: 'hi' },
    { role: 'assistant', content: 'Sorry, there was an error processing your request.', error: true }
  ])
  const [input, setInput] = useState('')

  const handleSendMessage = async () => {
    if (input.trim() === '') return

    const newMessage = { role: 'user', content: input }
    setMessages([...messages, newMessage])
    setInput('')

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
      const data = await response.json()
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Sorry, there was an error processing your request.', error: true }])
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-gray-300">
      <header className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-[#4ade80]">Solwen AI</h1>
      </header>
      <ScrollArea className="flex-1 p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            {msg.role === 'assistant' && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#4ade80]">
                  <Check className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className={`bg-[#2a2a2a] rounded-lg p-3 ${msg.error ? 'text-red-400' : 'text-gray-300'}`}>
                    {msg.content}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    <button className="mr-2 hover:text-gray-300 flex items-center">
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </button>
                    <button className="hover:text-gray-300 flex items-center">
                      <RotateCcw className="w-3 h-3 mr-1" /> Retry
                    </button>
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
      </ScrollArea>
      <footer className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1 bg-[#2a2a2a] border-gray-700 text-gray-300 focus:border-[#4ade80] focus:ring-[#4ade80]"
          />
          <Button onClick={handleSendMessage} className="bg-[#4ade80] hover:bg-[#3bcd71] text-black">
            Send
          </Button>
        </div>
        <p className="mt-2 text-xs text-center text-gray-500">
          AI responses may contain inaccuracies. Please verify important information.
        </p>
      </footer>
    </div>
  )
}