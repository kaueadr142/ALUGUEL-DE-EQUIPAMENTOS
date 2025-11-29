import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { Equipment } from '@/types/equipment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit, Server, Monitor, Wifi, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function Equipments() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Equipment>>({
    type: 'computer',
    status: 'available'
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = () => {
    setEquipment(storage.getEquipment());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.model || !formData.dailyRate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingId) {
      storage.updateEquipment(editingId, formData);
      toast.success('Equipamento atualizado com sucesso!');
    } else {
      const newEquipment: Equipment = {
        id: Date.now().toString(),
        name: formData.name!,
        type: formData.type as Equipment['type'],
        brand: formData.brand!,
        model: formData.model!,
        dailyRate: Number(formData.dailyRate),
        status: formData.status as Equipment['status'],
        description: formData.description,
        specifications: formData.specifications
      };
      storage.addEquipment(newEquipment);
      toast.success('Equipamento cadastrado com sucesso!');
    }

    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({ type: 'computer', status: 'available' });
    loadEquipment();
  };

  const handleEdit = (eq: Equipment) => {
    setFormData(eq);
    setEditingId(eq.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
      storage.deleteEquipment(id);
      toast.success('Equipamento excluído com sucesso!');
      loadEquipment();
    }
  };

  const getTypeIcon = (type: Equipment['type']) => {
    switch (type) {
      case 'computer': return <Monitor className="w-5 h-5" />;
      case 'server': return <Server className="w-5 h-5" />;
      case 'network': return <Wifi className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: Equipment['status']) => {
    const styles = {
      available: 'bg-green-500/20 text-green-400 border-green-500/50',
      rented: 'bg-accent/20 text-accent border-accent/50',
      maintenance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
    };
    const labels = {
      available: 'Disponível',
      rented: 'Alugado',
      maintenance: 'Manutenção'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Equipamentos</h1>
            <p className="text-muted-foreground">Gerencie seu inventário de equipamentos</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground" onClick={() => {
                setEditingId(null);
                setFormData({ type: 'computer', status: 'available' });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Equipamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingId ? 'Editar Equipamento' : 'Novo Equipamento'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do equipamento
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Equipamento *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Notebook Dell"
                      className="bg-secondary border-border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as Equipment['type'] })}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="computer">Computador</SelectItem>
                        <SelectItem value="server">Servidor</SelectItem>
                        <SelectItem value="network">Rede</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca *</Label>
                    <Input
                      id="brand"
                      value={formData.brand || ''}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Ex: Dell"
                      className="bg-secondary border-border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                      id="model"
                      value={formData.model || ''}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="Ex: Latitude 5520"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyRate">Valor Diária (R$) *</Label>
                    <Input
                      id="dailyRate"
                      type="number"
                      step="0.01"
                      value={formData.dailyRate || ''}
                      onChange={(e) => setFormData({ ...formData, dailyRate: parseFloat(e.target.value) })}
                      placeholder="0.00"
                      className="bg-secondary border-border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Equipment['status'] })}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="available">Disponível</SelectItem>
                        <SelectItem value="rented">Alugado</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição breve do equipamento"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specifications">Especificações Técnicas</Label>
                  <Textarea
                    id="specifications"
                    value={formData.specifications || ''}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    placeholder="Ex: Intel i7, 16GB RAM, SSD 512GB"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-primary text-primary-foreground">
                    {editingId ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((eq, index) => (
            <Card key={eq.id} className="bg-gradient-card border-border hover:shadow-[var(--shadow-glow)] transition-all animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg text-accent">
                      {getTypeIcon(eq.type)}
                    </div>
                    <div>
                      <CardTitle className="text-foreground">{eq.name}</CardTitle>
                      <CardDescription>{eq.brand} {eq.model}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(eq.status)}
                </div>
              </CardHeader>
              <CardContent>
                {eq.description && (
                  <p className="text-sm text-muted-foreground mb-3">{eq.description}</p>
                )}
                {eq.specifications && (
                  <p className="text-xs text-muted-foreground mb-3 font-mono">{eq.specifications}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-2xl font-bold text-accent">R$ {eq.dailyRate.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">por dia</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(eq)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(eq.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {equipment.length === 0 && (
          <Card className="bg-gradient-card border-border">
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum equipamento cadastrado. Clique em "Novo Equipamento" para começar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
