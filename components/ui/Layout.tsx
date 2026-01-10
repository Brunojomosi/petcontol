import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PawPrint, 
  Receipt, 
  Settings, 
  PlusCircle, 
  HeartPulse, 
  Menu, 
  X, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
  };

  const navItems = [
    { to: '/', label: 'Início', icon: LayoutDashboard },
    { to: '/pets', label: 'Pets', icon: PawPrint },
    { to: '/expenses', label: 'Gastos', icon: Receipt },
    { to: '/health', label: 'Saúde', icon: HeartPulse },
  ];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[110] md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center">
              <PawPrint className="h-7 w-7 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">PetControl</span>
            </div>
            <button onClick={closeMenu} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navegação</div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }) => `flex items-center px-6 py-4 text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon className="w-5 h-5 mr-4" />
                {item.label}
              </NavLink>
            ))}

            <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preferências</div>
            <NavLink
              to="/settings"
              onClick={closeMenu}
              className={({ isActive }) => `flex items-center px-6 py-4 text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Settings className="w-5 h-5 mr-4" />
              Configurações
            </NavLink>
          </nav>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleSignOut}
              className="flex items-center w-full px-6 py-4 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5 mr-4" />
              Sair da Conta
            </button>
          </div>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-[60] h-16 flex items-center shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={toggleMenu}
                className="md:hidden p-2 -ml-2 text-gray-500 hover:text-primary transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div 
                className="flex items-center cursor-pointer ml-2 md:ml-0" 
                onClick={() => navigate('/')}
              >
                <PawPrint className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold text-gray-900 hidden xs:block">PetControl</span>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8 items-center h-16">
              {navItems.map((item) => (
                <NavLink 
                  key={item.to}
                  to={item.to} 
                  className={({ isActive }) => isActive ? "text-primary font-medium border-b-2 border-primary h-full flex items-center" : "text-gray-500 hover:text-gray-900 h-full flex items-center"}
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink to="/settings" className={({ isActive }) => isActive ? "text-primary font-medium border-b-2 border-primary h-full flex items-center" : "text-gray-500 hover:text-gray-900 h-full flex items-center"}>Config</NavLink>
            </nav>

            <div className="flex items-center gap-2">
              <NavLink to="/add-expense" className="bg-primary hover:bg-green-600 text-white px-4 py-2 rounded-full hidden md:flex items-center shadow-sm transition-colors">
                <PlusCircle className="w-4 h-4 mr-2" /> Novo Gasto
              </NavLink>
              <div className="md:hidden">
                 <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable but contained */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 md:pb-8 relative bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-[10px] mt-1">Início</span>
          </NavLink>
          
          <NavLink to="/pets" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            <PawPrint className="h-6 w-6" />
            <span className="text-[10px] mt-1">Pets</span>
          </NavLink>

          <NavLink to="/add-expense" className="flex flex-col items-center justify-center w-full h-full -mt-10">
            <div className="bg-primary text-white rounded-full p-4 shadow-xl ring-4 ring-white active:scale-95 transition-transform">
              <PlusCircle className="h-7 w-7" />
            </div>
          </NavLink>

          <NavLink to="/expenses" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            <Receipt className="h-6 w-6" />
            <span className="text-[10px] mt-1">Gastos</span>
          </NavLink>

          <NavLink to="/health" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            <HeartPulse className="h-6 w-6" />
            <span className="text-[10px] mt-1">Saúde</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};