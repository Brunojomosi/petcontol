
import React, { useEffect, useRef } from 'react';
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

const AnimatedRoutes = () => {
    const { session, loading, isRecovering } = useApp();
    const location = useLocation();

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

    const fullUrl = window.location.href;
    const isRecoveryInUrl = fullUrl.includes('type=recovery') || fullUrl.includes('access_token=');
    
    if (isRecovering || isRecoveryInUrl) {
        return <Auth initialMode="updatePassword" />;
    }

    if (!session) return <Auth />;

    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.99
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 1,
            transition: {
                duration: 0.15,
                ease: "easeIn"
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={pageVariants}
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
                        <Route path="expenses/edit/:id" element={<ExpenseForm />} />
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
