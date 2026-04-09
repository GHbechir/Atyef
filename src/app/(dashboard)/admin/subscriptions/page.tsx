"use client";

import { motion } from "framer-motion";
import { Search, CreditCard, ExternalLink, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const subscriptions = [
  { id: "sub_1", user: "Marie Laurent", email: "marie.l@email.com", plan: "VIP", amount: "14.90", status: "ACTIVE", nextBilling: "15 Mai 2026" },
  { id: "sub_2", user: "Thomas Dubois", email: "tdubois@email.com", plan: "BASIC", amount: "9.90", status: "ACTIVE", nextBilling: "02 Juin 2026" },
  { id: "sub_3", user: "Lucas Moreau", email: "l.moreau99@email.com", plan: "VIP", amount: "14.90", status: "CANCELED", nextBilling: "N/A" },
  { id: "sub_4", user: "Emma Petit", email: "emma.p@email.com", plan: "BASIC", amount: "9.90", status: "PAST_DUE", nextBilling: "En retard" },
  { id: "sub_5", user: "Hugo Dubois", email: "hugo.d@email.com", plan: "VIP", amount: "14.90", status: "ACTIVE", nextBilling: "22 Mai 2026" },
];

function SubStatusBadge({ status }: { status: string }) {
  if (status === "ACTIVE") return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Actif</Badge>;
  if (status === "PAST_DUE") return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">Paiement échoué</Badge>;
  return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30">Annulé</Badge>;
}

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white mb-1">Abonnements</h1>
          <p className="text-muted-foreground text-sm">Gérez les souscriptions et suivez les paiements via Stripe.</p>
        </div>
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
          <ExternalLink className="w-4 h-4 mr-2" /> Ouvrir Stripe
        </Button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher par email ou ID..." className="pl-9 bg-white/5 border-white/10 text-white h-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[150px] bg-white/5 border-white/10 text-white h-10">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="ACTIVE">Actifs</SelectItem>
            <SelectItem value="CANCELED">Annulés</SelectItem>
            <SelectItem value="PAST_DUE">En retard</SelectItem>
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
                <TableHead className="text-muted-foreground">Plan</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Montant</TableHead>
                <TableHead className="text-muted-foreground">Statut</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell text-right">Renouvellement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id} className="border-white/5 hover:bg-white/3">
                  <TableCell>
                    <div className="font-medium text-white text-sm">{sub.user}</div>
                    <div className="text-xs text-muted-foreground">{sub.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-purple-400 font-medium">{sub.plan}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">{sub.amount} € / mois</span>
                  </TableCell>
                  <TableCell>
                    <SubStatusBadge status={sub.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">
                    <span className="text-sm text-muted-foreground">{sub.nextBilling}</span>
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
