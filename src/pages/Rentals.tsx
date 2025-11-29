import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { Equipment, Rental } from '@/types/equipment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar as CalendarIcon, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Rentals() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Rental>>({});
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      calculateTotal();
    }
  }, [formData.startDate, formData.endDate, selectedEquipment]);

  const loadData = () => {
    setEquipment(storage.getEquipment());
    setRentals(storage.getRentals().filter(r => r.status === 'active'));
  };

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate || !selectedEquipment) return;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (days <= 0) {
      toast.error('Data final deve ser maior que a inicial');
      return;
    }

    const total = days * selectedEquipment.dailyRate;
    setFormData(prev => ({
      ...prev,
      totalDays: days,
      dailyRate: selectedEquipment.dailyRate,
      totalValue: total
    }));
  };

  const handleEquipmentChange = (equipmentId: string) => {
    const eq = equipment.find(e => e.id === equipmentId);
    if (eq) {
      setSelectedEquipment(eq);
      setFormData(prev => ({ ...prev, equipmentId: eq.id, equipmentName: eq.name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.equipmentId || !formData.clientName || !formData.clientEmail || 
        !formData.clientPhone || !formData.startDate || !formData.endDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newRental: Rental = {
      id: Date.now().toString(),
      equipmentId: formData.equipmentId!,
      equipmentName: formData.equipmentName!,
      clientName: formData.clientName!,
      clientEmail: formData.clientEmail!,
      clientPhone: formData.clientPhone!,
      startDate: formData.startDate!,
      endDate: formData.endDate!,
      totalDays: formData.totalDays!,
      dailyRate: formData.dailyRate!,
      totalValue: formData.totalValue!,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    storage.addRental(newRental);
    storage.updateEquipment(formData.equipmentId!, { status: 'rented' });
    
    toast.success('Aluguel registrado com sucesso!');
    setIsDialogOpen(false);
    setFormData({});
    setSelectedEquipment(null);
    loadData();
  };

  const handleComplete = (rental: Rental) => {
    storage.updateRental(rental.id, { status: 'completed' });
    storage.updateEquipment(rental.equipmentId, { status: 'available' });
    toast.success('Aluguel finalizado com sucesso!');
    loadData();
  };

  const availableEquipment = equipment.filter(e => e.status === 'available');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Aluguéis</h1>
            <p className="text-muted-foreground">Gerencie os aluguéis de equipamentos</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground" onClick={() => {
                setFormData({});
                setSelectedEquipment(null);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Aluguel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Novo Aluguel</DialogTitle>
                <DialogDescription>Registre um novo aluguel de equipamento</DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipamento *</Label>
                  <Select value={formData.equipmentId} onValueChange={handleEquipmentChange}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecione um equipamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {availableEquipment.map(eq => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name} - R$ {eq.dailyRate}/dia
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome do Cliente *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName || ''}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Nome completo"
                      className="bg-secondary border-border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail || ''}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="email@exemplo.com"
                      className="bg-secondary border-border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Telefone *</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone || ''}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data Início *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data Fim *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                {formData.totalDays && formData.totalValue && (
                  <Card className="bg-accent/10 border-accent/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Dias</p>
                          <p className="text-2xl font-bold text-foreground">{formData.totalDays}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Diária</p>
                          <p className="text-2xl font-bold text-foreground">R$ {formData.dailyRate?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-2xl font-bold text-accent">R$ {formData.totalValue?.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-primary text-primary-foreground">
                    Registrar Aluguel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {rentals.map((rental, index) => (
            <Card key={rental.id} className="bg-gradient-card border-border hover:shadow-[var(--shadow-glow)] transition-all animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-accent" />
                      {rental.equipmentName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4" />
                      {rental.clientName}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleComplete(rental)}
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    Finalizar Aluguel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium text-foreground">{rental.clientName}</p>
                    <p className="text-xs text-muted-foreground">{rental.clientEmail}</p>
                    <p className="text-xs text-muted-foreground">{rental.clientPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Início</p>
                    <p className="font-medium text-foreground">
                      {new Date(rental.startDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fim</p>
                    <p className="font-medium text-foreground">
                      {new Date(rental.endDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Período</p>
                    <p className="font-medium text-foreground">{rental.totalDays} dias</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-2xl font-bold text-accent">R$ {rental.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rentals.length === 0 && (
          <Card className="bg-gradient-card border-border">
            <CardContent className="py-12 text-center">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum aluguel ativo. Clique em "Novo Aluguel" para começar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
