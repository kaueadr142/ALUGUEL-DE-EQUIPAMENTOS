import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { Equipment, Rental } from '@/types/equipment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, DollarSign, Package, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    setEquipment(storage.getEquipment());
    setRentals(storage.getRentals());
  }, []);

  const availableCount = equipment.filter(e => e.status === 'available').length;
  const rentedCount = equipment.filter(e => e.status === 'rented').length;
  const activeRentals = rentals.filter(r => r.status === 'active');
  const totalRevenue = activeRentals.reduce((sum, r) => sum + r.totalValue, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema de aluguel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border hover:shadow-[var(--shadow-glow)] transition-all animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Equipamentos
              </CardTitle>
              <Package className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{equipment.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {availableCount} disponíveis
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:shadow-[var(--shadow-glow)] transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Equipamentos Alugados
              </CardTitle>
              <Server className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{rentedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeRentals.length} aluguéis ativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:shadow-[var(--shadow-glow)] transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Total
              </CardTitle>
              <DollarSign className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                R$ {totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Aluguéis ativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:shadow-[var(--shadow-glow)] transition-all animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Ocupação
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {equipment.length > 0 ? Math.round((rentedCount / equipment.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Equipamentos em uso
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-border animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-foreground">Equipamentos Disponíveis</CardTitle>
              <CardDescription>Últimos equipamentos adicionados</CardDescription>
            </CardHeader>
            <CardContent>
              {equipment.filter(e => e.status === 'available').slice(0, 5).length > 0 ? (
                <div className="space-y-3">
                  {equipment.filter(e => e.status === 'available').slice(0, 5).map(eq => (
                    <div key={eq.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{eq.name}</p>
                        <p className="text-sm text-muted-foreground">{eq.brand} {eq.model}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent">R$ {eq.dailyRate}/dia</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum equipamento disponível
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-foreground">Aluguéis Ativos</CardTitle>
              <CardDescription>Aluguéis em andamento</CardDescription>
            </CardHeader>
            <CardContent>
              {activeRentals.slice(0, 5).length > 0 ? (
                <div className="space-y-3">
                  {activeRentals.slice(0, 5).map(rental => (
                    <div key={rental.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{rental.equipmentName}</p>
                        <p className="text-sm text-muted-foreground">{rental.clientName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent">R$ {rental.totalValue.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{rental.totalDays} dias</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum aluguel ativo
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
