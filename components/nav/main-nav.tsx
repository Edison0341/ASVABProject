"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/supabase/supabase"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  description: string
}

export function MainNav() {
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Fetch categories
    fetchCategories()

    return () => subscription.unsubscribe()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      // Debug: Check if Supabase client is properly initialized
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Supabase client:', !!supabase)

      console.log('Fetching categories...')
      const { data, error, status, statusText } = await supabase
        .from('categories')
        .select('*')
      
      // Debug: Log the full response
      console.log('Supabase response:', {
        status,
        statusText,
        hasData: !!data,
        hasError: !!error,
        error: error ? JSON.stringify(error) : null
      })

      if (error) {
        console.error('Error details:', error)
        setError(`Failed to fetch categories: ${error.message || 'Unknown error'}`)
        return
      }

      console.log('Categories data:', data)
      if (!data || data.length === 0) {
        console.log('No categories found')
      }

      setCategories(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <NavigationMenu className="max-w-full w-full px-4 py-2">
      <NavigationMenuList className="w-full gap-6">
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Practice Tests Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Practice Tests</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {loading ? (
                <li className="p-4">Loading categories...</li>
              ) : error ? (
                <li className="p-4 text-red-500">Error: {error}</li>
              ) : categories.length === 0 ? (
                <li className="p-4">No categories available</li>
              ) : (
                categories.map((category) => (
                  <li key={category.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/practice/${category.id}`}
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        )}
                      >
                        <div className="text-sm font-medium leading-none">{category.name}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {category.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Progress Tracking - Only visible when logged in */}
        {user && (
          <NavigationMenuItem>
            <Link href="/progress" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                My Progress
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}

        {/* Auth buttons */}
        <NavigationMenuItem className="ml-auto">
          {user ? (
            <Button
              variant="outline"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <Link href="/auth" passHref>
              <Button>
                Sign In
              </Button>
            </Link>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
} 
