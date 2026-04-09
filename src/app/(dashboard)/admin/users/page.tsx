"use client";

import { motion } from "framer-motion";
import { Search, MoreVertical, Shield, ShieldOff, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockUsers = [
  { id: "1", name: "Marie Laurent", email: "marie.l@email.com", role: "LEARNER", plan: "VIP", joined: "12 Oct 2025", status: "ACTIVE" },
  { id: "2", name: "Thomas Dubois", email: "tdubois@email.com", role: "LEARNER", plan: "BASIC", joined: "05 Nov 2025", status: "ACTIVE" },
  { id: "3", name: "Sophie Martin", email: "smartin.prof@email.com", role: "TEACHER", plan: "N/A", joined: "14 Jan 2024", status: "ACTIVE" },
  { id: "4", name: "Lucas Moreau", email: "l.moreau99@email.com", role: "LEARNER", plan: "FREE", joined: "20 Fév 2026", status: "INACTIVE" },
  { id: "5", name: "Admin Sys", email: "admin@atyef.com", role: "ADMIN", plan: "N/A", joined: "01 Jan 2024", status: "ACTIVE" },
  { id: "6", name: "Élève Suspendu", email: "troll@email.com", role: "LEARNER", plan: "FREE", joined: "15 Mar 2026", status: "BANNED" },
];

function RoleBadge({ role }: { role: string }) {
  if (role === "ADMIN") return <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/30">Admin</Badge>;
  if (role === "TEACHER") return <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30">Professeur</Badge>;
  return <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Apprenant</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ACTIVE") return <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Actif</span>;
  if (status === "BANNED") return <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Banni</span>;
  return <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Inactif</span>;
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading text-white mb-1">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground text-sm">Gérez les comptes, les rôles et modérez la plateforme.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher par nom, email ou ID..." className="pl-9 bg-white/5 border-white/10 text-white h-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[150px] bg-white/5 border-white/10 text-white h-10">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="LEARNER">Apprenants</SelectItem>
            <SelectItem value="TEACHER">Professeurs</SelectItem>
            <SelectItem value="ADMIN">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div
        className="glass-card rounded-xl overflow-hidden border border-white/5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5">
                <TableHead className="text-muted-foreground">Utilisateur</TableHead>
                <TableHead className="text-muted-foreground">Rôle</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Abonnement</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Inscription</TableHead>
                <TableHead className="text-muted-foreground">Statut</TableHead>
                <TableHead className="text-right text-muted-foreground border-0">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} className="border-white/5 hover:bg-white/3">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] text-white font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground">{user.plan}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">{user.joined}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-white/5 transition-colors w-8 h-8 text-muted-foreground hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Mail className="w-3.5 h-3.5 mr-2" /> Contacter</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Shield className="w-3.5 h-3.5 mr-2" /> Changer le rôle
                        </DropdownMenuItem>
                         <DropdownMenuSeparator />
                        {user.status !== "BANNED" ? (
                          <DropdownMenuItem className="text-destructive">
                            <ShieldOff className="w-3.5 h-3.5 mr-2" /> Bannir l&apos;utilisateur
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-emerald-400">
                             <Shield className="w-3.5 h-3.5 mr-2" /> Révoquer le ban
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
