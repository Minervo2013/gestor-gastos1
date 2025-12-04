"use client"

import type { User } from "./types"

export function getUsers(): User[] {
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

export function saveUser(user: User): void {
  const users = getUsers()
  users.push(user)
  localStorage.setItem("users", JSON.stringify(users))
}

export function getUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find((u) => u.email === email) || null
}

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem("currentUser")
  return userJson ? JSON.parse(userJson) : null
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export function logout(): void {
  localStorage.removeItem("currentUser")
}

// Crear usuario admin por defecto
export function initializeAdmin(): void {
  const users = getUsers()
  const adminExists = users.some((u) => u.isAdmin)

  if (!adminExists) {
    const adminUser: User = {
      id: "admin-1",
      email: "admin@pueblaequipo.com.ar",
      nombre: "Administrador",
      sector: "Administración",
      tarjetaUltimos4: "0000",
      isAdmin: true,
      isCodeVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    saveUser(adminUser)
  }
}

// Función para migrar datos del localStorage a la base de datos
export async function migrateLocalDataToDatabase(): Promise<void> {
  try {
    const users = getUsers()
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]")

    if (users.length > 0 || expenses.length > 0) {
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users, expenses }),
      })

      const result = await response.json()
      if (result.success) {
        console.log('Migración completada:', result.message)
      }
    }
  } catch (error) {
    console.error('Error durante la migración:', error)
  }
}
