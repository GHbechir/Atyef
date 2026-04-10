# Architecture de la Plateforme Atyef

Ce document décrit l'architecture technique, la base de données et la structure fonctionnelle de la plateforme d'apprentissage musical **Atyef**.

## 1. Stack Technique Globale

Le projet est construit sur des technologies modernes pour assurer performance, sécurité, et une excellente expérience utilisateur (Cinematic Liquid Glass Design).

```mermaid
graph TD
    Client[Navigateur Web / Mobile] -->|Requêtes HTTP / WebSockets| NextJS[Framework: Next.js 16 App Router]
    
    subgraph Frontend [Couche Présentation (React 19)]
        Tailwind[Tailwind CSS v4 + Oklch]
        Shadcn[Composants Shadcn/UI & Base-UI]
        Framer[Animations Framer Motion]
        Zustand[Gestion d'État Zustand]
    end
    
    subgraph Backend [Couche Backend & API (Node.js/Next.js)]
        ServerActions[Next.js Server Actions]
        PrismaORM[Prisma ORM (v7)]
        Auth[Clerk: Authentification]
        Payments[Stripe: Paiements & Abos]
    end
    
    subgraph Database [Couche Données]
        Postgres[(PostgreSQL)]
    end

    NextJS --> Frontend
    NextJS --> Backend
    Backend --> PrismaORM
    PrismaORM --> Postgres
```

---

## 2. Structure du Routage (App Router)

Atyef sépare intelligemment l'accès entre le public et les trois rôles spécifiques, protégeant ainsi l'accès de chaque espace :

```mermaid
mindmap
  root((Atyef))
    (public)
      Accueil /
      A Propos /about
      Offres & Tarifs /pricing
      Bibliothèque de Cours /courses
    (auth)
      Inscription /sign-up
      Connexion /sign-in
    (dashboard)
      Apprenant /learn
        Tableau de bord /learn/dashboard
        Cours en cours /learn/courses
        Outils interactifs /learn/tools
        Gestion Famille /learn/family
      Enseignant /teach
        Tableau de bord /teach
        Gestion des cours /teach/courses
        Retours vidéos /teach/feedbacks
      Administrateur /admin
        Vue globale /admin
        Analytics & Finances /admin/finances
        Utilisateurs /admin/users
```

---

## 3. Schéma de Base de Données

Les données sont hautement relationnelles pour faciliter l'affiliation et la gamification.

```mermaid
erDiagram
    USER ||--o{ ENROLLMENT : "s'inscrit"
    USER ||--o{ COURSE : "enseigne (Si Teacher)"
    USER ||--o| SUBSCRIPTION : "possède"
    USER ||--o{ PROGRESS : "suit"
    USER ||--o{ BADGELINK : "débloque"

    COURSE ||--o{ LESSON : "contient"
    COURSE ||--|| INSTRUMENT : "est associé"
    COURSE ||--o{ ENROLLMENT : "a des inscrits"

    LESSON ||--o{ RESOURCE : "possède des fichiers"
    LESSON ||--o{ PROGRESS : "a des statistiques"

    FAMILYGROUP ||--o{ USER : "contient des membres"

    USER {
        string role "LEARNER | TEACHER | ADMIN"
        string clerkId
        int totalXp
        int currentStreak
    }

    COURSE {
        string title
        string level "BEGINNER | INTERMEDIATE | ADVANCED"
        string style
        int duration
    }

    LESSON {
        string title
        string videoUrl
        int duration "en secondes"
    }

    PROGRESS {
        int watchedSeconds "utilisé pour la rémunération"
        boolean completed
    }
```

---

## 4. Logique Métier : Rémunération des Professeurs

L'une des complexités de l'architecture backend est le moteur de calculation instantanée permettant de répartir l'argent selon le temps passé.

```mermaid
sequenceDiagram
    participant Learner as Apprenant
    participant Backend as Serveur Next.js
    participant DB as Base de Données
    participant Admin as Espace Admin (Finances)

    Learner->>Backend: Regarde une vidéo (500 secondes)
    Backend->>DB: Met à jour LessonProgress (watchedSeconds += 500)
    DB-->>Backend: OK
    
    Admin->>Backend: Ouvre la page /admin/finances
    Backend->>DB: Agrège sum(watchedSeconds) groupé par cours & leçon
    DB-->>Backend: [Statistiques brutes]
    Backend->>Backend: Calcule pour chaque leçon : (Vu / (Durée * Elèves)) * 100
    Backend->>Backend: Multiplie par Taux (ex: 5€/heure)
    Backend-->>Admin: Affiche le tableau par Enseignant (Dette nette + Quotas)
```

---

## 5. Gestion des Outils d'Apprentissage (Interactive)

Tous les outils (Virtual Piano, Guitar Tab, Drum Machine) ne communiquent avec le backend que pour synchroniser la progression ou sauvegarder un exercice. Le traitement musical principal est géré côté "Client" pour qu'il n'y ait aucune latence (0 lag).

```mermaid
graph LR
    A[Outils Next.js Client 'use client'] --> B(AudioContext / WebMIDI API)
    A --> C(Canvas 2D Rendering)
    A -->|Seulement à la fin| D{Zustand Store}
    D -->|Sauvegarder stats| E[(PostgreSQL)]
```
