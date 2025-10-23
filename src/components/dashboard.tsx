t"use client"

import { useState } from "react"
import { Mail, Star } from "lucide-react"

interface Task {
  id: number
  type: "email" | "meeting"
  title: string
  name: string
  company: string
  date: string
  completed: boolean
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      type: "email",
      title: "Invia Email Step-1",
      name: "Mario Rossi",
      company: "Elettromec",
      date: "27/10/25",
      completed: false,
    },
    {
      id: 2,
      type: "meeting",
      title: "Incontro programmato con Mario Rossi",
      name: "Mario Rossi",
      company: "Elettromec",
      date: "6/11/25",
      completed: false,
    },
    {
      id: 3,
      type: "email",
      title: "Invia Email Step-2",
      name: "Mario Rossi",
      company: "Elettromec",
      date: "6/11/25",
      completed: false,
    },
    {
      id: 4,
      type: "meeting",
      title: "Incontro programmato con Viola Santi",
      name: "Viola Santi",
      company: "VAR",
      date: "15/11/25",
      completed: false,
    },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const generateCalendarDays = () => {
    const daysInMonth = 30
    const firstDayOfWeek = 6
    const days = []

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const weekDays = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f1f3d] rounded-3xl p-6 shadow-lg">
          <h3 className="text-white text-lg font-bold mb-2">Engagement Report</h3>
          <div className="text-white text-4xl font-bold">68%</div>
          <div className="text-green-400 text-sm font-semibold mt-1">+5%↑</div>
        </div>

        <div className="bg-[#0f1f3d] rounded-3xl p-6 shadow-lg">
          <h3 className="text-white text-lg font-bold mb-2">Meeting Success</h3>
          <div className="text-white text-4xl font-bold">42%</div>
          <div className="text-green-400 text-sm font-semibold mt-1">+3%↑</div>
        </div>

        <div className="bg-[#0f1f3d] rounded-3xl p-6 shadow-lg">
          <h3 className="text-white text-lg font-bold mb-2">Hot Lead</h3>
          <div className="text-white text-4xl font-bold">20</div>
        </div>
      </div>

      {/* Calendario */}
      {/*
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <button className="text-gray-400 hover:text-gray-600">←</button>
          <h3 className="text-gray-600 font-semibold">Novembre 2025</h3>
          <button className="text-gray-400 hover:text-gray-600">→</button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium pb-2">
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-sm ${
                day === null
                  ? ""
                  : day === 6
                    ? "border-2 border-blue-300 rounded-lg bg-blue-50 text-gray-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      */}

      {/* Task List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_200px_200px_150px] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="w-6"></div>
          <div className="text-gray-500 font-semibold text-sm">To-Do</div>
          <div className="text-gray-500 font-semibold text-sm">Nome</div>
          <div className="text-gray-500 font-semibold text-sm">Azienda</div>
          <div className="text-gray-500 font-semibold text-sm">Data</div>
        </div>

        <div className="divide-y divide-gray-100">
          {tasks.map((task) => (
            <div key={task.id} className="grid grid-cols-[auto_1fr_200px_200px_150px] gap-4 px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded border-gray-300 text-[#0f1f3d] focus:ring-[#0f1f3d] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3">
                {task.type === "email" ? (
                  <Mail className="w-5 h-5 text-gray-600" />
                ) : (
                  <Star className="w-5 h-5 text-gray-600 fill-gray-600" />
                )}
                <span className="text-gray-700 font-medium">{task.title}</span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-700">{task.name}</span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-700">{task.company}</span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-700">{task.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
