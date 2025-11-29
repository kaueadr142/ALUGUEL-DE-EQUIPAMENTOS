import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { Rental } from '@/types/equipment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, DollarSign } from 'lucide-react';

export default function History() {
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    const allRentals = storage.getRentals().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setRentals(allRentals);
  }, []);

  const getStatusBadge = (status: Rental['status']) => {
    const styles = {
      active: 'bg-accent/20 text-accent border-accent/50',
      completed: 'bg-green-500/20 text-green-400 border-green-500/50',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    const labels = {
      active: 'Ativo',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return (
      <Badge variant="outline" className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Histórico</h1>
          <p className="text-muted-foreground">Todos os aluguéis registrados no sistema</p>
        </div>

        <div className="space-y-4">
          {rentals.map((rental, index) => (
            <Card key={rental.id} className="bg-gradient-card border-border hover:shadow-[var(--shadow-glow)] transition-all animate-fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-foreground">{rental.equipmentName}</CardTitle>
                      {getStatusBadge(rental.status)}
                    </div>
                    <CardDescription>
                      Registrado em {new Date(rental.createdAt).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(rental.createdAt).toLocaleTimeString('pt-BR')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="font-medium text-foreground">{rental.clientName}</p>
                      <p className="text-xs text-muted-foreground">{rental.clientEmail}</p>
                      <p className="text-xs text-muted-foreground">{rental.clientPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Período</p>
                      <p className="font-medium text-foreground">
                        {new Date(rental.startDate).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-foreground">até</p>
                      <p className="font-medium text-foreground">
                        {new Date(rental.endDate).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {rental.totalDays} {rental.totalDays === 1 ? 'dia' : 'dias'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <DollarSign className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valores</p>
                      <p className="font-medium text-foreground">
                        R$ {rental.dailyRate.toFixed(2)}/dia
                      </p>
                      <p className="text-2xl font-bold text-accent mt-1">
                        R$ {rental.totalValue.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">valor total</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center md:justify-end">
                    <div className="text-center md:text-right">
                      <p className="text-sm text-muted-foreground mb-2">Status do Aluguel</p>
                      <div className="inline-flex">
                        {getStatusBadge(rental.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rentals.length === 0 && (
          <Card className="bg-gradient-card border-border">
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum aluguel registrado ainda.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
