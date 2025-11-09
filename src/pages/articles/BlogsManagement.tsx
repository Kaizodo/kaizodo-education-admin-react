
import { ArticleType } from '@/data/article';
import ArticlesManagement from './ArticlesManagement';

export default function BlogsManagement() {

  return (<ArticlesManagement article_type={ArticleType.Blog} />);
};

