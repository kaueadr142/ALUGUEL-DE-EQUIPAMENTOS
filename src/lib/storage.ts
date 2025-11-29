import { Equipment, Rental } from '@/types/equipment';

const EQUIPMENT_KEY = 'ti_rental_equipment';
const RENTAL_KEY = 'ti_rental_rentals';

export const storage = {
  // Equipment
  getEquipment(): Equipment[] {
    const data = localStorage.getItem(EQUIPMENT_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveEquipment(equipment: Equipment[]): void {
    localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(equipment));
  },

  addEquipment(equipment: Equipment): void {
    const current = this.getEquipment();
    this.saveEquipment([...current, equipment]);
  },

  updateEquipment(id: string, updates: Partial<Equipment>): void {
    const current = this.getEquipment();
    const updated = current.map(eq => eq.id === id ? { ...eq, ...updates } : eq);
    this.saveEquipment(updated);
  },

  deleteEquipment(id: string): void {
    const current = this.getEquipment();
    this.saveEquipment(current.filter(eq => eq.id !== id));
  },

  // Rentals
  getRentals(): Rental[] {
    const data = localStorage.getItem(RENTAL_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRentals(rentals: Rental[]): void {
    localStorage.setItem(RENTAL_KEY, JSON.stringify(rentals));
  },

  addRental(rental: Rental): void {
    const current = this.getRentals();
    this.saveRentals([...current, rental]);
  },

  updateRental(id: string, updates: Partial<Rental>): void {
    const current = this.getRentals();
    const updated = current.map(r => r.id === id ? { ...r, ...updates } : r);
    this.saveRentals(updated);
  },

  deleteRental(id: string): void {
    const current = this.getRentals();
    this.saveRentals(current.filter(r => r.id !== id));
  }
};
