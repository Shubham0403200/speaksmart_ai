'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollToPlugin)

const MENU_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how' },
  { name: 'FAQs', href: '#faq' },
]

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useGSAP(() => {
      const menuEl = menuRef.current
      if (!menuEl) return

      if (menuOpen) {
        gsap.fromTo(menuEl,
          { y: -20, opacity: 0, display: 'none' },
          { y: 0, opacity: 1, display: 'flex', duration: 0.2, ease: 'power3.out' }
        )
      } else {
        gsap.to(menuEl, {y: -20,opacity: 0,duration: 0.2,ease: 'power2.in',
          onComplete: () => {gsap.set(menuEl, { display: 'none' })},
        })
      }
    },
    { dependencies: [menuOpen] } 
  )

  if (pathname.includes('/exam')) return null

  const handleScrollTo = (href: string) => {
    if (!href.startsWith('#')) return
    const target = document.querySelector(href)
    if (target) {
      gsap.to(window, { duration: 1, scrollTo: target, ease: 'power2.out' })
      setMenuOpen(false)
    }
  }

  return (
    <header className="fixed w-full z-21">
      <nav
        data-state={menuOpen ? 'active' : undefined}
        className="w-full group transition-all duration-300"
      >
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 lg:px-12 transition-all duration-300',
            isScrolled &&
              'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5'
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Logo */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block p-2.5 lg:hidden cursor-pointer"
              >
                <Menu
                  className={cn(
                    'm-auto size-4 duration-200',
                    menuOpen ? 'scale-0 opacity-0' : ''
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200',
                    menuOpen ? 'scale-100 opacity-100 rotate-0' : ''
                  )}
                />
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden lg:block absolute right-0 m-auto">
              <ul className="flex gap-8 text-base tracking-tight font-medium">
                {MENU_ITEMS.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleScrollTo(item.href)}
                      className="text-gray-700 hover:text-black duration-150 cursor-pointer"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile menu overlay (animated) */}
            <div
              ref={menuRef}
              className={cn(
                'bg-background lg:hidden mb-6 hidden w-full flex-col rounded-3xl border p-6 shadow-2xl shadow-zinc-600/20'
              )}
            >
              <ul className="space-y-6 text-base">
                {MENU_ITEMS.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleScrollTo(item.href)}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
