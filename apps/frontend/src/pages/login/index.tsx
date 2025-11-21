/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GET_GOOGLE_OAUTH_URL, LOGIN_MUTATION, REGISTER_MUTATION } from '@/graphql/auth'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useLazyQuery, useMutation } from '@apollo/client/react'
import { Code2Icon, TriangleAlertIcon, CheckCircle2Icon, XCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Meta from '@/components/utils/metadata'

interface GetGoogleOauthUrlData {
  getGoogleOauthUrl: string
}

interface RegisterOutput {
  register: string
}

interface LoginOutput {
  login: string
}

interface LoginInput {
  username: string
  password: string
}

interface RegisterInput {
  email: string
  firstName: string
  lastName: string
  password: string
  username: string
}

interface PasswordStrength {
  score: number
  label: string
  color: string
  checks: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    number: boolean
    special: boolean
  }
}

function redirectURIAlertParser(url: string) {
  if (url === '/') return 'Home Page'
  if (url === '/profile') return 'Your Profile'
  if (url === '/settings') return 'Settings Page'
  if (url === '/create/blog') return 'Create Blog Page'
  if (url === '/create/project') return 'Create Project Page'
  if (url.startsWith('/user/')) return `@${url.replace('/user/', '')} Profile`
  if (url.startsWith('/blog/'))
    return `Blog: ${url.split('/')[url.split('/').length - 1].replaceAll('-', ' ')} by @${url.split('/blog/')[1].split('/')[0]}`
  return url
}

