
import { ArticleType } from '@/data/article';
import ArticlesManagement from './ArticlesManagement';

export default function NewsManagement() {

  return (<ArticlesManagement article_type={ArticleType.News} />);
};

