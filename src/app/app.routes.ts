import { Routes } from '@angular/router';
import { Layoutcomponent } from './layout/layout.component';
import { BuilderComponent } from './page/builder/builder.component';
import { Page404Component } from './page/page404/page404.component';
import { AnswersComponent } from './page/answers/answers.component';

export const routes: Routes = [
    {
        path: 'form', component: Layoutcomponent,
        children: [
            { path: 'builder', component: BuilderComponent },
            { path: 'answers', component: AnswersComponent },
            { path: '', redirectTo: 'builder', pathMatch: 'full' },
        ]
    },

    {
        path: '', redirectTo: 'form', pathMatch: 'full'
    },

    {
        path: '**', component: Page404Component
    }
];
