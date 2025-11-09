
import { lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
import { ArticleType } from '@/data/article';
const LazyArticleListing = lazy(() => import('./components/ArticleListing'))
const LazyArticleCategoryListing = lazy(() => import('./components/ArticleCategoryListing'));
export default function ArticlesManagement({ article_type }: { article_type: ArticleType }) {
  var title = `Blogs`;
  var subtitle = `Manage blogs from this section`;
  var name = `Blog`;

  if (article_type == ArticleType.News) {
    title = 'News';
    subtitle = 'Manage news from this section';
    name = 'News';
  }

  return (
    <AppPage title={title} subtitle={subtitle}>
      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">{name}</TabsTrigger>
          <TabsTrigger value="article_categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <Suspense fallback={<div className='h-[400px] relative'><CenterLoading className='absolute' /></div>}>
            <LazyArticleListing article_type={article_type} />
          </Suspense>
        </TabsContent>

        <TabsContent value="article_categories">
          <Suspense fallback={<div className='h-[400px] relative'><CenterLoading className='absolute' /></div>}>
            <LazyArticleCategoryListing article_type={article_type} />
          </Suspense>
        </TabsContent>

      </Tabs>
    </AppPage>
  );
};

