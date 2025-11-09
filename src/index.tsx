import { lazy, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { buildRoutes } from './data/router';
import { routes } from './routes';
import { defaultContext, GlobalContext } from './data/global';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from './components/ui/tooltip';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";

import { Toaster as Sonner } from "@/components/ui/sonner";
import './style.css';
import { ModalContainer } from './components/common/Modal';
import { Storage } from './lib/storage';
import CenterLoading from './components/common/CenterLoading';
import { Permissions } from './data/Permissions';
import { UserService } from './services/UserService';
const NotFound404 = lazy(() => import('@/pages/errors/NotFound404'));
const queryClient = new QueryClient();

function App() {
  const [context, setContext] = useState(defaultContext);
  const [proceed, setProceed] = useState(false);
  const init = async () => {
    UserService.permissions = await Storage.get<Permissions[]>('permissions') ?? [];
    setProceed(true);
  }

  useEffect(() => {
    init();
  }, []);


  if (!proceed) {
    return <CenterLoading />
  }


  return (<GlobalContext.Provider value={{ context, setContext }}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HotToaster />
        <BrowserRouter>
          <Routes>
            {buildRoutes(routes, UserService.permissions)}
            <Route path='*/*' element={<NotFound404 />} />
          </Routes>
          <ModalContainer />

        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>


  </GlobalContext.Provider>)
}



createRoot(document.getElementById("root")!).render(<App />);
