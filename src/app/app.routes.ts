import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { WelcomePage } from './welcome-page/welcome-page';
import { Activities } from './activities/activities';
import { loggingGuard } from './logging-guard';
import { UserData } from './services/user-data';
import { AiQuestion } from './ai-question/ai-question';

export const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomePage,
    canActivate: [loggingGuard],
  },
  {
    path: 'activities',
    component: Activities,
    canActivate: [loggingGuard],
  },
  {
    path: 'ai-guestion',
    component: AiQuestion,
    canActivate: [loggingGuard],
  },
  {
    path: '**',
    redirectTo: (activatedRouteSnapshot) => {
      const userData = inject(UserData);

      const token = localStorage.getItem('token') || activatedRouteSnapshot.queryParams['token'];
      if (!token) {
        return '/welcome';
      }
      userData.userToken.set(token);
      localStorage.setItem('token', token);
      return `/activities`;
    },
  },
];