export default function Login() {
  const { user } = useAppSelector((state) => state.auth)
  const [getUrl, { data, error }] = useLazyQuery<GetGoogleOauthUrlData>(GET_GOOGLE_OAUTH_URL)
  const [login, { loading: loginLoading, error: loginError }] = useMutation<LoginOutput>(LOGIN_MUTATION)
  const [register, { loading: registerLoading, error: registerError }] = useMutation<RegisterOutput>(REGISTER_MUTATION)
  const [currentRedirectUrl, setCurrentRedirectUrl] = useState('')
  const [activeTab, setActiveTab] = useState('login')
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  // Login form state
  const [loginForm, setLoginForm] = useState<LoginInput>({
    username: '',
    password: '',
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterInput>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    username: '',
  })

  const changeTab = (tab: string) => {
    //Clear form states when switching tabs
    setLoginForm({
      username: '',
      password: '',
    })
    setRegisterForm({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      username: '',
    })
    setConfirmPassword('')
    setActiveTab(tab)
  }

  useEffect(() => {
    if (user) {
      window.location.href = '/profile'
    }
  }, [user])

  useEffect(() => {
    // const params = new URLSearchParams(window.location.search)
    // const redirect = params.get('redirect')
    const error = searchParams.get('error')
    if(error){
      if(error === "deactivated"){
        setErrorMessage('Your account has been deactivated due to violations of our community guidelines.');
      }
    }
    const redirect = searchParams.get('redirect')
    if (redirect) {
      // Check redirect is contains admin
      if(redirect.includes('admin')) {
        setSearchParams((prev)=>{
          prev.delete('redirect')
          return prev
        })
        setCurrentRedirectUrl('/profile')
      }else{
        setCurrentRedirectUrl(redirect)
      }
    } else {
      setCurrentRedirectUrl('/profile')
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (loginError) toast.error(loginError.message)
  }, [loginError])

  useEffect(() => {
    if (registerError) toast.error(registerError.message)
  }, [registerError])

  useEffect(() => {
    if (data) {
      window.location.href = data.getGoogleOauthUrl
    }
  }, [data])

  const handleGoogleLogin = async () => {
    await getUrl({ variables: { state: currentRedirectUrl } })
  }

  const passwordStrength = (password: string): PasswordStrength => {
    const checks = {
      length: password.length >= 8 && password.length <= 32,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    }

    const passedChecks = Object.values(checks).filter(Boolean).length

    if (passedChecks === 5) {
      return { score: 4, label: 'Strong', color: 'text-green-600', checks }
    } else if (passedChecks >= 4) {
      return { score: 3, label: 'Good', color: 'text-blue-600', checks }
    } else if (passedChecks >= 3) {
      return { score: 2, label: 'Fair', color: 'text-yellow-600', checks }
    } else if (passedChecks >= 1) {
      return { score: 1, label: 'Weak', color: 'text-orange-600', checks }
    } else {
      return { score: 0, label: 'Very Weak', color: 'text-red-600', checks }
    }
  }

  const strength = passwordStrength(registerForm.password)
  const passwordsMatch = registerForm.password === confirmPassword && confirmPassword !== ''

  const handleLogin = async (e: React.FormEvent, loginData?: LoginInput) => {
    e.preventDefault()
    try {
      const result = await login({
        variables: {
          input: loginData || loginForm,
        },
      })
      if (result.data?.login) {
        toast.success('Login successful!')
        navigate(currentRedirectUrl || '/profile')
      }
    } catch (err) {
      // Error handled by useEffect
    }
  }
  const isRegisterFormComplete = () => {
    return (
      registerForm.email !== '' &&
      registerForm.firstName !== '' &&
      registerForm.lastName !== '' &&
      registerForm.username !== '' &&
      registerForm.password !== ''
    )
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password strength
    if (strength.score < 3) {
      toast.error('Please use a stronger password')
      return
    }

    // Validate passwords match
    if (registerForm.password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const result = await register({
        variables: {
          input: registerForm,
        },
      })
      if (result.data?.register) {
        toast.success('Registration successful!')
        setActiveTab('login')
        setLoginForm({ username: registerForm.username, password: registerForm.password })
        handleLogin(e, { username: registerForm.username, password: registerForm.password })
      }
    } catch (err) {
      // Error handled by useEffect
    }
  }

  return (
    <>
      <Meta 
        title="Login | Only Geeks"
        description="Login to your Only Geeks account to share your projects and connect with the community."
        keywords="login, only geeks, user authentication"
        image=""
        url={window.location.href}
      />
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="space-y-2 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="rounded-lg bg-primary p-3">
                <Code2Icon className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight">OnlyGeeks</h1>
            <p className="text-pretty text-lg text-muted-foreground">Share your projects, inspire the community</p>
            {
              errorMessage && (
                <Alert className="text-left shadow-lg" variant={'destructive'}>
                  <TriangleAlertIcon size={16} />
                  <div className="flex-1">
                    <AlertTitle>Login Error</AlertTitle>
                    <AlertDescription>
                      {errorMessage}
                    </AlertDescription>
                  </div>
                </Alert>
              )
            }
            {currentRedirectUrl && currentRedirectUrl !== '/profile' && currentRedirectUrl !== '/' && (
              <Alert className="text-left shadow-lg" variant={'destructive'}>
                <TriangleAlertIcon size={16} />
                <div className="flex-1">
                  <AlertTitle>Login required!</AlertTitle>
                  <AlertDescription>
                    You will be redirected to{' '}
                    <span className="font-medium">{redirectURIAlertParser(currentRedirectUrl)}</span> after login
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </div>

          {/* Login/Register Card */}
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription className="text-pretty">
                Sign in to showcase your portfolio and connect with fellow students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={activeTab} onValueChange={changeTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger data-cy="tabs-login" value="login">
                    Login
                  </TabsTrigger>
                  <TabsTrigger data-cy="tabs-register" value="register">
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="Enter your username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        required
                        data-cy="input-login-username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        data-cy="input-login-password"
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loginLoading} data-cy="button-login">
                      {loginLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                  <p className="text-center text-sm text-muted-foreground">
                    No account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Create one
                    </button>
                  </p>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleGoogleLogin}
                    className="h-12 w-full text-base font-medium"
                    size="lg"
                    variant="default"
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstname">First Name</Label>
                        <Input
                          id="register-firstname"
                          type="text"
                          placeholder="John"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                          required
                          data-cy="input-register-firstName"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-lastname">Last Name</Label>
                        <Input
                          id="register-lastname"
                          type="text"
                          placeholder="Doe"
                          value={registerForm.lastName}
                          onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                          required
                          data-cy="input-register-lastName"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="john@example.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                        data-cy="input-register-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="johndoe"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        required
                        data-cy="input-register-username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        required
                        data-cy="input-register-password"
                      />
                      {(passwordFocused || registerForm.password) && (
                        <div className="space-y-2 rounded-md border border-border bg-muted/50 p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Password Strength:</span>
                            <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full ${
                                  // eslint-disable-next-line no-nested-ternary
                                  i < strength.score
                                    ? // eslint-disable-next-line no-nested-ternary
                                      strength.score === 4
                                      ? 'bg-green-600'
                                      : // eslint-disable-next-line no-nested-ternary
                                        strength.score === 3
                                        ? 'bg-blue-600'
                                        : strength.score === 2
                                          ? 'bg-yellow-600'
                                          : 'bg-orange-600'
                                    : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-2">
                              {strength.checks.length ? (
                                <CheckCircle2Icon className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <XCircleIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                              <span className={strength.checks.length ? 'text-foreground' : 'text-muted-foreground'}>
                                8-32 characters
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {strength.checks.uppercase ? (
                                <CheckCircle2Icon className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <XCircleIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                              <span className={strength.checks.uppercase ? 'text-foreground' : 'text-muted-foreground'}>
                                One uppercase letter
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {strength.checks.lowercase ? (
                                <CheckCircle2Icon className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <XCircleIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                              <span className={strength.checks.lowercase ? 'text-foreground' : 'text-muted-foreground'}>
                                One lowercase letter
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {strength.checks.number ? (
                                <CheckCircle2Icon className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <XCircleIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                              <span className={strength.checks.number ? 'text-foreground' : 'text-muted-foreground'}>
                                One number
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {strength.checks.special ? (
                                <CheckCircle2Icon className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <XCircleIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                              <span className={strength.checks.special ? 'text-foreground' : 'text-muted-foreground'}>
                                One special character
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setConfirmPasswordTouched(true)
                        }}
                        required
                        data-cy="input-register-confirmPassword"
                      />
                      {confirmPasswordTouched && confirmPassword && (
                        <div
                          className={`flex items-center gap-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {passwordsMatch ? (
                            <>
                              <CheckCircle2Icon className="h-4 w-4" />
                              <span>Passwords match</span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-4 w-4" />
                              <span>Passwords do not match</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      data-cy="button-register"
                      disabled={registerLoading || strength.score < 3 || !passwordsMatch || !isRegisterFormComplete()}
                    >
                      {registerLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleGoogleLogin}
                    className="h-12 w-full bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
                    size="lg"
                    variant="outline"
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </TabsContent>
              </Tabs>

              <Separator className="my-4" />

              <p className="text-pretty text-center text-xs text-muted-foreground">
                By continuing, you agree to our{' '}
                <a href="#" className="underline transition-colors hover:text-foreground">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline transition-colors hover:text-foreground">
                  Privacy Policy
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="space-y-2 text-center">
            <p className="text-pretty text-sm text-muted-foreground">
              New to OnlyGeeks? Join thousands of students sharing their journey
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Code2Icon className="h-3 w-3" /> Upload Projects
              </span>
              <span>•</span>
              <span>Share Blogs</span>
              <span>•</span>
              <span>Build Portfolio</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
