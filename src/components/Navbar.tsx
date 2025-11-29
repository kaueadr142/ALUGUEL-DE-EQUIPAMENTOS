import { NavLink } from './NavLink';
import { Monitor, LayoutDashboard, PackagePlus, Calendar, History } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Monitor className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">TI Rental</h1>
              <p className="text-xs text-muted-foreground">Aluguel de Equipamentos</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <NavLink
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              activeClassName="bg-secondary text-foreground"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </NavLink>
            
            <NavLink
              to="/equipments"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              activeClassName="bg-secondary text-foreground"
            >
              <PackagePlus className="w-4 h-4" />
              <span className="hidden md:inline">Equipamentos</span>
            </NavLink>
            
            <NavLink
              to="/rentals"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              activeClassName="bg-secondary text-foreground"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden md:inline">Aluguéis</span>
            </NavLink>
            
            <NavLink
              to="/history"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              activeClassName="bg-secondary text-foreground"
            >
              <History className="w-4 h-4" />
              <span className="hidden md:inline">Histórico</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
