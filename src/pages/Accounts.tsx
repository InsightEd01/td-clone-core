import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Send, Repeat, Receipt, Camera, CreditCard, PiggyBank, TrendingUp, AlertCircle, Eye, EyeOff, Download, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const accounts = [
  {
    id: "chq-001",
    name: "Unlimited Chequing",
    type: "Checking",
    accountNumber: "****6789",
    balance: 4800000.0,
    availableBalance: 4800000.0,
    interestRate: 0.05,
    lastStatement: "Jan 15, 2025",
    status: "Active",
    overdraftProtection: true,
    icon: CreditCard,
    color: "bg-emerald-500"
  },
  {
    id: "sav-001", 
    name: "Every Day Savings",
    type: "Savings",
    accountNumber: "****3421",
    balance: 4800000.0,
    availableBalance: 4800000.0,
    interestRate: 4.25,
    lastStatement: "Jan 15, 2025",
    status: "Active",
    overdraftProtection: false,
    icon: PiggyBank,
    color: "bg-blue-500"
  },

];

const recentTransactions = [
  { id: "1", description: "Deposit from Edward Smith", amount: 4800000.0, date: "Jan 22", type: "deposit" },

];

export default function Accounts() {
  const [showBalances, setShowBalances] = useState(true);
  const totalBalance = accounts.find(acc => acc.id === "chq-001")?.balance ?? 0;

  return (
    <MobileShell>
      <Seo title="Accounts — GreenBank" description="View and manage all your accounts." canonical={window.location.href} />
      
      {/* Header with Total Balance */}
      <section className="relative px-4 pt-6 pb-4 bg-gradient-to-b from-emerald-700 to-emerald-900 text-primary-foreground animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">My Accounts</h1>
            <p className="text-sm text-emerald-100">Updated just now</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => toast({ title: "Settings", description: "Account settings coming soon" })}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4">
          <p className="text-sm text-emerald-100 mb-1">Total Balance</p>
          <p className="text-3xl font-bold text-white">
            {showBalances ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD` : "••••••••"}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Send", icon: Send, to: "/payments/send" },
            { label: "Transfer", icon: Repeat, to: "/payments/transfer" },
            { label: "Bills", icon: Receipt, to: "/payments/bills" },
            { label: "Deposit", icon: Camera, to: "/payments/deposit" },
          ].map(({ label, icon: Icon, to }) => (
            <NavLink key={label} to={to} className="flex flex-col items-center">
              <Button
                variant="action"
                size="icon"
                className="h-14 w-14 rounded-full text-white 
                bg-gradient-to-b from-emerald-600/95 to-emerald-800/95 border border-white/20 
                shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_16px_rgba(0,0,0,0.35)] 
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_12px_20px_rgba(0,0,0,0.4)]"
              >
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </Button>
              <span className="mt-2 text-xs font-medium text-white/95">{label}</span>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Accounts List */}
      <section className="px-4 py-4 -mt-2">
        <div className="space-y-4">
          {accounts.map((account) => {
            const IconComponent = account.icon;
            const isCredit = account.type === "Credit Card";
            const displayBalance = isCredit ? account.availableBalance : account.balance;
            
            return (
              <NavLink 
                key={account.id} 
                to="/card" 
                className="block transition-all duration-200 hover:scale-[1.02]"
              >
                <Card className="border-0 shadow-md hover:shadow-lg bg-white">
                  <CardContent className="p-4">
                    
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {isCredit ? "Available Credit" : "Available Balance"}
                        </span>
                        <span className="text-lg font-bold text-foreground">
                          {showBalances 
                            ? `${displayBalance >= 0 ? '$' : '-$'}${Math.abs(displayBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                            : "••••••"
                          }
                        </span>
                      </div>
                      
                      {isCredit && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Current Balance</span>
                          <span className="text-sm font-medium text-red-600">
                            {showBalances 
                              ? `$${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                              : "••••••"
                            }
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                        <span className="text-xs text-muted-foreground">
                          {isCredit ? "APR" : "Interest Rate"}: {account.interestRate}%
                        </span>
                      </div>
                      
                      {account.overdraftProtection && (
                        <div className="flex items-center gap-1 pt-1">
                          <AlertCircle className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">Overdraft Protection Active</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </NavLink>
            );
          })}
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y">
              {recentTransactions.map((transaction, index) => (
                <div key={transaction.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-600' :
                      transaction.type === 'transfer' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {transaction.type === 'deposit' ? <TrendingUp className="h-4 w-4" /> :
                       transaction.type === 'transfer' ? <Repeat className="h-4 w-4" /> :
                       <CreditCard className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-foreground'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </MobileShell>
  );
}
