
import { lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
const LazyBannerListing = lazy(() => import('./components/BannerListing'))
const LazyBannerCategoryListing = lazy(() => import('./components/BannerCategoryListing'));
export default function BannerManagement() {

  return (
    <AppPage title='Banners' subtitle='Manage various Banners'>
      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="banners">Bannners</TabsTrigger>
          <TabsTrigger value="banners_categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="banners">
          <Suspense fallback={<div className='h-[400px] relative'><CenterLoading className='absolute' /></div>}>
            <LazyBannerListing />
          </Suspense>
        </TabsContent>

        <TabsContent value="banners_categories">
          <Suspense fallback={<div className='h-[400px] relative'><CenterLoading className='absolute' /></div>}>
            <LazyBannerCategoryListing />
          </Suspense>
        </TabsContent>

      </Tabs>
    </AppPage>
  );
};

