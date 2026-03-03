'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

// TypeScript Interfaces
interface User {
  id: string
  full_name: string
  email: string
  password: string
  username: string
}

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Register Form State
  const [registerData, setRegisterData] = useState({
    full_name: '',
    email: '',
    password: '',
    username: '',
  })
  const [registerLoading, setRegisterLoading] = useState(false)

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [loginLoading, setLoginLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem('current_user')
    if (currentUser) {
      router.push('/dashboard')
    }
  }, [router])

  // Handle Register Form Change
  const handleRegisterChange = (field: string, value: string) => {
    setRegisterData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle Login Form Change
  const handleLoginChange = (field: string, value: string) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Validate Register Form
  const validateRegisterForm = (): boolean => {
    if (!registerData.full_name.trim()) {
      toast({
        title: 'Hata',
        description: 'Lütfen adınızı ve soyadınızı giriniz.',
        variant: 'destructive',
      })
      return false
    }
    if (!registerData.email.trim() || !registerData.email.includes('@')) {
      toast({
        title: 'Hata',
        description: 'Lütfen geçerli bir e-posta adresi giriniz.',
        variant: 'destructive',
      })
      return false
    }
    if (!registerData.password.trim() || registerData.password.length < 6) {
      toast({
        title: 'Hata',
        description: 'Şifre en az 6 karakter olmalıdır.',
        variant: 'destructive',
      })
      return false
    }
    if (!registerData.username.trim()) {
      toast({
        title: 'Hata',
        description: 'Lütfen bir kullanıcı adı giriniz.',
        variant: 'destructive',
      })
      return false
    }
    return true
  }

  // Validate Login Form
  const validateLoginForm = (): boolean => {
    if (!loginData.email.trim()) {
      toast({
        title: 'Hata',
        description: 'Lütfen e-posta adresinizi giriniz.',
        variant: 'destructive',
      })
      return false
    }
    if (!loginData.password.trim()) {
      toast({
        title: 'Hata',
        description: 'Lütfen şifrenizi giriniz.',
        variant: 'destructive',
      })
      return false
    }
    return true
  }

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateRegisterForm()) return

    setRegisterLoading(true)

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Get existing users
      const mockUsersJSON = localStorage.getItem('mock_users')
      const mockUsers: User[] = mockUsersJSON ? JSON.parse(mockUsersJSON) : []

      // Check for duplicate email or username
      const emailExists = mockUsers.some(user => user.email === registerData.email)
      const usernameExists = mockUsers.some(user => user.username === registerData.username)

      if (emailExists) {
        toast({
          title: 'Hata',
          description: 'Bu e-posta adresi zaten kayıtlıdır.',
          variant: 'destructive',
        })
        setRegisterLoading(false)
        return
      }

      if (usernameExists) {
        toast({
          title: 'Hata',
          description: 'Bu kullanıcı adı zaten alınmıştır.',
          variant: 'destructive',
        })
        setRegisterLoading(false)
        return
      }

      // Create new user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        full_name: registerData.full_name,
        email: registerData.email,
        password: registerData.password, // In production, this would be hashed
        username: registerData.username,
      }

      // Save to mock_users
      mockUsers.push(newUser)
      localStorage.setItem('mock_users', JSON.stringify(mockUsers))

      // Auto-login
      localStorage.setItem('current_user', JSON.stringify(newUser))

      toast({
        title: 'Başarılı',
        description: 'Kayıt başarılı! Hoş geldiniz.',
      })

      // Redirect to dashboard
      router.push('/dashboard')
    } finally {
      setRegisterLoading(false)
    }
  }

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateLoginForm()) return

    setLoginLoading(true)

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Get existing users
      const mockUsersJSON = localStorage.getItem('mock_users')
      const mockUsers: User[] = mockUsersJSON ? JSON.parse(mockUsersJSON) : []

      // Find user with matching email and password
      const user = mockUsers.find(
        u => u.email === loginData.email && u.password === loginData.password
      )

      if (!user) {
        toast({
          title: 'Hata',
          description: 'E-posta veya şifre hatalı.',
          variant: 'destructive',
        })
        setLoginLoading(false)
        return
      }

      // Save current user
      localStorage.setItem('current_user', JSON.stringify(user))

      toast({
        title: 'Başarılı',
        description: 'Giriş başarılı! Hoş geldiniz.',
      })

      // Redirect to dashboard
      router.push('/dashboard')
    } finally {
      setLoginLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1e8] via-[#faf8f3] to-[#e8f5f0] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-[#2d5a4d] mb-2">PsyConnect</h1>
            <p className="text-sm text-[#6b8b81]">Profesyonel danışmanlık platformu</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#e8f5f0] mb-6">
              <TabsTrigger
                value="login"
                className="text-[#2d5a4d] data-[state=active]:bg-white data-[state=active]:text-[#2d5a4d]"
              >
                Giriş Yap
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="text-[#2d5a4d] data-[state=active]:bg-white data-[state=active]:text-[#2d5a4d]"
              >
                Kayıt Ol
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-[#2d5a4d]">
                    E-posta
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@mail.com"
                    value={loginData.email}
                    onChange={e => handleLoginChange('email', e.target.value)}
                    className="border-[#d4e4df] focus:border-[#9cccb8] bg-[#f9fdfb]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-[#2d5a4d]">
                    Şifre
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••"
                    value={loginData.password}
                    onChange={e => handleLoginChange('password', e.target.value)}
                    className="border-[#d4e4df] focus:border-[#9cccb8] bg-[#f9fdfb]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#2d5a4d] hover:bg-[#234741] text-white mt-6"
                >
                  {loginLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-[#2d5a4d]">
                    Ad Soyad
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    value={registerData.full_name}
                    onChange={e => handleRegisterChange('full_name', e.target.value)}
                    className="border-[#d4e4df] focus:border-[#9cccb8] bg-[#f9fdfb]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-[#2d5a4d]">
                    E-posta
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="example@mail.com"
                    value={registerData.email}
                    onChange={e => handleRegisterChange('email', e.target.value)}
                    className="border-[#d4e4df] focus:border-[#9cccb8] bg-[#f9fdfb]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-[#2d5a4d]">
                    Şifre
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••"
                    value={registerData.password}
                    onChange={e => handleRegisterChange('password', e.target.value)}
                    className="border-[#d4e4df] focus:border-[#9cccb8] bg-[#f9fdfb]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-username" className="text-[#2d5a4d]">
                    Kullanıcı Adı
                  </Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="johndoe"
                    value={registerData.username}
                    onChange={e => handleRegisterChange('username', e.target.value)}
                    className="border-[#d4e4df] focus:border-[#9cccb8] bg-[#f9fdfb]"
                  />
                  <p className="text-xs text-[#6b8b81] mt-1">
                    Bu kullanıcı adı randevu linkiniz için kullanılacaktır (örnek: site.com/johndoe/booking)
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full bg-[#2d5a4d] hover:bg-[#234741] text-white mt-6"
                >
                  {registerLoading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}
