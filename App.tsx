import React, { useEffect, useState, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/Dashboard';
import { PetList } from './components/PetList';
import { PetProfile } from './components/PetProfile';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/forms/ExpenseForm';
import { PetForm } from './components/forms/PetForm';
import { Reminders } from './components/Reminders';
import { Settings } from './components/Settings';
import { Auth } from './components/Auth';
import { AnimatePresence, motion } from 'framer-motion';

// Route hierarchy for direction detection
const ROUTE_WEIGHTS: Record<string, number> = {
    '/': 0,
    '/pets': 1,
    '/expenses': 1,
    '/health': 1,
    '/settings': 1,
    '/reset-password': 0,
    '/pets/:id': 2,
    '/pets/add': 2,
    '/pets/edit/:id': 3,
    '/add-expense': 2
};

const AnimatedRoutes = () => {
    const { session, loading } = useApp();
    const location = useLocation();
    const prevPathRef = useRef(location.pathname);
    const [direction, setDirection] = useState(1);

    // Detecção CRÍTICA de recuperação de senha
    // Mesmo com sessão ativa, se a URL contiver tokens de recuperação, mostramos a redefinição.
    const isRecoveryContext = window.location.hash.includes('type=recovery') || 
                              window.location.hash.includes('access_token=') ||
                              location.pathname === '/reset-password';

    useEffect(() => {
        const getWeight = (path: string) => {
            if (path.includes('/edit/')) return 3;
            if (path.startsWith('/pets/')) return 2;
            return ROUTE_WEIGHTS[path] ?? 0;
        };

        const prevWeight = getWeight(prevPathRef.current);
        const currWeight = getWeight(location.pathname);

        if (currWeight > prevWeight) setDirection(1);
        else if (currWeight < prevWeight) setDirection(-1);
        else setDirection(1);
        
        prevPathRef.current = location.pathname;
    }, [location.pathname]);

    useEffect(() => {
        if (!loading) {
            const splash = document.getElementById('splash-screen');
            if (splash) {
                splash.classList.add('fade-out');
                setTimeout(() => {
                    splash.style.display = 'none';
                    document.body.style.backgroundColor = '#F5F5F5';
                }, 500);
            }
        }
    }, [loading]);

    if (loading) return null;

    // Prioridade Máxima: Se estamos tentando redefinir senha, mostramos a tela de Auth
    if (isRecoveryContext) {
        return <Auth initialMode="updatePassword" />;
    }

    // Se não há sessão e não é recuperação, mostramos o Login normal
    if (!session) return <Auth />;

    const variants = {
        initial: (direction: number) => ({
            x: direction > 0 ? '100%' : '-30%',
            opacity: direction > 0 ? 1 : 0.8,
            zIndex: direction > 0 ? 2 : 1
        }),
        animate: {
            x: 0,
            opacity: 1,
            zIndex: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? '-30%' : '100%',
            opacity: direction > 0 ? 0.8 : 1,
            zIndex: direction > 0 ? 1 : 2,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        })
    };

    return (
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
                key={location.pathname}
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full"
            >
                <Routes location={location}>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="pets" element={<PetList />} />
                        <Route path="pets/:id" element={<PetProfile />} />
                        <Route path="pets/add" element={<PetForm />} />
                        <Route path="pets/edit/:id" element={<PetForm />} />
                        <Route path="expenses" element={<ExpenseList />} />
                        <Route path="add-expense" element={<ExpenseForm />} />
                        <Route path="health" element={<Reminders />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AnimatedRoutes />
      </HashRouter>
    </AppProvider>
  );
}

export default App;