'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { Search, Bell, Sun, Moon, Monitor, Plus, Database, FileText, Users, BarChart3, MoreVertical, Calendar, Edit, Share2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, theme, setTheme, brightness, setBrightness, notifications } = useStore()
  const [databases, setDatabases] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showBrightness, setShowBrightness] = useState(false)
  const [createDatabaseModal, setCreateDatabaseModal] = useState(false)
  const [newDatabaseName, setNewDatabaseName] = useState('')
  const [editingDatabase, setEditingDatabase] = useState<{id: string, name: string} | null>(null)

  useEffect(() => {
    loadDatabases()
  }, [])

  const loadDatabases = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) return

      // Fetch databases for current user
      const { data: dbData, error: dbError } = await supabase
        .from('databases')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (dbError) {
        console.error('Error loading databases:', dbError)
        toast.error('Failed to load databases')
        return
      }

      // Fetch exams for each database
      const databasesWithExams = await Promise.all(
        (dbData || []).map(async (db) => {
          const { data: examsData } = await supabase
            .from('exams')
            .select('id, title, status')
            .eq('database_id', db.id)
            .order('created_at', { ascending: false })
            .limit(3)

          return {
            id: db.id,
            name: db.name,
            examsCount: examsData?.length || 0,
            createdAt: new Date(db.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            recentExams: examsData || [],
          }
        })
      )

      setDatabases(databasesWithExams)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load databases')
    }
  }

  const handleCreateDatabase = async () => {
    if (!newDatabaseName.trim()) {
      toast.error('Please enter a database name')
      return
    }

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        toast.error('Not authenticated')
        return
      }

      if (editingDatabase) {
        // Update existing database
        const { error } = await supabase
          .from('databases')
          .update({ name: newDatabaseName.trim() })
          .eq('id', editingDatabase.id)
          .eq('user_id', currentUser.id)

        if (error) {
          console.error('Error updating database:', error)
          toast.error('Failed to update database')
          return
        }

        toast.success('Database updated successfully!')
      } else {
        // Create new database
        const { data, error } = await supabase
          .from('databases')
          .insert([
            {
              user_id: currentUser.id,
              name: newDatabaseName.trim(),
            },
          ])
          .select()

        if (error) {
          console.error('Error creating database:', error)
          toast.error('Failed to create database')
          return
        }

        toast.success('Database created successfully!')
      }

      setCreateDatabaseModal(false)
      setNewDatabaseName('')
      setEditingDatabase(null)
      loadDatabases()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to save database')
    }
  }

  const handleEditDatabase = (database: any) => {
    setEditingDatabase({ id: database.id, name: database.name })
    setNewDatabaseName(database.name)
    setCreateDatabaseModal(true)
    setOpenDropdown(null)
  }

  const handleDeleteDatabase = async (databaseId: string) => {
    if (!confirm('Are you sure you want to delete this database? This will also delete all exams in this database.')) {
      return
    }

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        toast.error('Not authenticated')
        return
      }

      const { error } = await supabase
        .from('databases')
        .delete()
        .eq('id', databaseId)
        .eq('user_id', currentUser.id)

      if (error) {
        console.error('Error deleting database:', error)
        toast.error('Failed to delete database')
        return
      }

      toast.success('Database deleted successfully!')
      setOpenDropdown(null)
      loadDatabases()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to delete database')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />
      case 'dark':
        return <Moon className="w-5 h-5" />
      default:
        return <Monitor className="w-5 h-5" />
    }
  }

  const filteredDatabases = databases.filter((db) =>
    db.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search databases, exams..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3 ml-6">
            {/* Brightness */}
            <div className="relative">
              <button
                onClick={() => setShowBrightness(!showBrightness)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {getThemeIcon()}
              </button>
              {showBrightness && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Brightness
                    </span>
                    <span className="text-xs text-gray-500">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Notifications
                  </h3>
                  <p className="text-sm text-gray-500 text-center py-4">
                    No new notifications
                  </p>
                </div>
              )}
            </div>

            {/* User profile */}
            <div className="flex items-center gap-3 ml-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.fullName || 'User'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {databases.length === 0 
              ? "Get started by creating your first exam database." 
              : "Manage your exam databases and create professional assessments."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Databases
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {databases.length}
                </p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Exams</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {databases.reduce((acc, db) => acc + db.examsCount, 0)}
                </p>
                <p className="text-sm text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Published Exams
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {databases.reduce(
                    (acc, db) =>
                      acc + db.recentExams.filter((e: any) => e.status === 'published').length,
                    0
                  )}
                </p>
                <p className="text-sm text-green-600 mt-1">+15% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Databases */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Databases
          </h2>
          <button
            onClick={() => setCreateDatabaseModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Database
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatabases.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No databases yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first database to start building exams
              </p>
              <button
                onClick={() => setCreateDatabaseModal(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your First Database
              </button>
            </div>
          ) : (
            filteredDatabases.map((database) => (
            <div
              key={database.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {database.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {database.examsCount} exams
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === database.id ? null : database.id)
                    }
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                  {openDropdown === database.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                      <button 
                        onClick={() => handleEditDatabase(database)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <button 
                        onClick={() => handleDeleteDatabase(database.id)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4" />
                {database.createdAt}
              </div>

              {database.recentExams.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Recent exams:
                  </p>
                  <div className="space-y-1">
                    {database.recentExams.map((exam: any) => (
                      <div
                        key={exam.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {exam.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            exam.status === 'published'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}
                        >
                          {exam.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
          )}
        </div>
      </div>

      {/* Create Database Modal */}
      {createDatabaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingDatabase ? 'Edit Database' : 'Create New Database'}
            </h3>
            <input
              type="text"
              value={newDatabaseName}
              onChange={(e) => setNewDatabaseName(e.target.value)}
              placeholder="Enter database name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCreateDatabaseModal(false)
                  setEditingDatabase(null)
                  setNewDatabaseName('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDatabase}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {editingDatabase ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
