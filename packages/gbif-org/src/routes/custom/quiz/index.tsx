import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { Quiz } from './Quiz';

export const quizRoute: RouteObjectWithPlugins = {
  id: 'quiz',
  path: 'quiz',
  element: <Quiz />,
};
