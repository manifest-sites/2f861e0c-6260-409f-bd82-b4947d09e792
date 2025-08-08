import { useState, useEffect } from 'react'
import { Input, Button, List, Checkbox, Typography, Space, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import Monetization from './components/monetization/Monetization'
import { Item } from './entities/Item'

const { Title } = Typography

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    setLoading(true)
    try {
      const response = await Item.list()
      if (response.success) {
        setTodos(response.data)
      }
    } catch (error) {
      message.error('Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) {
      message.warning('Please enter a todo item')
      return
    }

    try {
      const response = await Item.create({
        title: newTodo,
        completed: false
      })
      if (response.success) {
        setTodos([...todos, response.data])
        setNewTodo('')
        message.success('Todo added successfully')
      }
    } catch (error) {
      message.error('Failed to add todo')
    }
  }

  const toggleTodo = async (id, completed) => {
    try {
      const response = await Item.update(id, { completed: !completed })
      if (response.success) {
        setTodos(todos.map(todo => 
          todo._id === id ? { ...todo, completed: !completed } : todo
        ))
      }
    } catch (error) {
      message.error('Failed to update todo')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await Item.delete?.(id)
      setTodos(todos.filter(todo => todo._id !== id))
      message.success('Todo deleted successfully')
    } catch (error) {
      message.error('Failed to delete todo')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <Monetization>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Title level={1} className="text-center text-gray-800 mb-8">
              Todo App
            </Title>
            
            <Space.Compact className="w-full mb-6">
              <Input
                placeholder="Add a new todo..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                size="large"
                className="flex-1"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={addTodo}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Add
              </Button>
            </Space.Compact>

            <List
              loading={loading}
              dataSource={todos}
              locale={{ emptyText: 'No todos yet. Add one above!' }}
              renderItem={(todo) => (
                <List.Item
                  key={todo._id}
                  className="border-b border-gray-100 last:border-b-0"
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteTodo(todo._id)}
                      className="text-red-500 hover:text-red-600"
                    />
                  ]}
                >
                  <div className="flex items-center w-full">
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo._id, todo.completed)}
                      className="mr-3"
                    />
                    <span 
                      className={`flex-1 text-base ${
                        todo.completed 
                          ? 'text-gray-500 line-through' 
                          : 'text-gray-800'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                </List.Item>
              )}
            />

            <div className="mt-6 text-center text-gray-500">
              <p className="text-sm">
                {todos.filter(todo => !todo.completed).length} of {todos.length} todos remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </Monetization>
  )
}

export default App