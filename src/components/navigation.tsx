'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useConfig } from '@/hooks/useConfig'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Bricks', href: '/home/bricks' },
    { name: 'Concept', href: '/home/concept' },
    { name: 'Splash', href: '/home/splash' },
    { name: 'Wall', href: '/home/wall' },
    { name: 'Config', href: '/config' },
]

export function Navigation() {
    const router = useRouter()
    const { config } = useConfig()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            router.push(`/chat/${encodeURIComponent(searchTerm.trim())}`)
            setSearchTerm('')
            setIsSearchVisible(false)
        }
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsSearchVisible(false)
            setSearchTerm('')
        }
    }

    return (
        <nav className="bg-primary text-primary-foreground shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="text-2xl font-bold">WordChat</Link>
                            <span className="text-sm font-medium bg-white text-black px-2 py-0.5 rounded-md">
                                {config.knowledgeBase}
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex items-center">
                            {isSearchVisible ? (
                                <form onSubmit={handleSearch} className="flex items-center">
                                    <Input
                                        type="search"
                                        placeholder="Type and press Enter..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                        className="w-48 bg-primary-foreground text-primary"
                                        autoFocus
                                    />
                                </form>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSearchVisible(true)}
                                    className="hover:bg-primary-foreground hover:text-primary"
                                >
                                    <Search className="h-4 w-4" />
                                    <span className="sr-only">Search</span>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                        <div className="flex items-center mr-2">
                            {isSearchVisible ? (
                                <form onSubmit={handleSearch} className="flex items-center">
                                    <Input
                                        type="search"
                                        placeholder="Type and press Enter..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                        className="w-32 bg-primary-foreground text-primary"
                                        autoFocus
                                    />
                                </form>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSearchVisible(true)}
                                    className="hover:bg-primary-foreground hover:text-primary"
                                >
                                    <Search className="h-4 w-4" />
                                    <span className="sr-only">Search</span>
                                </Button>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
